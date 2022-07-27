// const express = require("express");
import express from "express";
// const cors = require("cors");
import cors from "cors";
// const hbs = require("hbs");
import hbs from "hbs";
// const views = require("./views");
// import views from "./views/index.js";
// const body_parser= require("body-parser")
import body_parser from "body-parser";
// const mysql = require("mysql");

// const connection = require("./databaseConnection.js");

//  require("./databaseConnection");
import conn from "./databaseConnection.js";

const app = express();
app.use(body_parser.json());

app.set("view engine", "hbs");
// app.use('views','./views')

app.use(cors());
app.get("/", (req, res) => {
  res.render("index");
});

app.route("/textField").get((req, res) => {
  res.render("textField");
});
app.route("/fileUpload").get((req, res) => {
  res.render("fileUpload");
});
app.route("/remarks").get((req, res) => {
  res.send(" this is Remarks section.");
});
app.route("/logic").get((req, res) => {
  // res.send("this is good.");
  res.sendFile(__dirname + "/logic.js");
});

app
  .route("/fieldDetails")
  .get((req, res) => {
    res.send(" okk send me the details of the fields.");
  })
  .post(async (req, res) => {
    // console.log(req.body[0])
    // console.log(JSON.parse(req.body).)
    conn.query("create database etrack;", (err, result, fields) => {
      if (err) console.log( " etrack database not creaeted because "+ err.sqlMessage);

      else {
        console.log("etrack database has been created.");
        conn.query("use etrack", (err, result, fields) => {
          if (err) console.log(" etrack database not selected because " +err.sqlMessage);
          console.log("etrack is now selected.");
          var arr = [];
          var i = 0;
          console.log( "req body is " +req.body)
          while (true) {
            if (req.body[i] == undefined) {
              break;
            }
            arr[i] = req.body[i];
            i++;
          }
          console.log("length of the array is "+arr.length);
          console.log("array is" +arr);
          var length = arr.length;
          var query = " ";
          for (i = 0; i < length; i++) {
            query += `${arr[i]}  varchar(8)`;
            if (i == length - 1) {
              break;
            }
            query += ",";
          }
      
          console.log("query is " +query);
      
          //query builder
          var orgquery = ` create table fielddetails  ( departmentcount int , ${query});`;
          console.log("original query is " +orgquery);
      
          conn.query(orgquery, (err, result, fields) => {
            if (err) console.log(err.sqlMessage);
            else console.log(result);
          });
      
          // form conversion of the query
      
          var insertionQuery = " ";
          for (i = 0; i < length; i++) {
            if (i == 0) {
              insertionQuery += `insert into fielddetails values (${length},`;
            }
            insertionQuery += `"${arr[i]}"`;
            if (i == length - 1) {
              insertionQuery += ");";
              break;
            }
            insertionQuery += ",";
          }
      
          console.log( "insertion query is "+insertionQuery);
          conn.query(insertionQuery, (err, result, fields) => {
            if (err) console.log(err.sqlMessage);
            else console.log(result);
          });

        })
      }
    })

    // conn.query("use etrack", (err, result, fields) => {
    //   if (err) console.log(" etrack database not selected because " +err.sqlMessage);
    //   console.log("etrack is now selected.");
    // })

    // var arr = [];
    // var i = 0;
    // while (true) {
    //   if (req.body[i] == undefined) {
    //     break;
    //   }
    //   arr[i] = req.body[i];
    //   i++;
    // }
    // console.log(arr.length);
    // console.log(arr);
    // var length = arr.length;
    // var query = " ";
    // for (i = 0; i < length; i++) {
    //   query += `  ${arr[i]}  varchar(8)`;
    //   if (i == length - 1) {
    //     break;
    //   }
    //   query += ",";
    // }

    // console.log(query);

    // //query builder
    // var orgquery = ` create table fielddetails  ( departmentcount int , ${query});`;
    // console.log(orgquery);

    // conn.query(orgquery, (err, result, fields) => {
    //   if (err) console.log(err.sqlMessage);
    //   else console.log(result);
    // });

    // // form conversion of the query

    // var insertionQuery = " ";
    // for (i = 0; i < length; i++) {
    //   if (i == 0) {
    //     insertionQuery += `insert into fielddetails values ( ${length}, `;
    //   }
    //   insertionQuery += ` " ${arr[i]} "`;
    //   if (i == length - 1) {
    //     insertionQuery += " ); ";
    //     break;
    //   }
    //   insertionQuery += ",";
    // }

    // console.log(insertionQuery);
    // conn.query(insertionQuery, (err, result, fields) => {
    //   if (err) console.log(err.sqlMessage);
    //   else console.log(result);
    // });
    //insertion query
    // var insertQuery = `insert into fielddetails values  `
  });

app
  .route("/fieldtypes")
  .get((req, res) => {
    res.send(" send me the fieldtypes");
  })
  .post((req, res) => {
    console.log(req.body);
    // query of creating table
    var length = Object.keys(req.body).length;
    var query = " ";
    for(var i =0; i<length;i++) 
    {
      if(i==0)
      {
        query+= " create table fieldtypes ( "
      }
      if(i==length-1)
      query += ` field${i+1} varchar(20) );`;
      else{
        query+=`field${i+1} varchar(20),`
      }
    
    }
    conn.query(query,(err,result,field)=>{
      if(err) console.log(err.sqlMessage)
      else{
        console.log(result.sqlMessage)
      }
    })

    var query = " ";
    for(var i=0;i<length;i++)
    {
      if(i==0)
      {
        query+=` insert into fieldtypes values( `
      }
      if(i==length-1)
      {
        query+= ` " ${req.body[i].element}"  );`
      }
      else{
        query+= ` " ${req.body[i].element}",`

      }
    }
    console.log(query)
    conn.query(query,(err,result,fields) => {
      if(err) console.log(err.sqlMessage)
      else{
        console.log(result.sqlMessage)
      }
    })

    res.send(" we are good at all.");
  });

