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
    start();
});
function start(){

    inquirer
    .prompt([
        {
            name:"choice",
            type:"list",
            message:"What would you like to do?",
            choices: ["View products for sale?","Purchase an item?", "Exit"]
            
        }
    ]).then(function(answer){
        if (answer.choice === "View products for sale?"){
            viewProducts();
        }
        else if(answer.choice === "Purchase an item?"){
            buyItem();
        }      
        else{
            connection.end();
        }
    })

};

    function viewProducts(){
        connection.query("SELECT * FROM products", function(err, results){
        if(err) throw err;
        console.table(results)

        // for (let i =0; i < results.length; i++){
        //     console.table(results[i]);

        // }
        console.log("Items for sale are listed in the above table.")
       console.log("-----------------------------------------------------------")
       start();
    
    })};
       
    


 

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

            
                if (parseInt(choosed.stock_quantity) > parseInt(answer.amount)){
                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                        {
                            stock_quantity: parseInt(choosed.stock_quantity) - parseInt(answer.amount)
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
                                        product_sales: parseFloat(choosed.product_sales) + parseFloat(answer.amount)*parseFloat(choosed.price)
                                    },
                                    {
                                        id: choosed.id
                                    }
                                ],
                                function(err){
                                    if (err) throw err;
                                    start();
                    }
                    )

                    
                   
        

                       
                        
                }
            
               else {
                   console.log("Insufficient Quanitity!!")
                   start();
               }
            
            })
            
        });
        
        
}


