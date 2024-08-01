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
