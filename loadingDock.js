var express = require('express');
var app = express();
var path = require('path');
const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database("./abcDispatch.db");

var table_cols = ["loading_dock_number", "warehouse_id", "loading_dock_deliveries"];

//template for return html page that has the option to contain a table
loading_dock_template = "<html><head><style>.topnav {background-color: #333; overflow:hidden;} .topnav a{float:left; color: #f2f2f2; text-align: center;";
loading_dock_template += "padding: 14px 16px; text-decoration: none; font-size: 17px;} .topnav a:hover { background-color:#ccc; color:black;} ";
loading_dock_template += ".topnav a.active{ background-color: #00ace6; color:white;} body {background-color: #007399;} h2{color: #f2f2f2;} table, th, td";
loading_dock_template += "{background-color: #f2f2f2; color: black; border: 1px solid black; padding: 2px 3px; text-align: center;} table{padding: 10px;}";
loading_dock_template += " </style></head><body><div class=\"topnav\"><a href=\"http://localhost:8081/main.html\">Home</a>";
loading_dock_template += "<a href=\"http://localhost:8081/driver.html\">Driver</a><a href=\"http://localhost:8081/truck.html\">Truck</a>";
loading_dock_template += "<a href=\"http://localhost:8081/inspection.html\">Inspection</a><a href=\"http://localhost:8081/owner.html\">Owner</a>";
loading_dock_template += "<a class=\"active\" href=\"http://localhost:8081/warehouse.html\">Warehouse</a><a href=\"http://localhost:8081/delivery.html\">Delivery</a></div>";

exports.createLoadingDockTable = function(){
  db.serialize(function() {
    db.get("PRAGMA foreign_keys = ON");
    //db.run("DROP TABLE loading_dock_info");
    db.run("CREATE TABLE if not exists loading_dock_info (loading_dock_number INTEGER, warehouse_id TEXT NOT NULL, loading_dock_deliveries INTEGER NOT NULL, PRIMARY KEY(loading_dock_number, warehouse_id), FOREIGN KEY(warehouse_id) REFERENCES warehouse_info(warehouse_id) ON UPDATE CASCADE ON DELETE SET NULL)");
  });
}

exports.post_insert_loading_dock = function(req, res){
  // Prepare output in JSON format
  response = {
     loading_dock_number:req.body.loading_dock_number,
     warehouse_id:req.body.warehouse_id,
     loading_dock_deliveries:req.body.loading_dock_deliveries
  };
  console.log(response);
  let query = insertLoadingDockQuery("loading_dock_info", table_cols, response);
  db.run(query);
  db.all("SELECT * FROM loading_dock_info", function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      console.log(rows);
    }
  });
  var page = loading_dock_template;
  page += "<h2> Loading Dock successfully inserted!</h2><a href=\"http://localhost:8081/warehouse.html\">Go Back</a></body></html>";
  res.send(page);
}

exports.post_update_loading_dock = function(req, res){
  // Prepare output in JSON format
  response = {
    loading_dock_number:req.body.loading_dock_number,
    warehouse_id:req.body.warehouse_id,
    loading_dock_deliveries:req.body.loading_dock_deliveries
  };
  console.log(response);
  let query = updateLoadingDockQuery("loading_dock_info", table_cols, response);
  db.run(query);
  db.all("SELECT * FROM loading_dock_info", function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      console.log(rows);
    }
  });
  var page = loading_dock_template;
  page += "<h2> Loading Dock successfully updated!</h2><a href=\"http://localhost:8081/warehouse.html\">Go Back</a></body></html>";
  res.send(page);
}

exports.post_delete_loading_dock = function(req, res){
  // Prepare output in JSON format
  response = {
    loading_dock_number:req.body.loading_dock_number,
    warehouse_id:req.body.warehouse_id
  };
  console.log(response);
  let query = deleteLoadingDockQuery("loading_dock_info", table_cols, response);
  db.run(query);
  db.all("SELECT * FROM loading_dock_info", function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      console.log(rows);
    }
  });
  var page = loading_dock_template;
  page += "<h2> Loading Dock successfully updated!</h2><a href=\"http://localhost:8081/warehouse.html\">Go Back</a></body></html>";
  res.send(page);
}

exports.get_loading_dock_list = function(req, res){
  var page = loading_dock_template;
  page += "<h2> Loading Dock Table</h2>";
  db.all("SELECT * FROM loading_dock_info ORDER BY warehouse_id", function(err, rows){
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

function insertLoadingDockQuery(tableName, columns, obj){
  let q = generateSqlQuery(tableName, columns, obj) + obj.loading_dock_number + ',\'' + obj.warehouse_id + "\'," + obj.loading_dock_deliveries + ")";
  console.log(q);
  return q;
}

function updateLoadingDockQuery(tableName, columns, obj){
  var q = `UPDATE loading_dock_info SET loading_dock_deliveries = \'${obj.loading_dock_deliveries}\' WHERE loading_dock_number = \'${obj.loading_dock_number}\' AND warehouse_id = \'${obj.warehouse_id}\';`;
  console.log(q);
  return q;
}

function deleteLoadingDockQuery(tableName, columns, obj){
  var q;
  q = `DELETE FROM loading_dock_info WHERE loading_dock_number = \'${obj.loading_dock_number}\' AND warehouse_id = \'${obj.warehouse_id}\';`;
  console.log(q);
  return q;
}

function generateTable(rows){
  var result = "<table><tr><th>Loading Dock Num</th><th>Warehouse ID</th><th>Num Of Deliveries</th></tr>";
  var arr=[rows.length];
  for(var i=0; i<rows.length; i++) {
    var temp = [3];
    temp[0] = rows[i].loading_dock_number;
    temp[1] = rows[i].warehouse_id;
    temp[2] = rows[i].loading_dock_deliveries;
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
