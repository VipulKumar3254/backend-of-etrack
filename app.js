// const express = require("express");
import express  from "express";
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
import conn from "./databaseConnection.js"

const app = express();
app.use(body_parser.json());


app.set("view engine", "hbs");
// app.use('views','./views')

app.use(cors());
app.get("/", (req, res) => {
  res.render("index");
});

app.route("/textField").get((req, res) => {
    res.render('textField')
});
app.route("/fileUpload").get((req, res) => {
    res.render('fileUpload')
});
app.route("/remarks").get((req, res) => {
  res.send(" this is Remarks section.");
});
app.route("/logic").get((req, res) => {
  // res.send("this is good.");
  res.sendFile(__dirname + '/logic.js')
})

app.route("/fieldDetails").get((req, res) => {
  res.send(" okk send me the details of the fields.")
})
.post( async(req,res)=>{
  // console.log(req.body[0])
  // console.log(JSON.parse(req.body).)
  conn.query("create database etrack;",(err,result,fields)=>{
    if(err) console.log(err.sqlMessage)
    else{
      console.log("Database has been created.")
    }
  }
  )

  conn.query("use etrack",(err,result,fields)=>{
    if(err) console.log(err.sqlMessage)
    console.log("etrack is now selected.")
  });

  var arr=[];
  var i=0;
  while(true)
  {
    if(req.body[i]==undefined)
    {
      break;
    }
    arr[i] = req.body[i]
    i++;
  }
  console.log(arr.length)
  console.log(arr)
  var length = arr.length;
  var query=" ";
  for(i=0; i<length; i++)
  {
    query+=  `  ${arr[i]}  varchar(8)`
    if(i==(length-1))
    {
       break;
    }
    query+=",";
  }
  
  console.log(query)


  //query builder 
  var orgquery = ` create table fielddetails  ( departmentcount int , ${query});`
  console.log(orgquery);

  conn.query(orgquery,(err,result,fields)=>{
    if(err) console.log(err.sqlMessage)
    else  console.log(result)
  })


  // form conversion of the query 

  var insertionQuery=" ";
  for(i=0; i<length; i++)
  {
    if( i==0)
    {
      insertionQuery += `insert into fielddetails values ( ${length}, `
    }
    insertionQuery+=  ` " ${arr[i]} "`
    if(i==(length-1))
    {
      insertionQuery+=" ); ";
       break;
    }
    insertionQuery+=",";
  }


  console.log(insertionQuery);
  conn.query(insertionQuery,(err,result,fields)=>{
    if(err) console.log(err.sqlMessage)
    else console.log(result)
  })
  //insertion query
    // var insertQuery = `insert into fielddetails values  `

  

})



app.route("/departmentCount").post((req,res)=>{
  console.log(req.body)
  conn.query("create table departmentcount ( id int , departmentCount int );",(err ,result,field)=>{
    if(err)
    {
      console.log(err.sqlMessage)

    }
    else{
      console.log("table created departmentcount")
    }
  })

  // console.log(req.body.dep)


  // console.log(JSON.parse(req.body).dep)

// for testing
  // var length = conn.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'etrack'",(err,result,fields)=>{
  //   if(err) console.log("the error is " ,err.sqlMessage)
  //   else console.log(result)
  // })
  var length1;
   conn.query("SELECT * from etrack.fielddetails",(err,result,fields)=>{
    if(err) console.log("the error is " ,err.sqlMessage)
    // else console.log(`the result is ${result}`)
    else {

      console.log(result[0].departmentcount)
       length1= result[0].departmentcount;
       console.log(length1)
       conn.query( `  insert into departmentcount  values ( ${length1}, ${req.body.dep} );`,(err,result,fields)=>{
         if(err) console.log(err.sqlMessage)
         else{ console.log(" the affected rows are " +result.affectedRows)
          conn.query("select * from etrack.departmentcount",(err,result,fields)=>{
            if(err) console.log(`err is ${err}`)
            else 
            {
              console.log(` items are`)
              console.log(result)
            }
          })
        }
     
       });
    }
  })

  // console.log(length1)
  // conn.query( `  insert into departmentcount  values ( ${length1}, ${req.body.dep} );`,(err,result,fields)=>{
  //   if(err) console.log(err.sqlMessage)
  //   else{ console.log(" the affected rows are " +result.affectedRows)}

  // });

  res.send("data has been submitted.")
})
app.route("/fetchDepartmentCount").get((req, res)=>{

  conn.query("select  * from departmentcount;",async(err,result,fields)=>{
    if(err)
    {
      console.log(err)
      res.send(err.sqlMessage)
    }
    else
    {
     await console.log(result)
    
      res.send(result)
    }


  })

})

app.listen(5500);
