use crate::db::{ExampleRecord, TableRecord};
use crate::model::{ChildTable, ExampleTable};
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

    async fn get_all_columns_by_id(
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
    ) -> Result<Vec<ChildTable>, async_graphql::Error> {
        let pool = ctx.data::<PgPool>()?;
        let table_record_vec: Vec<TableRecord> =
            sqlx::query_as("select id, col1, col2, col3, col4, created_at from child_table")
                .fetch_all(pool)
                .await?;

        Ok(table_record_vec.into_iter().map(Into::into).collect())
    }

    async fn get_table_columns(
        &self,
        ctx: &async_graphql::Context<'_>,
        table_name: String,
    ) -> Result<Vec<String>, async_graphql::Error> {
        let pool = ctx.data::<PgPool>()?;
        let columns = sqlx::query_as::<_, (String,)>(
            "select column_name from information_schema.columns where table_name = $1;",
        )
        .bind(table_name)
        .fetch_all(pool)
        .await
        .unwrap();

        let column_names = columns.into_iter().map(|c| c.0).collect::<Vec<String>>();
        Ok(column_names)
    }

    async fn get_example_records(
        &self,
        ctx: &async_graphql::Context<'_>,
    ) -> Result<Vec<ExampleTable>, async_graphql::Error> {
        let pool = ctx.data::<PgPool>()?;
        let table_record_vec: Vec<ExampleRecord> = sqlx::query_as(
            "
                select 
                    passenger_id
                    , survived
                    , pclass
                    , coalesce(name, '') as name
                    , coalesce(sex, '') as sex
                    , coalesce(age, 0.0) as age
                    , coalesce(sibsp, 0) as sibsp
                    , coalesce(parch, 0) as parch
                    , coalesce(ticket, '') as ticket
                    , coalesce(fare, 0.0) as fare
                    , coalesce(cabin, '') as cabin
                    , coalesce(embarked, '') as embarked
                from titanic_table;",
        )
        .fetch_all(pool)
        .await?;

        Ok(table_record_vec.into_iter().map(Into::into).collect())
    }
}
