var express = require('express');
var app = express();
var path = require('path');
const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database("./abcDispatch.db");

var table_cols = ["warehouse_id", "owner_id"];

//template for return html page that has the option to contain a table
ownership_template = "<html><head><style>.topnav {background-color: #333; overflow:hidden;} .topnav a{float:left; color: #f2f2f2; text-align: center;";
ownership_template += "padding: 14px 16px; text-decoration: none; font-size: 17px;} .topnav a:hover { background-color:#ccc; color:black;} ";
ownership_template += ".topnav a.active{ background-color: #00ace6; color:white;} body {background-color: #007399;} h2{color: #f2f2f2;} table, th, td";
ownership_template += "{background-color: #f2f2f2; color: black; border: 1px solid black; padding: 2px 3px; text-align: center;} table{padding: 10px;}";
ownership_template += " </style></head><body><div class=\"topnav\"><a href=\"http://localhost:8081/main.html\">Home</a>";
ownership_template += "<a href=\"http://localhost:8081/driver.html\">Driver</a><a href=\"http://localhost:8081/truck.html\">Truck</a>";
ownership_template += "<a href=\"http://localhost:8081/inspection.html\">Inspection</a><a class=\"active\" href=\"http://localhost:8081/owner.html\">Owner</a>";
ownership_template += "<a href=\"http://localhost:8081/warehouse.html\">Warehouse</a><a href=\"http://localhost:8081/delivery.html\">Delivery</a></div>";

exports.createOwnershipTable = function(){
  db.serialize(function() {
    db.get("PRAGMA foreign_keys = ON");
    //db.run("DROP TABLE ownership_info");
    db.run("CREATE TABLE if not exists ownership_info (warehouse_id TEXT, owner_id TEXT NOT NULL, PRIMARY KEY(warehouse_id, owner_id), FOREIGN KEY(warehouse_id) REFERENCES warehouse_info(warehouse_id) ON UPDATE CASCADE ON DELETE SET NULL, FOREIGN KEY(owner_id) REFERENCES owner_info(owner_id) ON UPDATE CASCADE ON DELETE SET NULL)");
  });
}

exports.post_insert_ownership = function(req, res){
  // Prepare output in JSON format
  response = {
     warehouse_id:req.body.warehouse_id,
     owner_id:req.body.owner_id
  };
  console.log(response);
  let query = insertOwnershipQuery("ownership_info", table_cols, response);
  db.run(query);
  db.all("SELECT * FROM ownership_info", function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      console.log(rows);
    }
  });
  var page = ownership_template;
  page += "<h2> Ownership successfully inserted!</h2><a href=\"http://localhost:8081/owner.html\">Go Back</a></body></html>";
  res.send(page);
}

exports.post_delete_ownership = function(req, res){
  // Prepare output in JSON format
  response = {
     warehouse_id:req.body.warehouse_id,
     owner_id:req.body.owner_id
  };
  console.log(response);
  let query = deleteOwnershipQuery("owner_info", table_cols, response);
  db.run(query);
  db.all("SELECT * FROM ownership_info", function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      console.log(rows);
    }
  });
  var page = ownership_template;
  page += "<h2> Ownership successfully deleted!</h2><a href=\"http://localhost:8081/owner.html\">Go Back</a></body></html>";
  res.send(page);
}

exports.get_ownership_list = function(req, res){
  var page = ownership_template;
  page += "<h2> Ownership Table</h2>";
  db.all("SELECT * FROM ownership_info", function(err, rows){
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

function insertOwnershipQuery(tableName, columns, obj){
  let q = generateSqlQuery(tableName, columns, obj) + '\'' + obj.warehouse_id + '\',\'' + obj.owner_id + "\')";
  console.log(q);
  return q;
}

function deleteOwnershipQuery(tableName, columns, obj){
  var q;
  q = `DELETE FROM ownership_info WHERE warehouse_id = \'${obj.warehouse_id}\' AND owner_id = \'${obj.owner_id}\';`;
  console.log(q);
  return q;
}

function generateTable(rows){
  var result = "<table><tr><th>Warehouse ID</th><th>Owner ID</th></tr>";
  var arr=[rows.length];
  for(var i=0; i<rows.length; i++) {
    var temp = [2];
    temp[0] = rows[i].warehouse_id;
    temp[1] = rows[i].owner_id;
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
