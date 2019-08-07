CREATE DATABASE bamazondb;

use bamazondb;

create table products(
	id integer(100) auto_increment not null,
    product_name varchar(50) not null,
    department_name varchar(100) not null,
    price decimal(20,2) not null,
    stock_quantity integer not null,
    primary key(id)
    );
    
    INSERT INTO products (product_name, department_name, price, stock_quantity)
		VALUES ("Hot Sauce", "Food", 10.23, 1000),("Celery", "Food", 0.99, 100),
        ("Computers", "Electronics", 1000.87, 50000),("Calculators", "Electronics", 275.75, 9999),
        ("Flux Capacitor", "Electronics", 200000.00, 1),("Lightsaber", "Electronics", 59.75, 33),
        ("Cool Shirt", "Clothing", 27.23, 100),("Hammer", "Tools", 19.12, 47),
        ("Nail", "Tools", 00.23, 52),("Level", "Tools", 34.50, 537);
