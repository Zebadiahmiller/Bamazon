const mysql = require("mysql");
const inquirer = require("inquirer")

const connection = mysql.createConnection({
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazondb",
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    checkInventoryStart();
});

function checkInventoryStart(){
    inquirer
    .prompt(
        {
            name:"choice",
            type:"list",
            message:"What would you like to do?",
            choices: ["View Products for Sale","View Low Inventory","Add to Inventory","Add New Product", "Exit"]

        }
    ).then(function(answer){
        if (answer.choice === "View Products for Sale"){
            productView();
        }
        else if(answer.choice === "View Low Inventory"){
            lowInventoryView();
        }
        else if(answer.choice === "Add to Inventory"){
            addInventory();
        }
        else if(answer.choice === "Add New Product"){
            addProduct();
        }
        else{
            connection.end();
        }
    })

}

function productView(){
    connection.query("SELECT * FROM products", function(err, results){
        if(err) throw err;

        for (let i =0; i < results.length; i++){
            console.table(results[i]);

        }
        console.log("Inventory above")
       console.log("-----------------------------------------------------------")
        checkInventoryStart();
    })
}
