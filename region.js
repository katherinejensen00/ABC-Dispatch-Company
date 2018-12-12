var express = require('express');
var app = express();
var path = require('path');
const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database("./abcDispatch.db");

var table_cols = ["region_id", "region_name"];

//template for return html page that has the option to contain a table
region_template = "<html><head><style>.topnav {background-color: #333; overflow:hidden;} .topnav a{float:left; color: #f2f2f2; text-align: center;";
region_template += "padding: 14px 16px; text-decoration: none; font-size: 17px;} .topnav a:hover { background-color:#ccc; color:black;} ";
region_template += ".topnav a.active{ background-color: #00ace6; color:white;} body {background-color: #007399;} h2{color: #f2f2f2;} table, th, td";
region_template += "{background-color: #f2f2f2; color: black; border: 1px solid black; padding: 2px 3px; text-align: center;} table{padding: 10px;}";
region_template += " </style></head><body><div class=\"topnav\"><a href=\"http://localhost:8081/main.html\">Home</a>";
region_template += "<a href=\"http://localhost:8081/driver.html\">Driver</a> <a class=\"active\" href=\"http://localhost:8081/truck.html\">Truck</a>";
region_template += "<a href=\"http://localhost:8081/inspection.html\">Inspection</a><a href=\"http://localhost:8081/owner.html\">Owner</a>";
region_template += "<a href=\"http://localhost:8081/warehouse.html\">Warehouse</a><a href=\"http://localhost:8081/delivery.html\">Delivery</a></div>";

exports.createRegionTable = function(){
  db.serialize(function() {
    db.get("PRAGMA foreign_keys = ON");
    db.run("CREATE TABLE if not exists region_info (region_id TEXT, region_name TEXT NOT NULL UNIQUE, PRIMARY KEY(region_id))");
  });
}

exports.post_insert_region = function(req, res){
  // Prepare output in JSON format
  response = {
     region_id:req.body.region_id,
     region_name:req.body.region_name
  };

  console.log(response);
  let query = insertRegionQuery("region_info", table_cols, response);
  db.run(query);
  db.all("SELECT * FROM region_info", function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      console.log(rows);
    }
  });
  var page = region_template;
  page += "<h2> Region successfully inserted!</h2><a href=\"http://localhost:8081/truck.html\">Go Back</a></body></html>";
  res.send(page);
}

exports.post_update_region = function(req, res){
  // Prepare output in JSON format
  response = {
    region_id:req.body.region_id,
    region_name:req.body.region_name
  };
  console.log(response);
  let query = updateRegionQuery("region_info", table_cols, response);
  db.run(query);
  db.all("SELECT * FROM region_info", function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      console.log(rows);
    }
  });
  var page = region_template;
  page += "<h2> Region successfully updated!</h2><a href=\"http://localhost:8081/truck.html\">Go Back</a></body></html>";
  res.send(page);
}

exports.post_delete_region = function(req, res){
  // Prepare output in JSON format
  response = {
     region_id:req.body.region_id
  };
  console.log(response);
  let query = deleteRegionQuery("region_info", table_cols, response);
  db.run(query);
  db.all("SELECT * FROM region_info", function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      console.log(rows);
    }
  });
  var page = region_template;
  page += "<h2> Region successfully deleted!</h2><a href=\"http://localhost:8081/truck.html\">Go Back</a></body></html>";
  res.send(page);
}

exports.get_region_list = function(req, res){
  var page = region_template;
  page += "<h2> Region's Table</h2>";
  db.all("SELECT * FROM region_info", function(err, rows){
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

function insertRegionQuery(tableName, columns, obj){
  let q = generateSqlQuery(tableName, columns, obj) + '\'' + obj.region_id + '\'' + ',\'' + obj.region_name + "\')";
  console.log(q);
  return q;
}

function updateRegionQuery(tableName, columns, obj){
  var q = `UPDATE region_info SET region_name = \'${obj.region_name}\' WHERE region_id = \'${obj.region_id}\';`;
  console.log(q);
  return q;
}

function deleteRegionQuery(tableName, columns, obj){
  var q;
  q = `DELETE FROM region_info WHERE region_id = \'${obj.region_id}\';`;
  console.log(q);
  return q;
}

function generateTable(rows){
  var result = "<table><tr><th>Region Id</th><th>Region Name</th></tr>";
  var arr=[rows.length];
  for(var i=0; i<rows.length; i++) {
    var temp = [2];
    temp[0] = rows[i].region_id;
    temp[1] = rows[i].region_name;
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
