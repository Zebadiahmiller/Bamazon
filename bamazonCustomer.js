const mysql = require("mysql");
const inquirer = require("inquirer")

const connection = mysql.createConnection({
    port:3306,
    user:"root",
    password:"root",
    database:"bamazondb",
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    afterConnection();
  });

  function afterConnection(){
      connection.query("SELECT * FROM products", function(err, res){
          if(err) throw err;
          console.log(res);
          connection.end();
        });
  }