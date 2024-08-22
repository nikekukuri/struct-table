use async_graphql::{EmptySubscription, Object, Schema};

use crate::db::{ExampleRecord, TableRecord};
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

#[warn(unused_macros)]
macro_rules! async_getters {
    ($struct_name:ident, { $($field:ident : $type:ty),* $(,)? }) => {
        impl $struct_name {
            $(
                pub async fn $field(&self) -> $type {
                    self.$field.clone()
                }
            )*
        }
    };
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

#[derive(Debug)]
pub struct ExampleTable {
    pub passenger_id: i32,
    pub survived: i32,
    pub pclass: i32,
    pub name: String,
    pub sex: String,
    pub age: f64,
    pub sibsp: i32,
    pub parch: i32,
    pub ticket: String,
    pub fare: f64,
    pub cabin: String,
    pub embarked: String,
}

impl From<ExampleRecord> for ExampleTable {
    fn from(
        ExampleRecord {
            passenger_id,
            survived,
            pclass,
            name,
            sex,
            age,
            sibsp,
            parch,
            ticket,
            fare,
            cabin,
            embarked,
        }: ExampleRecord,
    ) -> Self {
        Self {
            passenger_id,
            survived,
            pclass,
            name,
            sex,
            age,
            sibsp,
            parch,
            ticket,
            fare,
            cabin,
            embarked,
        }
    }
}

#[Object]
impl ExampleTable {
    async fn passenger_id(&self) -> i32 {
        self.passenger_id
    }

    async fn survived(&self) -> i32 {
        self.survived
    }

    async fn pclass(&self) -> i32 {
        self.pclass
    }

    async fn name(&self) -> &str {
        &self.name
    }

    async fn sex(&self) -> &str {
        &self.sex
    }

    async fn age(&self) -> f64 {
        self.age
    }

    async fn sibsp(&self) -> i32 {
        self.sibsp
    }

    async fn parch(&self) -> i32 {
        self.parch
    }

    async fn ticket(&self) -> &str {
        &self.ticket
    }

    async fn fare(&self) -> f64 {
        self.fare
    }

    async fn cabin(&self) -> &str {
        &self.cabin
    }

    async fn embarked(&self) -> &str {
        &self.embarked
    }
}
