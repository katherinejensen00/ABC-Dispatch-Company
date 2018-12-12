var express = require('express');
var app = express();
var path = require('path');
const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database("./abcDispatch.db");

var table_cols = ["truck_id", "warehouse_id", "item_id", "quantity"];

//template for return html page that has the option to contain a table
delivery_template = "<html><head><style>.topnav {background-color: #333; overflow:hidden;} .topnav a{float:left; color: #f2f2f2; text-align: center;";
delivery_template += "padding: 14px 16px; text-decoration: none; font-size: 17px;} .topnav a:hover { background-color:#ccc; color:black;} ";
delivery_template += ".topnav a.active{ background-color: #00ace6; color:white;} body {background-color: #007399;} h2{color: #f2f2f2;} table, th, td";
delivery_template += "{background-color: #f2f2f2; color: black; border: 1px solid black; padding: 2px 3px; text-align: center;} table{padding: 10px;}";
delivery_template += " </style></head><body><div class=\"topnav\"><a href=\"http://localhost:8081/main.html\">Home</a>";
delivery_template += "<a href=\"http://localhost:8081/driver.html\">Driver</a><a href=\"http://localhost:8081/truck.html\">Truck</a>";
delivery_template += "<a href=\"http://localhost:8081/inspection.html\">Inspection</a><a href=\"http://localhost:8081/owner.html\">Owner</a>";
delivery_template += "<a href=\"http://localhost:8081/warehouse.html\">Warehouse</a><a class=\"active\" href=\"http://localhost:8081/delivery.html\">Delivery</a></div>";

exports.createDeliveryTable = function(){
  db.serialize(function() {
    db.get("PRAGMA foreign_keys = ON");
    db.run("CREATE TABLE if not exists delivery_info (truck_id TEXT NOT NULL, warehouse_id TEXT NOT NULL, item_id TEXT NOT NULL, quantity INTEGER NOT NULL, PRIMARY KEY(truck_id, warehouse_id, item_id, quantity), FOREIGN KEY(truck_id) REFERENCES truck_info(truck_id) ON UPDATE CASCADE ON DELETE SET NULL, FOREIGN KEY(warehouse_id) REFERENCES warehouse_info(warehouse_id) ON UPDATE CASCADE ON DELETE SET NULL, FOREIGN KEY(item_id) REFERENCES item_info(item_id) ON UPDATE CASCADE ON DELETE SET NULL)");
  });
}

exports.post_insert_delivery = function(req, res){
  // Prepare output in JSON format
  response = {
     truck_id:req.body.truck_id,
     warehouse_id:req.body.warehouse_id,
     item_id:req.body.item_id,
     quantity: req.body.quantity
  };
  console.log(response);
  let query = insertDeliveryQuery("delivery_info", table_cols, response);
  db.run(query);
  db.all("SELECT * FROM delivery_info", function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      console.log(rows);
    }
  });
  var page = delivery_template;
  page += "<h2> Delivery successfully inserted!</h2><a href=\"http://localhost:8081/delivery.html\">Go Back</a></body></html>";
  res.send(page);
}

exports.post_delete_delivery = function(req, res){
  // Prepare output in JSON format
  response = {
    truck_id:req.body.truck_id,
    warehouse_id:req.body.warehouse_id,
    item_id:req.body.item_id,
    quantity: req.body.quantity
  };
  console.log(response);
  let query = deleteDeliveryQuery("delivery_info", table_cols, response);
  db.run(query);
  db.all("SELECT * FROM delivery_info", function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      console.log(rows);
    }
  });
  var page = delivery_template;
  page += "<h2> Delivery successfully deleted!</h2><a href=\"http://localhost:8081/delivery.html\">Go Back</a></body></html>";
  res.send(page);
}

