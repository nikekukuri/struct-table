create table child_table (
	id serial not null primary key
	, col1 text not null
	, col2 text not null
	, col3 INTEGER not null
	, col4 DOUBLE PRECISION not null
	, created_at timestamp not null
);

create table grand_child_table (
	id serial not null primary key
	, col1 text not null
	, col2 text not null
	, created_at timestamp not null
);
