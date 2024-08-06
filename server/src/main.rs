use async_graphql::{http::GraphiQLSource, EmptySubscription, Schema};
use async_graphql_rocket::{GraphQLQuery, GraphQLRequest, GraphQLResponse};
use rocket::{http::Method, response::content, routes, State};
use sqlx::postgres::PgPoolOptions;
use rocket_cors::{AllowedHeaders, AllowedOrigins, CorsOptions};

mod db;
mod model;

use crate::model::{mutation::MutationRoot, query::QueryRoot, TableSchema};

#[rocket::get("/")]
fn graphiql() -> content::RawHtml<String> {
    content::RawHtml(GraphiQLSource::build().endpoint("/graphql").finish())
}

#[rocket::get("/graphql?<query..>")]
async fn graphql_query(schema: &State<TableSchema>, query: GraphQLQuery) -> GraphQLResponse {
    query.execute(schema.inner()).await
}

#[rocket::post("/graphql", data = "<request>", format = "application/json")]
async fn graphql_request(schema: &State<TableSchema>, request: GraphQLRequest) -> GraphQLResponse {
    request.execute(schema.inner()).await
}

#[rocket::launch]
async fn rocket() -> _ {
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect("postgresql:///struct_table")
        .await
        .unwrap();
    //let query_root = QueryRoot;
    let scheme = Schema::build(QueryRoot, MutationRoot, EmptySubscription)
        .data(pool)
        .finish();
    let cors_options = cors_options().to_cors().unwrap();

    rocket::build()
        .manage(scheme)
        .mount("/", routes![graphiql, graphql_query, graphql_request])
        .attach(cors_options)
}

fn cors_options() -> CorsOptions {
    let allowed_origins = AllowedOrigins::some_exact(&["https://localhost:3001"]);

    CorsOptions {
        allowed_origins,
        allowed_methods: vec![Method::Get, Method::Post].into_iter().map(Into::into).collect(),
        allow_credentials: true,
        ..Default::default()
    }
}
