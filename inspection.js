var express = require('express');
var app = express();
var path = require('path');
const sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database("./abcDispatch.db");

var table_cols = ["inspector_id", "truck_id", "date_last", "date_next"];

//template for return html page that has the option to contain a table
inspection_template = "<html><head><style>.topnav {background-color: #333; overflow:hidden;} .topnav a{float:left; color: #f2f2f2; text-align: center;";
inspection_template += "padding: 14px 16px; text-decoration: none; font-size: 17px;} .topnav a:hover { background-color:#ccc; color:black;} ";
inspection_template += ".topnav a.active{ background-color: #00ace6; color:white;} body {background-color: #007399;} h2{color: #f2f2f2;} table, th, td";
inspection_template += "{background-color: #f2f2f2; color: black; border: 1px solid black; padding: 2px 3px; text-align: center;} table{padding: 10px;}";
inspection_template += " </style></head><body><div class=\"topnav\"><a href=\"http://localhost:8081/main.html\">Home</a>";
inspection_template += "<a href=\"http://localhost:8081/driver.html\">Driver</a><a href=\"http://localhost:8081/truck.html\">Truck</a>";
inspection_template += "<a class=\"active\" href=\"http://localhost:8081/inspection.html\">Inspection</a><a href=\"http://localhost:8081/owner.html\">Owner</a>";
inspection_template += "<a href=\"http://localhost:8081/warehouse.html\">Warehouse</a><a href=\"http://localhost:8081/delivery.html\">Delivery</a></div>";

exports.createInspectionTable = function(){
  db.serialize(function() {
    db.run("CREATE TABLE if not exists inspection_info (inspector_id TEXT, truck_id TEXT NOT NULL, date_last TEXT NOT NULL, date_next TEXT NOT NULL, PRIMARY KEY(inspector_id, truck_id), FOREIGN KEY(inspector_id) REFERENCES inspector_info(inspector_id) ON UPDATE CASCADE ON DELETE SET NULL, FOREIGN KEY(truck_id) REFERENCES truck_info(truck_id) ON UPDATE CASCADE ON DELETE SET NULL)");
  });
}

exports.post_insert_inspection = function(req, res){
  // Prepare output in JSON format
  response = {
     inspector_id:req.body.inspector_id,
     truck_id:req.body.truck_id,
     date_last:req.body.date_last,
     date_next:req.body.date_next
  };
  console.log(response);
  let query = insertInspectionQuery("inspection_info", table_cols, response);
  db.run(query);
  db.all("SELECT * FROM inspection_info", function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      console.log(rows);
    }
  });
  var page = inspection_template;
  page += "<h2> Inspection successfully inserted!</h2><a href=\"http://localhost:8081/inspection.html\">Go Back</a></body></html>";
  res.send(page);
}

exports.post_update_inspection = function(req, res){
  // Prepare output in JSON format
  response = {
    inspector_id:req.body.inspector_id,
    truck_id:req.body.truck_id,
    date_last:req.body.date_last,
    date_next:req.body.date_next
  };
  console.log(response);
  let query = updateInspectionQuery("inspection_info", table_cols, response);
  db.run(query);
  db.all("SELECT * FROM inspection_info", function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      console.log(rows);
    }
  });
  var page = inspection_template;
  page += "<h2> Inspection successfully updated!</h2><a href=\"http://localhost:8081/inspection.html\">Go Back</a></body></html>";
  res.send(page);
}

exports.post_delete_inspection = function(req, res){
  // Prepare output in JSON format
  response = {
     inspector_id:req.body.inspector_id,
     truck_id:req.body.truck_id
  };
  console.log(response);
  let query = deleteInspectionQuery("inspection_info", table_cols, response);
  db.run(query);
  db.all("SELECT * FROM inspection_info", function(err, rows){
    if(err){
      console.log(err);
    }
    else{
      console.log(rows);
    }
  });
  var page = inspection_template;
  page += "<h2> Inspection successfully deleted!</h2><a href=\"http://localhost:8081/inspection.html\">Go Back</a></body></html>";
  res.send(page);
}

exports.get_inspection_list = function(req, res){
  var page = inspection_template;
  page += "</div><h2>Inspection's Table</h2>";
  db.all("SELECT * FROM inspection_info", function(err, rows){
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

exports.get_next_inspection_list = function(req, res){
  var page = inspection_template;
  page += "</div><h2>Inspection's Table</h2>";
  db.all(`SELECT * FROM inspection_info WHERE date_next LIKE \'${req.body.month}%\'`, function(err, rows){
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

exports.search_inspector_id = function(req, res){
  var page = inspection_template;
  page += "</div><h2>Inspection's Table</h2>";
  db.all(`SELECT * FROM inspection_info WHERE inspector_id = \'${req.body.inspector_id}\';`, function(err, rows){
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

exports.search_truck_id = function(req, res){
  var page = inspection_template;
  page += "</div><h2>Inspection's Table</h2>";
  db.all(`SELECT * FROM inspection_info WHERE truck_id = \'${req.body.truck_id}\';`, function(err, rows){
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

exports.search_inspection_last_date = function(req, res){
  var page = inspection_template;
  page += "</div><h2>Inspection's Table</h2>";
  db.all(`SELECT * FROM inspection_info WHERE date_last = \'${req.body.date_last}\';`, function(err, rows){
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

exports.search_inspection_next_date = function(req, res){
  var page = inspection_template;
  page += "</div><h2>Inspection's Table</h2>";
  db.all(`SELECT * FROM inspection_info WHERE date_next = \'${req.body.date_next}\';`, function(err, rows){
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

function insertInspectionQuery(tableName, columns, obj){
  let q = generateSqlQuery(tableName, columns, obj) + '\'' + obj.inspector_id + '\',\'' + obj.truck_id + "\',\'" + obj.date_last + "\',\'" + obj.date_next + "\')";
  console.log(q);
  return q;
}

function updateInspectionQuery(tableName, columns, obj){
  var q = `UPDATE inspection_info SET truck_id = \'${obj.truck_id}\', date_last = \'${obj.date_last}\', date_next = \'${obj.date_next}\' WHERE inspector_id = \'${obj.inspector_id}\';`;
  console.log(q);
  return q;
}

function deleteInspectionQuery(tableName, columns, obj){
  var q;
  q = `DELETE FROM inspection_info WHERE inspector_id = \'${obj.inspector_id}\' AND truck_id = \'${obj.truck_id}\';`;
  console.log(q);
  return q;
}

function generateTable(rows){
  var result = "<table><tr><th>Inspector ID</th><th>Truck ID</th><th>Date Last</th><th>Date Next</th></tr>";
  var arr=[rows.length];
  for(var i=0; i<rows.length; i++) {
    var temp = [4];
    temp[0] = rows[i].inspector_id;
    temp[1] = rows[i].truck_id;
    temp[2] = rows[i].date_last;
    temp[3] = rows[i].date_next;
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