app.route("/departmentCount").post((req, res) => {
  console.log(req.body);
  conn.query("use etrack ;",(err,result,fields)=>{
    if(err) console.log("error is " + errr.sqlMessage)
    console.log("etrack is now selected");

  })
  conn.query(
    "create table departmentcount ( id int , departmentCount int );",
    (err, result, field) => {
      if (err) {
        console.log(err.sqlMessage);
      } else {
        console.log("table created departmentcount");
      }
    }
  );

  // console.log(req.body.dep)

  // console.log(JSON.parse(req.body).dep)

  // for testing
  // var length = conn.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'etrack'",(err,result,fields)=>{
  //   if(err) console.log("the error is " ,err.sqlMessage)
  //   else console.log(result)
  // })
  var length1;
  conn.query("SELECT * from etrack.fielddetails", (err, result, fields) => {
    if (err) console.log("the error is ", err.sqlMessage);
    // else console.log(`the result is ${result}`)
    else {
      console.log(result[0].departmentcount);
      length1 = result[0].departmentcount;
      console.log(length1);
      conn.query(
        `  insert into departmentcount  values ( ${length1}, ${req.body.dep} );`,
        (err, result, fields) => {
          if (err) console.log(err.sqlMessage);
          else {
            console.log(" the affected rows are " + result.affectedRows);
            conn.query(
              "select * from etrack.departmentcount",
              (err, result, fields) => {
                if (err) console.log(`err is ${err}`);
                else {
                  console.log(` items are`);
                  console.log(result);
                }
              }
            );
          }
        }
      );
    }
  });

  // console.log(length1)
  // conn.query( `  insert into departmentcount  values ( ${length1}, ${req.body.dep} );`,(err,result,fields)=>{
  //   if(err) console.log(err.sqlMessage)
  //   else{ console.log(" the affected rows are " +result.affectedRows)}

  // });

  res.send("data has been submitted.");
});



app.route("/fetchDepartmentCount").get((req, res) => {
  conn.query("use etrack ;",(err,result,fields)=>{
    if (err) console.log("error is "+ err.sqlMessage)
    console.log("etrack is now selected");
  })
  conn.query("select  * from departmentcount;", async (err, result, fields) => {
    if (err) {
      console.log(err);
      res.send(err.sqlMessage);
    } else {
      await console.log(result);

      res.send(result);
    }
  });
});

app
  .route("/departmentInformation")
  .get((req, res) => {
    res.send("this is information page.");
  })
  .post(async (req, res) => {
    console.log(req.body);
    var objLength = Object.keys(req.body).length;
    // query building

    var query = ` create table logininfo ( departmentNumber int , departmentName varchar(34), userName varchar(34), password varchar(79)  );`
    conn.query(query,(err,result,fields)=>{
      if(err) console.log(err.sqlMessage)
      else{
        console.log("logininfo table has been created.")
      }
    })

    // query for the insertion.

    console.log(req.body[1].d1);
    // var secondQuery =" ";
    // for(var i=1;i<objLength;i++)
    // {
    //     secondQuery +="insert into logininfo values ( "

    //   secondQuery += `${i}  ,  `;
    //   secondQuery += ` "${req.body[i].d1}" , "${req.body[i].u1}" , "${req.body[i].p1}"`
    //     secondQuery +=" );"

    //    await conn.query(secondQuery, (err,result ,fields) => {
    //       if(err) console.log(err)
    //       else{
    //         console.log(result)
    //       }
    //     })

    //   secondQuery =" "

    // }
    // console.log(secondQuery)

    // converting obj to the array

    var array = [];

    for (var i = 1; i < objLength; i++) {
      var arr = [];
      arr.push(i)
      arr.push(req.body[i].d1);
      arr.push(req.body[i].u1);
      arr.push(req.body[i].p1);
      array.push(arr);
      arr = [];
    }
    console.log(array);
    var query2 =
      " insert into logininfo  ( departmentNumber, departmentName, userName, Password) VALUES ?";

    conn.query(query2, [array], (err, result, fields) => {
      if (err) console.log(err.sqlMessage);
      else {
        console.log(result.affectedRows);
      }
    });
    conn.query("select * from logininfo", (err, result, fields) => {
      if (err) console.log(err);
      else {
        console.log(result);
      }
    });

    res.send(" i think done.");
    // res.writeHead(200).send("okk");
  });

app.route("/departmentnames").get((req, res) => {
  var query = " select  departmentName from etrack.logininfo ";
  conn.query(query, (err, result, fields) => {
    if (err) console.log(err.sqlMessage);
    else {
      res.send(result);
    }
  });
});


app.route("/loginDepartment").get((req,res)=>{
  res.send(" okk this is the login department page.")
}).post((req,res)=>{
  var length;
  console.log(req.body)
  const query = ` select * from  etrack.logininfo where username="${req.body.username}";`
  conn.query(query,(err, result, fields) => {
    if(err) console.log(err.sqlMessage)
    else{
      console.log(result.length)
      length = result.length;
      if(length>0)
      {
        if(req.body.username==result[0].userName & req.body.password==result[0].password)
        {
          res.send(" okk you are logged in.")
        }
      }
      else{
        res.send(" error try again.")
      }
    }
  })
})
app.listen(5500);
