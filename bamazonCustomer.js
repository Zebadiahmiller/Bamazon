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
    // afterConnection();
    buyItem();
});

 

function buyItem() {
    connection.query("SELECT * FROM products", function (err, results) {
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
                    message: "What would you like to buy?"
                },
                {
                    name: "amount",
                    type: "input",
                    message: "How much product you like to buy?"
                }
            ]).then(function(answer){
               let choosed;
               for (let i = 0; i < results.length; i++){
                   if (results[i].product_name === answer.choice){
                       choosed = results[i];
                    //    console.log(choosed);
                   }
               }
            //    console.log(choosed.stock_quantity);

            
                if (choosed.stock_quantity > parseInt(answer.amount)){
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                        {
                            stock_quantity: choosed.stock_quantity - answer.amount
                        },
                        {
                            id: choosed.id
                        }
                    ],
                            function(err){
                                if (err) throw err;
                                console.log("item purchased");
                                console.log("Total Purchase amount was: " + answer.amount*choosed.price);
                                
                            },
                            )
                            connection.query(
                                "UPDATE products SET ? WHERE ?",
                                [
                                    {
                                        product_sales: answer.amount*choosed.price
                                    },
                                    {
                                        id: choosed.id
                                    }
                                ],
                                function(err){
                                    if (err) throw err;
                                    connection.end();
                    }
                    )

                    
                   
        

                       
                        
                }
            
               else {
                   console.log("Insufficient Quanitity!!")
                   connection.end();
               }
            
            })
            
        });
        
        
}


