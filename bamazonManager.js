require('dotenv').config()
var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");
var id;

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
  firstQuestion();
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
          query(`SELECT * FROM products`);
          break;
        case 'View Low Inventory':
          query(`SELECT * FROM products WHERE stock_quantity<5`);
          break;
        case 'Add to Inventory':
          addInv(`SELECT * FROM products`);
          break;
        case 'Add New Product':
          addProduct();
          break;
        default:
          console.log(`Please select a valid answer or you're fired!`);
      }
    })
}

function addInv(SQLstatment) {
  var table = new Table({
    head: ['ID', 'Name', 'Price', 'Quantity']
  });
  var allItems = [];
  connection.query(SQLstatment, function(err, results) {
    for (var i = 0; i < results.length; i++) {
      allItems.push(results[i].product_name);
    }
    inquirer
      .prompt({
        name: `selected`,
        message: `Select the item you would like to add`,
        type: `list`,
        choices: allItems,
      }).then(function(item) {
        inquirer
          .prompt({
            name: `ammount`,
            message: `How many ${item.selected}s would you like to add?`,
            type: `input`
          }).then(function(add) {
            //need to get the ID of the item selected--- LAME
            connection.query(`SELECT id FROM products WHERE product_name="${item.selected}"`, function(err, result) {
              if (err) throw err;
              connection.query(`UPDATE products SET stock_quantity=stock_quantity + ${add.ammount} WHERE id=${result[0].id}`, function(err, result) {
                if (err) throw err;
                console.log(`you added ${add.ammount} ${item.selected}s to invintory! You deserve a raise!`);
                connection.end();
              });
            });

          })

      })
  });
}

function addProduct() {
  inquirer
    .prompt([{
        name: `newItemName`,
        message: `What would you like to add?`,
        type: `input`
      },
      {
        name: `quantity`,
        message: `Quantity:`,
        type: `input`
      },
      {
        name: `department`,
        message: 'Department:',
        type: `input`
      },
      {
        name: `price`,
        message: `Price: $`,
        type: `input`
      }
    ]).then(function(results) {
      if (isNaN(results.price)) {
        console.log(`Please enter a number for Price! Now let's try this again...`);
        addProduct();

      } else if (isNaN(results.quantity)) {
        console.log(`Please enter a number for quantity! Now let's try this again...`);
        addProduct();
      } else {
        connection.query(`INSERT INTO products (product_name, department_name, price, stock_quantity)
        VALUES ("${results.newItemName}", "${results.department}", ${results.price}, ${results.quantity})`, function(err) {
          if (err) throw err;
          console.log(`You entered ${results.newItemName} into the Database! Now dow a little Dance!!`);
          connection.end();
        })
      }
    })
}

function query(query) {
  var table = new Table({
    head: ['ID', 'Name', 'Price', 'Quantity']
  });
  console.log(`Running Query: ${query}`);
  connection.query(query, function(err, results) {
    if (err) throw err;
    for (var i = 0; i < results.length; i++) {
      table.push([results[i].id, results[i].product_name, results[i].price, results[i].stock_quantity])
    }
    console.log(table.toString());
    table = [];
    connection.end();
  });
}
