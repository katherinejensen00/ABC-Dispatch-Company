var express = require('express');
var app = express();
var path = require('path');
const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database("./abcDispatch.db");

var table_cols = ["inspector_id", "inspector_ssn", "inspector_name", "inspector_start"];

//template for return html page that has the option to contain a table
inspector_template = "<html><head><style>.topnav {background-color: #333; overflow:hidden;} .topnav a{float:left; color: #f2f2f2; text-align: center;";
inspector_template += "padding: 14px 16px; text-decoration: none; font-size: 17px;} .topnav a:hover { background-color:#ccc; color:black;} ";
inspector_template += ".topnav a.active{ background-color: #00ace6; color:white;} body {background-color: #007399;} h2{color: #f2f2f2;} table, th, td";
inspector_template += "{background-color: #f2f2f2; color: black; border: 1px solid black; padding: 2px 3px; text-align: center;} table{padding: 10px;}";
inspector_template += " </style></head><body><div class=\"topnav\"><a href=\"http://localhost:8081/main.html\">Home</a>";
inspector_template += "<a href=\"http://localhost:8081/driver.html\">Driver</a><a href=\"http://localhost:8081/truck.html\">Truck</a>";
inspector_template += "<a class=\"active\" href=\"http://localhost:8081/inspection.html\">Inspection</a><a href=\"http://localhost:8081/owner.html\">Owner</a>";
inspector_template += "<a href=\"http://localhost:8081/warehouse.html\">Warehouse</a><a href=\"http://localhost:8081/delivery.html\">Delivery</a></div>";

exports.createInspectorTable = function(){
  db.serialize(function() {
    db.get("PRAGMA foreign_keys = ON");
    db.run("CREATE TABLE if not exists inspector_info (inspector_id TEXT, inspector_ssn TEXT NOT NULL UNIQUE, inspector_name TEXT NOT NULL, inspector_start TEXT NOT NULL, PRIMARY KEY(inspector_id))");
  });
}

exports.post_insert_inspector = function(req, res){
  // Prepare output in JSON format
  response = {
     inspector_id:req.body.inspector_id,
     inspector_ssn:req.body.inspector_ssn,
     inspector_name:req.body.inspector_name,
     inspector_start:req.body.inspector_start
  };
  console.log(response);
  let query = insertInspectorQuery("inspector_info", table_cols, response);
  db.run(query);
  db.all("SELECT * FROM inspector_info", function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      console.log(rows);
    }
  });
  var page = inspector_template;
  page += "<h2> Inspector successfully inserted!</h2><a href=\"http://localhost:8081/inspection.html\">Go Back</a></body></html>";
  res.send(page);
}

exports.post_update_inspector = function(req, res){
  // Prepare output in JSON format
  response = {
    inspector_id:req.body.inspector_id,
    inspector_ssn:req.body.inspector_ssn,
    inspector_name:req.body.inspector_name,
    inspector_start:req.body.inspector_start
  };
  console.log(response);
  let query = updateInspectorQuery("inspector_info", table_cols, response);
  db.run(query);
  db.all("SELECT * FROM inspector_info", function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      console.log(rows);
    }
  });
  var page = inspector_template;
  page += "<h2> Inspector successfully updated!</h2><a href=\"http://localhost:8081/inspection.html\">Go Back</a></body></html>";
  res.send(page);
}

exports.post_delete_inspector = function(req, res){
  // Prepare output in JSON format
  response = {
     inspector_id:req.body.inspector_id
  };
  console.log(response);
  let query = deleteInspectorQuery("inspector_info", table_cols, response);
  db.run(query);
  db.all("SELECT * FROM inspector_info", function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      console.log(rows);
    }
  });
  var page = inspector_template;
  page += "<h2> Inspector successfully deleted!</h2><a href=\"http://localhost:8081/inspection.html\">Go Back</a></body></html>";
  res.send(page);
}

exports.get_inspector_list = function(req, res){
  var page = inspector_template;
  page += "<h2>Inspector's Table</h2>";
  db.all("SELECT * FROM inspector_info", function(err, rows){
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

function insertInspectorQuery(tableName, columns, obj){
  //Come back to this and deal with null values for optional trained_by and add truck_id once you work out foreign key
  let q = generateSqlQuery(tableName, columns, obj) + '\'' + obj.inspector_id + '\',\'' + obj.inspector_ssn + "\',\'" + obj.inspector_name + "\',\'" + obj.inspector_start + "\')";
  console.log(q);
  return q;
}

function updateInspectorQuery(tableName, columns, obj){
  var q = `UPDATE inspector_info SET inspector_ssn = \'${obj.inspector_ssn}\', inspector_name = \'${obj.inspector_name}\', inspector_start = \'${obj.inspector_start}\' WHERE inspector_id = \'${obj.inspector_id}\';`;
  console.log(q);
  return q;
}

function deleteInspectorQuery(tableName, columns, obj){
  var q;
  q = `DELETE FROM inspector_info WHERE inspector_id = \'${obj.inspector_id}\';`;
  console.log(q);
  return q;
}

function generateTable(rows){
  var result = "<table><tr><th>Inspector ID</th><th>Inspector SSN</th><th>Inspector Name</th><th>Inspector Start Date</th></tr>";
  var arr=[rows.length];
  for(var i=0; i<rows.length; i++) {
    var temp = [4];
    temp[0] = rows[i].inspector_id;
    temp[1] = rows[i].inspector_ssn;
    temp[2] = rows[i].inspector_name;
    temp[3] = rows[i].inspector_start;
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
