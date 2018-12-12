var express = require('express');
var app = express();
var path = require('path');
const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database("./abcDispatch.db");

var table_cols = ["item_id", "item_name"];

//template for return html page that has the option to contain a table
item_template = "<html><head><style>.topnav {background-color: #333; overflow:hidden;} .topnav a{float:left; color: #f2f2f2; text-align: center;";
item_template += "padding: 14px 16px; text-decoration: none; font-size: 17px;} .topnav a:hover { background-color:#ccc; color:black;} ";
item_template += ".topnav a.active{ background-color: #00ace6; color:white;} body {background-color: #007399;} h2{color: #f2f2f2;} table, th, td";
item_template += "{background-color: #f2f2f2; color: black; border: 1px solid black; padding: 2px 3px; text-align: center;} table{padding: 10px;}";
item_template += " </style></head><body><div class=\"topnav\"><a href=\"http://localhost:8081/main.html\">Home</a>";
item_template += "<a href=\"http://localhost:8081/driver.html\">Driver</a><a href=\"http://localhost:8081/truck.html\">Truck</a>";
item_template += "<a href=\"http://localhost:8081/inspection.html\">Inspection</a><a href=\"http://localhost:8081/owner.html\">Owner</a>";
item_template += "<a href=\"http://localhost:8081/warehouse.html\">Warehouse</a><a class=\"active\" href=\"http://localhost:8081/delivery.html\">Delivery</a></div>";

exports.createItemTable = function(){
  db.serialize(function() {
    db.get("PRAGMA foreign_keys = ON");
    db.run("CREATE TABLE if not exists item_info (item_id TEXT NOT NULL, item_name TEXT NOT NULL, PRIMARY KEY(item_id))");
  });
}

exports.post_insert_item = function(req, res){
  // Prepare output in JSON format
  response = {
     item_id:req.body.item_id,
     item_name:req.body.item_name
  };
  console.log(response);
  let query = insertItemQuery("item_info", table_cols, response);
  db.run(query);
  db.all("SELECT * FROM item_info", function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      console.log(rows);
    }
  });
  var page = item_template;
  page += "<h2> Item successfully inserted!</h2><a href=\"http://localhost:8081/delivery.html\">Go Back</a></body></html>";
  res.send(page);
}

exports.post_update_item = function(req, res){
  // Prepare output in JSON format
  response = {
    item_id:req.body.item_id,
    item_name:req.body.item_name
  };
  console.log(response);
  let query = updateItemQuery("item_info", table_cols, response);
  db.run(query);
  db.all("SELECT * FROM item_info", function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      console.log(rows);
    }
  });
  var page = item_template;
  page += "<h2> Item successfully updated!</h2><a href=\"http://localhost:8081/delivery.html\">Go Back</a></body></html>";
  res.send(page);
}

exports.post_delete_item = function(req, res){
  // Prepare output in JSON format
  response = {
     item_id:req.body.item_id
  };
  console.log(response);
  let query = deleteItemQuery("item_info", table_cols, response);
  db.run(query);
  db.all("SELECT * FROM item_info", function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      console.log(rows);
    }
  });
  var page = item_template;
  page += "<h2> Item successfully deleted!</h2><a href=\"http://localhost:8081/delivery.html\">Go Back</a></body></html>";
  res.send(page);
}

exports.get_item_list = function(req, res){
  var page = item_template;
  page += "<h2> Item Table</h2>";
  db.all("SELECT * FROM item_info", function(err, rows){
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

function insertItemQuery(tableName, columns, obj){
  //Come back to this and deal with null values for optional trained_by and add truck_id once you work out foreign key
  let q = generateSqlQuery(tableName, columns, obj) + '\'' + obj.item_id + '\',\'' + obj.item_name + "\')";
  console.log(q);
  return q;
}

function updateItemQuery(tableName, columns, obj){
  var q = `UPDATE item_info SET item_name = \'${obj.item_name}\' WHERE item_id = \'${obj.item_id}\';`;
  console.log(q);
  return q;
}

function deleteItemQuery(tableName, columns, obj){
  var q;
  q = `DELETE FROM item_info WHERE item_id = \'${obj.item_id}\';`;
  console.log(q);
  return q;
}

function generateTable(rows){
  var result = "<table><tr><th>Item ID</th><th>Item Name</th></tr>";
  var arr=[rows.length];
  for(var i=0; i<rows.length; i++) {
    var temp = [2];
    temp[0] = rows[i].item_id;
    temp[1] = rows[i].item_name;
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
