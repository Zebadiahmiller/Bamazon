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
        console.table(results)

        // for (let i =0; i < results.length; i++){
        //     console.table(results[i]);

        // }
        console.log("Inventory above")
       console.log("-----------------------------------------------------------")
        checkInventoryStart();
    })
}

function lowInventoryView(){
    connection.query("SELECT * FROM products", function(err, results){
        if (err) throw err;

        for (let i =0; i < results.length; i++){
            if (results[i].stock_quantity <= 5){
            console.table(results[i]);
            console.log("-----------------------------")
            console.log("low inventory above")
            }
        }
     checkInventoryStart();
    });
};
function addInventory(){
    connection.query("SELECT * FROM products", function(err, results){
        if (err) throw err;
    inquirer
    .prompt([
        {
            name: "choice",
            type: "rawlist",
            choices: function () {
                const chooser = [];
                for (let i = 0; i < results.length; i++) {
                    chooser.push(results[i].product_name)
                    // console.log(chooser)
                };


                return chooser;

            },
            message: "What inventory item would you like to update?"
        },
        {
            name:"amount",
            type: "input",
            message:"How much inventory would you like to add?",
            validate: function(value){
                if (isNaN(value) === false){
                return true;
                }
                return false
            }

        }
    ]).then(function(answer){
        let choosed;
        for (let i = 0; i < results.length; i++){
            if (results[i].product_name === answer.choice){
                choosed = results[i];
               
            }
        }  
        connection.query(
            "UPDATE products SET ? WHERE ?",
            [
            {
                stock_quantity: parseInt(answer.amount) + parseInt(choosed.stock_quantity) 
            },
            {
                id: choosed.id
            }
        ], function(error) {
            if (error) throw err;
            console.log("inventory updated!");
            checkInventoryStart();
          }
        )
                       
                
        
    })
});
}


function addProduct(){
    inquirer
    .prompt([
        {
            name:"ID",
            type:"input",
            message:"What is the id number of this product?",
            validate: function(value){
                if (isNaN(value) === false){
                return true;
                }
                return false
            }
            
        },
        {
            name:"product",
            type:"input",
            message:"What product would you like to add to the invetory?"
        },
        {
            name:"department",
            type:"input",
            message:"What department does this product belong?"
        },
        {
            name:"price",
            type:"input",
            message:"How much does each item cost?",
            validate: function(value){
                if (isNaN(value) === false){
                return true;
                }
                return false
            }
            
        },
        {
            name:"stock",
            type:"input",
            message:"How much stock of this item do we have?",
            validate: function(value){
                if (isNaN(value) === false){
                return true;
                }
                return false
            }
            
        },
       
        

    ]).then(function(answer){
        connection.query(
            "INSERT INTO products SET ?",
            {
                id:answer.ID,
                product_name: answer.product,
                department_name: answer.department,
                price: answer.price,
                stock_quantity: answer.stock
            },
            function(err){
                if(err) throw err;
                console.log("New inventory added.");
                checkInventoryStart();
            }
        )
       
    })


}