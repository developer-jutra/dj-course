-- Schema and seed data for persons table
DROP TABLE IF EXISTS persons;
CREATE TABLE persons (
	id INT PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	age INT NOT NULL
);

INSERT INTO persons (id, name, age) VALUES
	(1, 'Alice', 30),
	(2, 'Bob', 24),
	(3, 'Charlie', 28),
	(4, 'Diana', 35),
	(5, 'Eve', 22),
	(6, 'Frank', 33),
	(7, 'Grace', 27),
	(8, 'Hank', 31),
	(9, 'Ivy', 29),
	(10, 'Jack', 26);
