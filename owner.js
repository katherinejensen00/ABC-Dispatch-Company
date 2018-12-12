var express = require('express');
var app = express();
var path = require('path');
const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database("./abcDispatch.db");

var table_cols = ["owner_id", "owner_ssn", "owner_fname", "owner_lname"];

//template for return html page that has the option to contain a table
owner_template = "<html><head><style>.topnav {background-color: #333; overflow:hidden;} .topnav a{float:left; color: #f2f2f2; text-align: center;";
owner_template += "padding: 14px 16px; text-decoration: none; font-size: 17px;} .topnav a:hover { background-color:#ccc; color:black;} ";
owner_template += ".topnav a.active{ background-color: #00ace6; color:white;} body {background-color: #007399;} h2{color: #f2f2f2;} table, th, td";
owner_template += "{background-color: #f2f2f2; color: black; border: 1px solid black; padding: 2px 3px; text-align: center;} table{padding: 10px;}";
owner_template += " </style></head><body><div class=\"topnav\"><a href=\"http://localhost:8081/main.html\">Home</a>";
owner_template += "<a href=\"http://localhost:8081/driver.html\">Driver</a><a href=\"http://localhost:8081/truck.html\">Truck</a>";
owner_template += "<a href=\"http://localhost:8081/inspection.html\">Inspection</a><a class=\"active\" href=\"http://localhost:8081/owner.html\">Owner</a>";
owner_template += "<a href=\"http://localhost:8081/warehouse.html\">Warehouse</a><a href=\"http://localhost:8081/delivery.html\">Delivery</a></div>";

exports.createOwnerTable = function(){
  db.serialize(function() {
    db.get("PRAGMA foreign_keys = ON");
    db.run("CREATE TABLE if not exists owner_info (owner_id TEXT, owner_ssn TEXT NOT NULL UNIQUE, owner_fname TEXT NOT NULL, owner_lname TEXT NOT NULL, PRIMARY KEY(owner_id))");
  });
}

exports.post_insert_owner = function(req, res){
  // Prepare output in JSON format
  response = {
     owner_id:req.body.owner_id,
     owner_ssn:req.body.owner_ssn,
     owner_fname:req.body.owner_fname,
     owner_lname:req.body.owner_lname
  };
  console.log(response);
  let query = insertOwnerQuery("owner_info", table_cols, response);
  db.run(query);
  db.all("SELECT * FROM owner_info", function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      console.log(rows);
    }
  });
  var page = owner_template;
  page += "<h2> Owner successfully inserted!</h2><a href=\"http://localhost:8081/owner.html\">Go Back</a></body></html>";
  res.send(page);
}

exports.post_update_owner = function(req, res){
  // Prepare output in JSON format
  response = {
    owner_id:req.body.owner_id,
    owner_ssn:req.body.owner_ssn,
    owner_fname:req.body.owner_fname,
    owner_lname:req.body.owner_lname
  };
  console.log(response);
  let query = updateOwnerQuery("owner_info", table_cols, response);
  db.run(query);
  db.all("SELECT * FROM owner_info", function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      console.log(rows);
    }
  });
  var page = owner_template;
  page += "<h2> Owner successfully updated!</h2><a href=\"http://localhost:8081/owner.html\">Go Back</a></body></html>";
  res.send(page);
}

exports.post_delete_owner = function(req, res){
  // Prepare output in JSON format
  response = {
     owner_id:req.body.owner_id
  };
  console.log(response);
  let query = deleteOwnerQuery("owner_info", table_cols, response);
  db.run(query);
  db.all("SELECT * FROM owner_info", function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      console.log(rows);
    }
  });
  var page = owner_template;
  page += "<h2> Owner successfully inserted!</h2><a href=\"http://localhost:8081/owner.html\">Go Back</a></body></html>";
  res.send(page);
}

exports.get_owner_list = function(req, res){
  var page = owner_template;
  page += "<h2> Owner's Table</h2>";
  db.all("SELECT * FROM owner_info", function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      page += generateTable(rows);
    }
    page += "</body></html>";
    res.send(page);
  });
}

function insertOwnerQuery(tableName, columns, obj){
  let q = generateSqlQuery(tableName, columns, obj) + '\'' + obj.owner_id + '\',\'' + obj.owner_ssn + "\',\'" + obj.owner_fname + "\',\'" + obj.owner_lname + "\')";
  console.log(q);
  return q;
}

function updateOwnerQuery(tableName, columns, obj){
  var q = `UPDATE owner_info SET owner_ssn = \'${obj.owner_ssn}\', owner_fname = \'${obj.owner_fname}\', owner_lname = \'${obj.owner_lname}\' WHERE owner_id = \'${obj.owner_id}\';`;
  console.log(q);
  return q;
}

function deleteOwnerQuery(tableName, columns, obj){
  var q;
  q = `DELETE FROM owner_info WHERE owner_id = \'${obj.owner_id}\';`;
  console.log(q);
  return q;
}

function generateTable(rows){
  var result = "<table><tr><th>Owner Id</th><th>Owner SSN</th><th>First Name</th><th>Last Name</th></tr>";
  var arr=[rows.length];
  for(var i=0; i<rows.length; i++) {
    var temp = [4];
    temp[0] = rows[i].owner_id;
    temp[1] = rows[i].owner_ssn;
    temp[2] = rows[i].owner_fname;
    temp[3] = rows[i].owner_lname;
    arr[i] = temp;
  }

  for(var i=0; i<arr.length; i++) {
    result += "<tr>";
    for(var j=0; j<table_cols.length; j++){
        result += "<td>"+arr[i][j]+"</td>";
    }
    result += "</tr>";
  }
  result += "</table>";
  return result;
}

function generateSqlQuery(tableName, columns, obj){
  this.generatedSqlQuery = `INSERT INTO ${tableName}`;
  let columnList = "";
  columnList = columnList + "("
  for (let index = 0; index < columns.length; index++) {
    if (index == columns.length - 1) {
      columnList = columnList + columns[index];
    } else {
      columnList = columnList + columns[index] + ",";
    }
  }
  this.generatedSqlQuery = this.generatedSqlQuery + columnList + ") VALUES (";
  return this.generatedSqlQuery;
}
