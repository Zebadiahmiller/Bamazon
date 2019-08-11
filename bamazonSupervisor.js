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
    departmentCheck();
});

function departmentCheck(){
    inquirer
    .prompt(
        {
            name:"choice",
            type:"list",
            message:"What would you like to do?",
            choices: ["View product sales?","Add new department?", "Exit"]

        }
    ).then(function(answer){
        if (answer.choice === "View product sales?"){
            productView();
        }
        else if(answer.choice === "Add new department?"){
            addDepartment();
        }       
        else{
            connection.end();
        }
    })

}


function productView(){

    // let query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, products.product_sales";
    // query += "FROM departments INNER JOIN products ON departments.department_name = products.department_name";
    connection.query("SELECT departments.department_id, departments.department_name, departments.over_head_costs,products.product_name, products.product_sales FROM departments INNER JOIN products ON departments.department_name = products.department_name", function(err, results){
       for (let i=0; i<results.length; i++){
        console.table([
           {
               department_id:results[i].department_id,
               department_name:results[i].department_name,
               product_name:results[i].product_name,
               over_head_costs:results[i].over_head_costs,
               product_sales:results[i].product_sales,
               Total_Profit: parseInt(results[i].product_sales) - parseInt(results[i].over_head_costs)

           }
       ])
    }
     
    departmentCheck();
    })
    
}

function addDepartment(){
    inquirer
    .prompt([
        {
            name:"ID",
            type:"input",
            message:"What is the id number for this department?",
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
            message:"What is the new departments name?"
        },
        {
            name:"ohcosts",
            type:"input",
            message:"What is the over head cost of this department?",
            validate: function(value){
                if (isNaN(value) === false){
                return true;
                }
                return false
            }
        },        

    ]).then(function(answer){
        connection.query(
            "INSERT INTO departments SET ?",
            {
                department_id:answer.ID,
                department_name: answer.product,                
                over_head_costs: answer.ohcosts,
                
            },
            function(err){
                if(err) throw err;
                console.log("New department added!");
                departmentCheck();
            }
        )
       
    })


}