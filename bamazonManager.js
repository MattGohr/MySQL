require('dotenv').config()
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
var id;

var table = new Table({
  head: ['ID', 'Name', 'Price', 'Quantity']
});

var connection = mysql.createConnection({
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USER,
  password: process.env.PW,
  database: process.env.DB
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
});

connection.query(`SELECT * FROM products`, function(err, results) {
  if (err) throw err;
  for (var i = 0; i < results.length; i++) {
    table.push([results[i].id, results[i].product_name, results[i].price, results[i].stock_quantity])
  }

  console.log(table.toString());
  return firstQuestion();

});

function firstQuestion() {
  inquirer
    .prompt({
      name: `id`,
      message: `Please enter the ID of the item you would like to buy?`,
      type: `input`
    }).then(function(input) {
      id = parseInt(input.id);
      if (isNaN(id)) {
        console.log(`Please provide a number.  You provided a ${typeof(input.id)}!`);
        return firstQuestion();
      } else {
        return askHowMany();
      }
    })
}

function askHowMany() {
  inquirer
    .prompt({
      name: `quantity`,
      message: `How Many Would You Like?`,
      type: `input`
    }).then(function(input) {
      var quantity = parseInt(input.quantity);
      if (isNaN(quantity)) {
        console.log(`Please enter a number!`);
        return askHowMany();
      } else {
        checkOut(quantity);
      }
    })
}

function checkOut(requestedQuantity) {
  connection.query(`SELECT * FROM products WHERE id=${id}`, function(err, results) {
    if (err) throw err;
    var stockQuantity = results[0].stock_quantity;
    var price = results[0].price;

    if (requestedQuantity > stockQuantity) {
      console.log(`We don't have that much in stock!!`);
      return askHowMany(id);
    } else {
      console.log(`Transaction Complete!`);
      console.log(`Your total is $${price * requestedQuantity}`);
      return calculateTotal(stockQuantity - requestedQuantity, price);
    }
    connection.end();
  });
}

function calculateTotal(newQuantity, price) {
  connection.query(`UPDATE products SET stock_quantity=${newQuantity} WHERE id=${id}`, function(err, result) {
    connection.end();
  })
}
