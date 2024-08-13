use chrono::NaiveDateTime;
use sqlx::prelude::*;

#[derive(Debug, FromRow)]
pub struct TableRecord {
    pub id: i32,
    pub col1: String,
    pub col2: String,
    pub col3: i32,
    pub col4: f64,
    pub created_at: NaiveDateTime,
}

#[derive(Debug, FromRow)]
pub struct ExampleRecord {
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
