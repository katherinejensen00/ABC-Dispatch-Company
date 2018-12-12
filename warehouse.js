var express = require('express');
var app = express();
var path = require('path');
const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database("./abcDispatch.db");

var table_cols = ["warehouse_id", "warehouse_name", "warehouse_addr", "warehouse_city", "warehouse_state", "warehouse_zip"];

//template for return html page that has the option to contain a table
warehouse_template = "<html><head><style>.topnav {background-color: #333; overflow:hidden;} .topnav a{float:left; color: #f2f2f2; text-align: center;";
warehouse_template += "padding: 14px 16px; text-decoration: none; font-size: 17px;} .topnav a:hover { background-color:#ccc; color:black;} ";
warehouse_template += ".topnav a.active{ background-color: #00ace6; color:white;} body {background-color: #007399;} h2{color: #f2f2f2;} table, th, td";
warehouse_template += "{background-color: #f2f2f2; color: black; border: 1px solid black; padding: 2px 3px; text-align: center;} table{padding: 10px;}";
warehouse_template += " </style></head><body><div class=\"topnav\"><a href=\"http://localhost:8081/main.html\">Home</a>";
warehouse_template += "<a href=\"http://localhost:8081/driver.html\">Driver</a><a href=\"http://localhost:8081/truck.html\">Truck</a>";
warehouse_template += "<a href=\"http://localhost:8081/inspection.html\">Inspection</a><a href=\"http://localhost:8081/owner.html\">Owner</a>";
warehouse_template += "<a class=\"active\" href=\"http://localhost:8081/warehouse.html\">Warehouse</a><a href=\"http://localhost:8081/delivery.html\">Delivery</a></div>";

exports.createWarehouseTable = function(){
  db.serialize(function() {
    db.get("PRAGMA foreign_keys = ON");
    db.run("CREATE TABLE if not exists warehouse_info (warehouse_id TEXT, warehouse_name TEXT, warehouse_addr TEXT NOT NULL, warehouse_city TEXT NOT NULL, warehouse_state TEXT NOT NULL, warehouse_zip INTEGER NOT NULL, PRIMARY KEY(warehouse_id))");
  });
}

exports.post_insert_warehouse = function(req, res){
  // Prepare output in JSON format
  response = {
     warehouse_id:req.body.warehouse_id,
     warehouse_name:req.body.warehouse_name,
     warehouse_addr:req.body.warehouse_addr,
     warehouse_city:req.body.warehouse_city,
     warehouse_state:req.body.warehouse_state,
     warehouse_zip:req.body.warehouse_zip
  };
  console.log(response);
  let query = insertWarehouseQuery("warehouse_info", table_cols, response);
  db.run(query);
  db.all("SELECT * FROM warehouse_info", function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      console.log(rows);
    }
  });
  var page = warehouse_template;
  page += "<h2> Warehouse successfully inserted!</h2><a href=\"http://localhost:8081/warehouse.html\">Go Back</a></body></html>";
  res.send(page);
}

exports.post_update_warehouse = function(req, res){
  // Prepare output in JSON format
  response = {
    warehouse_id:req.body.warehouse_id,
    warehouse_name:req.body.warehouse_name,
    warehouse_addr:req.body.warehouse_addr,
    warehouse_city:req.body.warehouse_city,
    warehouse_state:req.body.warehouse_state,
    warehouse_zip:req.body.warehouse_zip
  };
  console.log(response);
  let query = updateWarehouseQuery("warehouse_info", table_cols, response);
  db.run(query);
  db.all("SELECT * FROM warehouse_info", function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      console.log(rows);
    }
  });
  var page = warehouse_template;
  page += "<h2> Warehouse successfully updated!</h2><a href=\"http://localhost:8081/warehouse.html\">Go Back</a></body></html>";
  res.send(page);
}

exports.post_delete_warehouse = function(req, res){
  // Prepare output in JSON format
  response = {
     warehouse_id:req.body.warehouse_id
  };
  console.log(response);
  let query = deleteWarehouseQuery("warehouse_info", table_cols, response);
  db.run(query);
  db.all("SELECT * FROM warehouse_info", function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      console.log(rows);
    }
  });
  var page = warehouse_template;
  page += "<h2> Warehouse successfully deleted!</h2><a href=\"http://localhost:8081/warehouse.html\">Go Back</a></body></html>";
  res.send(page);
}

exports.get_warehouse_list = function(req, res){
  var page = warehouse_template;
  page += "<h2> Warehouse Table</h2>";
  db.all("SELECT * FROM warehouse_info ORDER BY warehouse_id", function(err, rows){
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

function insertWarehouseQuery(tableName, columns, obj){
  var q;
  if(obj.warehouse_name === ""){
    q = generateSqlQuery(tableName, columns, obj) + '\'' + obj.warehouse_id + '\', NULL,\'' + obj.warehouse_addr + "\',\'" + obj.warehouse_city + "\',\'" + obj.warehouse_state + "\'," + obj.warehouse_zip + ")";
  }else{
    q = generateSqlQuery(tableName, columns, obj) + '\'' + obj.warehouse_id + '\',\'' + obj.warehouse_name + "\',\'" + obj.warehouse_addr + "\',\'" + obj.warehouse_city + "\',\'" + obj.warehouse_state + "\'," + obj.warehouse_zip + ")";
  }
  console.log(q);
  return q;
}

function updateWarehouseQuery(tableName, columns, obj){
  var q;
  if(obj.warehouse_name === ""){
    q = `UPDATE warehouse_info SET warehouse_name = NULL, warehouse_addr = \'${obj.warehouse_addr}\', warehouse_city = \'${obj.warehouse_city}\', warehouse_state = \'${obj.warehouse_state}\', warehouse_zip = \'${obj.warehouse_zip}\' WHERE warehouse_id = \'${obj.warehouse_id}\';`;
  }else{
    q = `UPDATE warehouse_info SET warehouse_name = \'${obj.warehouse_name}\', warehouse_addr = \'${obj.warehouse_addr}\', warehouse_city = \'${obj.warehouse_city}\', warehouse_state = \'${obj.warehouse_state}\', warehouse_zip = \'${obj.warehouse_zip}\' WHERE warehouse_id = \'${obj.warehouse_id}\';`;
  }
  console.log(q);
  return q;
}

function deleteWarehouseQuery(tableName, columns, obj){
  var q;
  q = `DELETE FROM warehouse_info WHERE warehouse_id = \'${obj.warehouse_id}\';`;
  console.log(q);
  return q;
}

function generateTable(rows){
  var result = "<table><tr><th>Warehouse ID</th><th>Warehouse Name</th><th>Street Address</th><th>City</th><th>State</th><th>Zip</th></tr>";
  var arr=[rows.length];
  for(var i=0; i<rows.length; i++) {
    var temp = [6];
    temp[0] = rows[i].warehouse_id;
    temp[1] = rows[i].warehouse_name;
    temp[2] = rows[i].warehouse_addr;
    temp[3] = rows[i].warehouse_city;
    temp[4] = rows[i].warehouse_state;
    temp[5] = rows[i].warehouse_zip;
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
