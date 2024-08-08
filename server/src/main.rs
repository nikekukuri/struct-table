use async_graphql::{http::GraphiQLSource, EmptySubscription, Schema};
use async_graphql_rocket::{GraphQLQuery, GraphQLRequest, GraphQLResponse};
use rocket::{http::{Method, Header}, response::content, routes, State, Request, Response};
use rocket::fairing::{Fairing, Info, Kind};
use sqlx::postgres::PgPoolOptions;
use rocket_cors::{AllowedHeaders, AllowedOrigins, CorsOptions};

mod db;
mod model;

use crate::model::{mutation::MutationRoot, query::QueryRoot, TableSchema};

pub struct CustomCros;

#[rocket::async_trait]
impl Fairing for CustomCros {
    fn info(&self) -> Info {
        Info {
            name: "Custom CORS",
            kind: Kind::Response
        }
    }

    async fn on_response<'r>(&self, req: &'r Request<'_>, res: &mut Response<'r>) {
        if req.method() == rocket::http::Method::Options {
            res.set_status(rocket::http::Status::Ok);
        }
        res.set_header(Header::new("Access-Control-Allow-Origin", "*"));
        res.set_header(Header::new("Access-Control-Allow-Methods", "GET, POST, OPTIONS"));
        res.set_header(Header::new("Access-Control-Allow-Headers", "Authorization, Content-Type"));
    }
}


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

#[rocket::options("/graphql")]
fn graphql_options() -> &'static str {
    ""
}

#[rocket::launch]
async fn rocket() -> _ {
    let pool = PgPoolOptions::new()
        .max_connections(5)
        .connect("postgresql:///struct_table")
        .await
        .unwrap();
    let scheme = Schema::build(QueryRoot, MutationRoot, EmptySubscription)
        .data(pool)
        .finish();

    rocket::build()
        .manage(scheme)
        .mount("/", routes![graphiql, graphql_query, graphql_request, graphql_options])
        .attach(CustomCros)
}

fn cors_options() -> CorsOptions {
    let allowed_origins = AllowedOrigins::some_exact(&["https://localhost:3000"]);

    CorsOptions {
        allowed_origins,
        allowed_methods: vec![Method::Get, Method::Post, Method::Options].into_iter().map(From::from).collect(),
        allowed_headers: AllowedHeaders::all(),
        allow_credentials: true,
        
        ..Default::default()
    }
}
