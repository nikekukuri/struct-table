use crate::db::TableRecord;
use crate::model::ChildTable;
use async_graphql::Object;
use sqlx::postgres::PgPool;

pub struct QueryRoot;

#[Object]
impl QueryRoot {
    async fn answer(&self, ctx: &async_graphql::Context<'_>) -> Result<i32, async_graphql::Error> {
        let pool = ctx.data::<PgPool>()?;
        let (answer,): (i32,) = sqlx::query_as("select 42;").fetch_one(pool).await?;
        Ok(answer)
    }

    async fn get_all_columns(
        &self,
        ctx: &async_graphql::Context<'_>,
        id: i32,
    ) -> Result<Option<ChildTable>, async_graphql::Error> {
        let pool = ctx.data::<PgPool>()?;
        let table_record: Option<TableRecord> = sqlx::query_as(
            "select id, col1, col2, col3, col4, created_at from child_table where id = $1;",
        )
        .bind(id)
        .fetch_optional(pool)
        .await?;
        let table = table_record.map(Into::into);
        Ok(table)
    }

    async fn get_all_records(
        &self,
        ctx: &async_graphql::Context<'_>,
        id: i32,
    ) -> Result<Vec<ChildTable>, async_graphql::Error> {
        let pool = ctx.data::<PgPool>()?;
        let table_record_vec: Vec<TableRecord> = sqlx::query_as(
            "select id, col1, col2, col3, col4, created_at from child_table",
        )
        .bind(id)
        .fetch_all(pool)
        .await?;

        //let table = table_record_vec.map(Into::into);
        Ok(table_record_vec.into_iter().map(Into::into).collect())
    }
}
