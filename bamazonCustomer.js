var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
var id;

var table = new Table({
  head: ['ID', 'Name', 'Price', 'Quantity']
});

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "fatboy11",
  database: "bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
});

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
  console.log(`requestedQuantity: ${requestedQuantity}`);
  connection.query(`SELECT * FROM products WHERE id=${id}`, function(err, results) {
    if (err) throw err;
    // once you have the items, prompt the user for which they'd like to bid on
    var stockQuantity = results[0].stock_quantity
    console.log(`geting ready to calculate quantity!`);

    if (requestedQuantity > stockQuantity) {
      console.log(`We don't have that much in stock!!`);
      return askHowMany(id);
    } else {
      console.log(`Transaction Complete!`);
      return calculateTotal(requestedQuantity);
    }
    connection.end();
  });
}

function calculateTotal (quantity) {
  connection.query(`SELECT * `)
}

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
        return;
      } else {
        console.log(`congrats you entered a number`);
        return askHowMany();
      }
    })
}

connection.query(`SELECT * FROM products`, function(err, results) {
  if (err) throw err;
  // once you have the items, prompt the user for which they'd like to bid on
  console.log(`calling inital tabel`);

  for (var i = 0; i < results.length; i++) {
    table.push([results[i].id, results[i].product_name, results[i].price, results[i].stock_quantity])
  }

  console.log(table.toString());
  return firstQuestion();

});
