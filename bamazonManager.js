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
  // for (var i = 0; i < results.length; i++) {
  //   table.push([results[i].id, results[i].product_name, results[i].price, results[i].stock_quantity])
  // }

  console.log(table.toString());
  return firstQuestion();

});

function firstQuestion() {
  inquirer
    .prompt({
      name: `answer`,
      message: `List a set of menu options:`,
      choices: [`View Products for Sale`, `View Low Inventory`, `Add to Inventory`, `Add New Product`],
      type: `list`
    }).then(function(choices) {
      console.log(choices.answer);
      switch (choices.answer) {
        case 'View Products for Sale':
          viewProducts();
          break;
        case 'View Low Inventory':
          viewLowInv();
          break;
        case 'Add to Inventory':
          addInv();
          break;
        case 'Add New Product':
          addProduct();
          break;
        default:
          console.log(`Please select a valid answer or you're fired!`);

      }
    })
}


function addProduct() {
  //`SELECT * FROM products WHERE id=${id}`

}

function addInv() {

}

function viewLowInv() {

}

function viewProducts() {

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

function checkOut(query) {
  connection.query(, function(err, results) {
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
