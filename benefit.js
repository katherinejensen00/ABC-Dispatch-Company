var express = require('express');
var app = express();
var path = require('path');
const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database("./abcDispatch.db");

var table_cols = ["benefit_id", "benefit_description"];

//template for return html page that has the option to contain a table
benefit_template = "<html><head><style>.topnav {background-color: #333; overflow:hidden;} .topnav a{float:left; color: #f2f2f2; text-align: center;";
benefit_template += "padding: 14px 16px; text-decoration: none; font-size: 17px;} .topnav a:hover { background-color:#ccc; color:black;} ";
benefit_template += ".topnav a.active{ background-color: #00ace6; color:white;} body {background-color: #007399;} h2{color: #f2f2f2;} table, th, td";
benefit_template += "{background-color: #f2f2f2; color: black; border: 1px solid black; padding: 2px 3px; text-align: center;} table{padding: 10px;}";
benefit_template += " </style></head><body><div class=\"topnav\"><a href=\"http://localhost:8081/main.html\">Home</a><a class=\"active\"";
benefit_template += "href=\"http://localhost:8081/driver.html\">Driver</a><a href=\"http://localhost:8081/truck.html\">Truck</a>";
benefit_template += "<a href=\"http://localhost:8081/inspection.html\">Inspection</a><a href=\"http://localhost:8081/owner.html\">Owner</a>";
benefit_template += "<a href=\"http://localhost:8081/warehouse.html\">Warehouse</a><a href=\"http://localhost:8081/delivery.html\">";
benefit_template += "Delivery</a></div>";

exports.createBenefitsTable = function(){
  db.serialize(function() {
    db.get("PRAGMA foreign_keys = ON");
    db.run("CREATE TABLE if not exists benefit_info (benefit_id TEXT, benefit_description TEXT NOT NULL, PRIMARY KEY(benefit_id))");
  });
}

exports.post_insert_benefit = function(req, res){
  // Prepare output in JSON format
  response = {
     benefit_id:req.body.benefit_id,
     benefit_description:req.body.benefit_description
  };
  console.log(response);
  let query = insertBenefitQuery("benefit_info", table_cols, response);
  db.run(query);
  db.all("SELECT * FROM benefit_info", function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      console.log(rows);
    }
  });
  var page = benefit_template;
  page += "<h2> Benefit successfully inserted!</h2><a href=\"http://localhost:8081/driver.html\">Go Back</a></body></html>";
  res.send(page);
}

exports.post_update_benefit = function(req, res){
  // Prepare output in JSON format
  response = {
     benefit_id:req.body.benefit_id,
     benefit_description:req.body.benefit_description
  };
  console.log(response);
  let query = updateBenefitQuery("benefit_info", table_cols, response);
  db.run(query);
  db.all("SELECT * FROM benefit_info", function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      console.log(rows);
    }
  });
  var page = benefit_template;
  page += "<h2> Benefit successfully updated!</h2><a href=\"http://localhost:8081/driver.html\">Go Back</a></body></html>";
  res.send(page);
}

exports.post_delete_benefit = function(req, res){
  // Prepare output in JSON format
  response = {
     benefit_id:req.body.benefit_id
  };
  console.log(response);
  let query = deleteBenefitQuery("benefit_info", table_cols, response);
  db.run(query);
  db.all("SELECT * FROM benefit_info", function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      console.log(rows);
    }
  });
  var page = benefit_template;
  page += "<h2> Benefit successfully deleted!</h2><a href=\"http://localhost:8081/driver.html\">Go Back</a></body></html>";
  res.send(page);
}

exports.get_benefit_list = function(req, res){
  var page = benefit_template;
  page += "<h2> Benefits Table</h2>";
  db.all("SELECT * FROM benefit_info", function(err, rows){
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

function insertBenefitQuery(tableName, columns, obj){
  let q = generateSqlQuery(tableName, columns, obj) + '\'' + obj.benefit_id + '\'' + ',\'' + obj.benefit_description + "\')";
  console.log(q);
  return q;
}

function updateBenefitQuery(tableName, columns, obj){
  var q = `UPDATE benefit_info SET benefit_description = \'${obj.benefit_description}\' WHERE benefit_id = \'${obj.benefit_id}\';`;
  console.log(q);
  return q;
}

function deleteBenefitQuery(tableName, columns, obj){
  var q = `DELETE FROM benefit_info WHERE benefit_id = \'${obj.benefit_id}\';`;
  console.log(q);
  return q;
}

function generateTable(rows){
  var result = "<table><tr><th>Benefit Id</th><th>Benefit Description</th></tr>";
  var arr=[rows.length];
  for(var i=0; i<rows.length; i++) {
    var temp = [2];
    temp[0] = rows[i].benefit_id;
    temp[1] = rows[i].benefit_description;
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
