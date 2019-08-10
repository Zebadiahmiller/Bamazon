CREATE DATABASE bamazondb;

use bamazondb;

create table products
(
  id integer(100) not null,
  product_name varchar(50) not null,
  department_name varchar(100) not null,
  product_sales integer,
  price decimal(20,2) not null,
  stock_quantity integer not null,

);

INSERT INTO products
  (product_name, department_name, price, stock_quantity)
VALUES
  ("Hot Sauce", "Food", 10.23, 1000),
  ("Celery", "Food", 0.99, 100),
  ("Computers", "Electronics", 1000.87, 50000),
  ("Calculators", "Electronics", 275.75, 9999),
  ("Flux Capacitor", "Electronics", 200000.00, 1),
  ("Lightsaber", "Electronics", 59.75, 33),
  ("Cool Shirt", "Clothing", 27.23, 100),
  ("Hammer", "Tools", 19.12, 47),
  ("Nail", "Tools", 00.23, 52),
  ("Level", "Tools", 34.50, 537);

create table departments
(
  department_id integer(100) not null,
  department_name varchar(100) not null,
  over_head_costs decimal(20,2) not null
);
INSERT INTO departments
  (department_id, department_name, over_head_costs)
VALUES(57, "Food", 2000),
  (512, "Electronics", 5000),
  (157, "Clothing", 3450),
  (48, "Tools", 780);
    