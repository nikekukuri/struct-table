use async_graphql::{EmptySubscription, Object, Schema};

use crate::db::TableRecord;
use crate::model::mutation::MutationRoot;
use crate::model::query::QueryRoot;

pub mod mutation;
pub mod query;

pub type TableSchema = Schema<QueryRoot, MutationRoot, EmptySubscription>;

#[derive(Debug)]
pub struct ChildTable {
    pub id: i32,
    pub col1: String,
    pub col2: String,
    pub col3: i32,
    pub col4: f64,
    pub created_at: chrono::NaiveDateTime,
}

impl From<TableRecord> for ChildTable {
    fn from(
        TableRecord {
            id,
            col1,
            col2,
            col3,
            col4,
            created_at,
        }: TableRecord,
    ) -> Self {
        Self {
            id,
            col1,
            col2,
            col3,
            col4,
            created_at,
        }
    }
}

#[Object]
impl ChildTable {
    async fn id(&self) -> i32 {
        self.id
    }

    async fn col1(&self) -> &str {
        &self.col1
    }

    async fn col2(&self) -> &str {
        &self.col2
    }

    async fn col3(&self) -> i32 {
        self.col3
    }

    async fn col4(&self) -> f64 {
        self.col4
    }
}
