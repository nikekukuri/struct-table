use async_graphql::{EmptySubscription, Schema, SimpleObject};

use crate::model::mutation::MutationRoot;
use crate::model::query::QueryRoot;

pub mod mutation;
pub mod query;

pub type TableSchema = Schema<QueryRoot, MutationRoot, EmptySubscription>;

#[derive(SimpleObject)]
pub struct ChildTable {
    pub id: i32,
    pub col1: String,
    pub col2: String,
    pub col3: i32,
    pub col4: f64,
}
