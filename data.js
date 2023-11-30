let express = require("express");
let app = express();

app.use(express.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, OPTIONS, PUT, PATCH, DELETE, HEAD"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

const port = process.env.PORT||2410
app.listen(port, () => console.log(`Node app Listening on port ${port}!`));

let {employeesData } = require("./testData.js");

let fs = require("fs");
let fname = "employee.json";

app.get("/resetData",function(req,res){
    let data = JSON.stringify(employeesData);
    fs.writeFile(fname,data,function(err){
        if(err) res.status(404).send(err);
        else res.send("Data in file is reset");
    })
})


app.get("/employees", function (req, res) {
    let { designation,department,gender,sort } = req.query;
    fs.readFile(fname, "utf8", function (err, data) {
        if (err) res.status(404).send(err);
        else {
            let employeesArray= JSON.parse(data);

            let filteredEmployees= [...employeesArray];

            if (designation) {
                filteredEmployees = filteredEmployees.filter((employee) => {
                    return (
                        employee.designation &&
                    employee.designation.toLowerCase() === designation.toLowerCase()
                    );
                });
            }
            if (department) {
                filteredEmployees = filteredEmployees.filter((employee) => {
                    return (
                        employee.department &&
                        employee.department.toLowerCase() === department.toLowerCase()
                    );
                });
            }

            if (gender) {
                filteredEmployees = filteredEmployees.filter((employee) => {
                    return (
                        employee.gender &&
                        employee.gender.toLowerCase() === gender.toLowerCase()
                    );
                });
            }
          

            if (sort) {
                if (sort === "name" || sort === "age" || sort === "salary") {
                    filteredEmployees.sort((a, b) => {
                        if (a[sort] < b[sort]) return -1;
                        if (a[sort] > b[sort]) return 1;
                        return 0;
                    });
                } else {
                    return res.status(400).send("Invalid sortBy parameter");
                }
            }

            res.send(filteredEmployees);
        }
    });
});



app.get("/employees/:empCode", function (req, res) {
    let empCode = +req.params.empCode;
    fs.readFile(fname, "utf8", function (err, data) {
        if (err) res.status(404).send(err);
        else {
            let employeesArray = JSON.parse(data);
            let employee = employeesArray.find((st) => st.empCode === empCode);
            if (employee) res.send(employee);
            else res.status(404).send("No Employee found");
        }
    });
});

// app.get("/svr/mobiles/brand/:brand", function (req, res) {
//     let brand = req.params.brand;
//     fs.readFile(fname, "utf8", function (err, data) {
//         if (err) res.status(404).send(err);
//         else {
//             let mobilesArray = JSON.parse(data);
//             let mobilesByBrand = mobilesArray.filter((st) => st.brand === brand);
//             console.log(mobilesByBrand);
//             res.send(mobilesByBrand);
//         }
//     });
// });


app.post("/employees", function (req, res) {
    let body = req.body;
    fs.readFile(fname, "utf8", function (err, data) {
        if (err) res.status(404).send(err);
        else {
            let employeesArray = JSON.parse(data);
            let newEmployee = {...body };
            employeesArray.push(newEmployee);
            let data1 = JSON.stringify(employeesArray);
            fs.writeFile(fname, data1, function (err) {
                if (err) res.status(404).send(err);
                else res.send(newEmployee);
            });
        }
    });
});



app.put("/employees/:empCode", function (req, res) {
    let body = req.body;
    let empCode = +req.params.empCode;
    fs.readFile(fname, "utf8", function (err, data) {
        if (err) res.status(404).send(err);
        else {
            let employeesArray = JSON.parse(data);
            let index = employeesArray.findIndex((st) => st.empCode === empCode);
            if(index >= 0){
                let updatedEmployee = {...employeesArray[index],...body};
                employeesArray[index] = updatedEmployee;
                let data1 = JSON.stringify(employeesArray);
                fs.writeFile(fname,data1,function(err){
                    if(err) res.status(404).send(err);
                    else res.send(updatedEmployee);
                })
            }
            else res.status(404).send("No Employee Found");
        }
    });
});


app.delete("/employees/:empCode", function (req, res) {
    let body = req.body;
    let empCode = +req.params.empCode;
    fs.readFile(fname, "utf8", function (err, data) {
        if (err) res.status(404).send(err);
        else {
            let employeesArray = JSON.parse(data);
            let index = employeesArray.findIndex((st) => st.empCode === empCode);
            if(index >= 0){
               let deletedEmployee = employeesArray.splice(index,1);
               let data1 = JSON.stringify(employeesArray);
                fs.writeFile(fname,data1,function(err){
                    if(err) res.status(404).send(err);
                    else res.send(deletedEmployee);
                })
            }
            else res.status(404).send("No Employee Found");
        }
    });
});


