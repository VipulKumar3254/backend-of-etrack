// const express = require("express");
import express from "express";

const app = express();

// const mysql = require("mysql");
import mysql from "mysql";

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  
  connectionLimit: 10
});

conn.connect((err) => {
  if (err) {
    console.log(err);
    // console.log("not connected");
  }
  console.log("get connected on thread id " + conn.threadId);
});

// conn.end();

export default conn;
