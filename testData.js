let mysql = require("mysql");
let connData = {
    host : "localhost",
    user : "root",
    password:"",
    database:"ShivamGupta",
};

let employeesData = [];

    let connection = mysql.createConnection(connData);
    let sql = "SELECT * FROM employee";
    connection.query(sql,function(err,result){
        if(err) console.log("Error in Database",err.message);
        else {
            employeesData.push(result);
        }
    })

module.exports.employeesData = employeesData;