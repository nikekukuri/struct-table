copy titanic_table(passenger_id, survived, pclass, name, sex, age, sibsp, parch, ticket, fare, cabin, embarked) 
from '/home/guy/develop/github.com/repo/table-server/server/examples/titanic.csv' 
delimiter ',' 
csv header;
