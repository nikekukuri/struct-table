use std::fs::File;

use anyhow::Result;
use async_graphql::{InputObject, Object, SimpleObject};
use csv::ReaderBuilder;
use sqlx::postgres::PgPool;

use crate::db::TableRecord;
use crate::model::ChildTable;

pub struct MutationRoot;

#[derive(InputObject)]
struct CreateTableInput {
    col1: String,
    col2: String,
    col3: i32,
    col4: f64,
}

#[derive(SimpleObject)]
struct MutationResult {
    message: String,
}

#[Object]
impl MutationRoot {
    async fn create_table(
        &self,
        ctx: &async_graphql::Context<'_>,
        input: CreateTableInput,
    ) -> Result<ChildTable, async_graphql::Error> {
        let pool = ctx.data::<PgPool>()?;
        let mut tx = pool.begin().await?;
        let sql = "
            insert into child_table (
                col1, col2, col3, col4, created_at
            )
            values (
                $1, $2, $3, $4, current_timestamp
            )
            returning
                id, col1, col2, col3, col4, created_at
            ;
        ";

        let table_record: TableRecord = sqlx::query_as(sql)
            .bind(input.col1)
            .bind(input.col2)
            .bind(input.col3)
            .bind(input.col4)
            .fetch_one(&mut *tx)
            .await?;
        let gql_table = ChildTable {
            id: table_record.id,
            col1: table_record.col1,
            col2: table_record.col2,
            col3: table_record.col3,
            col4: table_record.col4,
            created_at: table_record.created_at,
        };
        tx.commit().await?;
        Ok(gql_table)
    }

    async fn create_table_from_csv(
        &self,
        ctx: &async_graphql::Context<'_>,
        csv_file_path: String,
        table_name: String,
    ) -> Result<MutationResult, async_graphql::Error> {
        let pool = ctx.data::<PgPool>()?;
        let mut tx = pool.begin().await?;

        let file = File::open(csv_file_path)?;
        let mut rdr = ReaderBuilder::new().has_headers(true).from_reader(file);

        // Get the headers from the CSV file
        let headers = rdr.headers()?.clone();

        // Create the INSERT query dynamically
        let columns: Vec<&str> = headers.iter().collect();
        let column_names = columns.join(", ");
        let placeholders = (1..=columns.len())
            .map(|i| format!("${}", i))
            .collect::<Vec<_>>()
            .join(", ");

        // Create table
        let mut create_table_sql = format!("CREATE TABLE IF NOT EXISTS {} (", table_name);
        for column in &columns {
            create_table_sql.push_str(&format!("{} TEXT,", column));
        }
        create_table_sql.pop(); // delete last comma
        create_table_sql.push_str(");");
        sqlx::query(&create_table_sql).execute(&mut *tx).await?;

        let sql = format!(
            "insert into {} ({}) values ({})",
            table_name, column_names, placeholders
        );

        for result in rdr.records() {
            let record = result?;
            let mut query = sqlx::query(&sql);

            for (i, field) in record.iter().enumerate() {
                query = query.bind(field);
            }

            query.execute(&mut *tx).await?;
        }

        tx.commit().await?;
        Ok(MutationResult {
            message: "Successfully inserted data from CSV file".to_string(),
        })
    }
}
