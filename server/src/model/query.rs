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
}
