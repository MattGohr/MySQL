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
    }else {
      console.log(`you didn't fuck this up! congrats!`);
    }
    connection.end();
  });
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

// // function which prompts the user for what action they should take
// function start() {
//   inquirer
//     .prompt({
//       name: "postOrBid",
//       type: "rawlist",
//       message: "Would you like to [POST] an auction or [BID] on an auction?",
//       choices: ["POST", "BID"]
//     })
//     .then(function(answer) {
//       // based on their answer, either call the bid or the post functions
//       if (answer.postOrBid.toUpperCase() === "POST") {
//         postAuction();
//       }
//       else {
//         bidAuction();
//       }
//     });
// }
//
// // function to handle posting new items up for auction
// function postAuction() {
//   // prompt for info about the item being put up for auction
//   inquirer
//     .prompt([
//       {
//         name: "item",
//         type: "input",
//         message: "What is the item you would like to submit?"
//       },
//       {
//         name: "category",
//         type: "input",
//         message: "What category would you like to place your auction in?"
//       },
//       {
//         name: "startingBid",
//         type: "input",
//         message: "What would you like your starting bid to be?",
//         validate: function(value) {
//           if (isNaN(value) === false) {
//             return true;
//           }
//           return false;
//         }
//       }
//     ])
//     .then(function(answer) {
//       // when finished prompting, insert a new item into the db with that info
//       connection.query(
//         "INSERT INTO auctions SET ?",
//         {
//           item_name: answer.item,
//           category: answer.category,
//           starting_bid: answer.startingBid,
//           highest_bid: answer.startingBid
//         },
//         function(err) {
//           if (err) throw err;
//           console.log("Your auction was created successfully!");
//           // re-prompt the user for if they want to bid or post
//           start();
//         }
//       );
//     });
// }
//
// function selectFrom(table) {
//   // query the database for all items being auctioned
//   connection.query(`SELECT * FROM ${table}`, function(err, results) {
//     if (err) throw err;
//     // once you have the items, prompt the user for which they'd like to bid on
//     console.log(results);
//   });
// }
//
// function bidAuction() {
//   // query the database for all items being auctioned
//   connection.query("SELECT * FROM auctions", function(err, results) {
//     if (err) throw err;
//     // once you have the items, prompt the user for which they'd like to bid on
//     inquirer
//       .prompt([
//         {
//           name: "choice",
//           type: "rawlist",
//           choices: function() {
//             var choiceArray = [];
//             for (var i = 0; i < results.length; i++) {
//               choiceArray.push(results[i].item_name);
//             }
//             return choiceArray;
//           },
//           message: "What auction would you like to place a bid in?"
//         },
//         {
//           name: "bid",
//           type: "input",
//           message: "How much would you like to bid?"
//         }
//       ])
//       .then(function(answer) {
//         // get the information of the chosen item
//         var chosenItem;
//         for (var i = 0; i < results.length; i++) {
//           if (results[i].item_name === answer.choice) {
//             chosenItem = results[i];
//           }
//         }
//
//         // determine if bid was high enough
//         if (chosenItem.highest_bid < parseInt(answer.bid)) {
//           // bid was high enough, so update db, let the user know, and start over
//           connection.query(
//             "UPDATE auctions SET ? WHERE ?",
//             [
//               {
//                 highest_bid: answer.bid
//               },
//               {
//                 id: chosenItem.id
//               }
//             ],
//             function(error) {
//               if (error) throw err;
//               console.log("Bid placed successfully!");
//               start();
//             }
//           );
//         }
//         else {
//           // bid wasn't high enough, so apologize and start over
//           console.log("Your bid was too low. Try again...");
//           start();
//         }
//       });
//   });
// }