exports.get_delivery_list = function(req, res){
  var page = delivery_template;
  page += "<h2> Delivery Table</h2>";
  db.all("SELECT * FROM delivery_info", function(err, rows){
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

exports.get_delivery_warehouse_list = function(req, res){
  var page = delivery_template;
  page += "<h2> Delivery By Warehouse Table</h2>";
  db.all("SELECT * FROM delivery_info ORDER BY warehouse_id", function(err, rows){
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

exports.get_delivery_report = function(req, res){
  var page = delivery_template;
  page += "<h2> Delivery Table</h2>";
  var stats_q = "SELECT item_id, MIN(quantity) AS min, AVG(quantity) AS avg, MAX(quantity) AS max, COUNT(*) AS count FROM delivery_info GROUP BY item_id;";

  db.all(stats_q, function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      page += generateDeliveryReportTable(rows);
    }
    page += "</body></html>";
    res.send(page);
  });
}

exports.get_truck_delivery_report = function(req, res){
  var page = delivery_template;
  page += "<h2> Delivery Table</h2>";
  var stats_q = "SELECT truck_id, MIN(quantity) AS min, AVG(quantity) AS avg, MAX(quantity) AS max, COUNT(*) AS count FROM delivery_info GROUP BY truck_id;";

  db.all(stats_q, function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      page += generateTruckDeliveryReportTable(rows);
    }
    page += "</body></html>";
    res.send(page);
  });
}

function insertDeliveryQuery(tableName, columns, obj){
  let q = generateSqlQuery(tableName, columns, obj) + '\'' + obj.truck_id + '\',\'' + obj.warehouse_id + "\',\'" + obj.item_id + "\'," + obj.quantity + ")";
  console.log(q);
  return q;
}

function deleteDeliveryQuery(tableName, columns, obj){
  var q;
  q = `DELETE FROM delivery_info WHERE truck_id = \'${obj.truck_id}\' AND warehouse_id = \'${obj.warehouse_id}\' AND item_id = \'${obj.item_id}\' AND quantity = ${obj.quantity};`;
  console.log(q);
  return q;
}

function generateDeliveryReportTable(rows){
  var result = "<table><tr><th>Item ID</th><th>Min</th><th>Average</th><th>Max</th><th>Num Of Deliveries</th></tr>";
  var arr=[rows.length];
  for(var i=0; i<rows.length; i++) {
    var temp = [5];
    temp[0] = rows[i].item_id;
    temp[1] = rows[i].min;
    temp[2] = rows[i].avg;
    temp[3] = rows[i].max;
    temp[4] = rows[i].count;
    arr[i] = temp;
  }

  for(var i=0; i<arr.length; i++) {
    result += "<tr>";
    for(var j=0; j<5; j++){
        result += "<td>"+arr[i][j]+"</td>";
    }
    result += "</tr>";
  }
  result += "</table>";
  return result;
}

function generateTruckDeliveryReportTable(rows){
  var result = "<table><tr><th>Truck ID</th><th>Min</th><th>Average</th><th>Max</th><th>Num Of Deliveries</th></tr>";
  var arr=[rows.length];
  for(var i=0; i<rows.length; i++) {
    var temp = [5];
    temp[0] = rows[i].truck_id;
    temp[1] = rows[i].min;
    temp[2] = rows[i].avg;
    temp[3] = rows[i].max;
    temp[4] = rows[i].count;
    arr[i] = temp;
  }

  for(var i=0; i<arr.length; i++) {
    result += "<tr>";
    for(var j=0; j<5; j++){
        result += "<td>"+arr[i][j]+"</td>";
    }
    result += "</tr>";
  }
  result += "</table>";
  return result;
}

function generateTable(rows){
  var result = "<table><tr><th>Truck ID</th><th>Warehouse ID</th><th>ItemID</th><th>Quantity</th></tr>";
  var arr=[rows.length];
  for(var i=0; i<rows.length; i++) {
    var temp = [4];
    temp[0] = rows[i].truck_id;
    temp[1] = rows[i].warehouse_id;
    temp[2] = rows[i].item_id;
    temp[3] = rows[i].quantity;
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
