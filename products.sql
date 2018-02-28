-- Drops the animals_db if it exists currently --
DROP DATABASE IF EXISTS bamazon;
-- Creates the "animals_db" database --
CREATE DATABASE bamazon;

-- Makes it so all of the following code will affect animals_db --
USE bamazon;

-- Creates the table "products" within animals_db --
CREATE TABLE products (
  id INTEGER(11) AUTO_INCREMENT NOT NULL,

  product_name VARCHAR(30) NOT NULL,

  department_name VARCHAR(30) NOT NULL,

  price INTEGER(10) NOT NULL,

  stock_quantity INTEGER(10) NOT NULL,

  PRIMARY KEY (id)
);

-- Creates new rows containing data in all named columns --
INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("toilet paper", "bathroom", 300, 100);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("towel", "bathroom", 5, 5);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("couch", "furnature", 325, 3);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("jacket", "clothing", 15, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("left shoe", "clothing", 5, 25);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("right shoe", "clothing", 5, 25);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("computer", "electronics", 150, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("mouse", "electronics", 5, 50);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("keyboard", "electronics", 15, 20);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("fridge", "appliances", 50, 10);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("paper", "office supplies", 501, 500);
