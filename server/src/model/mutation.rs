use anyhow::Result;
use async_graphql::{InputObject, Object};
use sqlx::postgres::PgPool;

use crate::model::ChildTable;
use crate::db::TableRecord;

pub struct MutationRoot;

#[derive(InputObject)]
struct CreateTableInput {
    col1: String,
    col2: String,
    col3: i32,
    col4: f64,
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
        };
        tx.commit().await?;
        Ok(gql_table)
    }
}

