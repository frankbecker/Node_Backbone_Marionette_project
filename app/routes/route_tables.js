var mysql = require('mysql');
var async = require('async');
var fs = require("fs");
var _ = require('underscore');
var logger = require('tracer').colorConsole();
var credentials = JSON.parse(fs.readFileSync('db.connection.mysql.json', 'utf8'));

exports.find_all = function(req, res) {
    var connection = mysql.createConnection(credentials);
    var sql = fs.readFileSync('app/sql/tables.mysql.sql', 'utf8');
    connection.connect();
     
    connection.query( sql , function(err, rows, fields) {
      if (err) throw err;
     
      //logger.warn('The solution is: ', rows);
      rows = format_tables(rows);
      res.send(rows);
    });
     
    connection.end();
};

exports.find_table = function(req, res) {
    var _id = req.params.id;
    logger.warn(_id);
    var connection = mysql.createConnection(credentials);
    var sql = fs.readFileSync('app/sql/table_by_id.mysql.sql', 'utf8');
    sql = mysql.format(sql, [_id]);
    connection.connect();
     
    connection.query( sql , function(err, rows, fields) {
      if (err) throw err;
     
      //logger.warn('The solution is: ', rows);
      rows = format_tables(rows);
      res.send(rows);
      connection.end();
    });
};


function format_tables (results){

    var _ids = _.pluck(results , 'id');
    var uniq_ids = _.uniq(_ids);
    var new_tables = [];

    _.each(uniq_ids , function(id){
        var tables = _.where(results , {id: id});
        var new_p = [];
            _.each( tables , function(t , index){
                if(index == 0){
                    new_t = t;
                    new_t.fields = [];
                    new_t.files = [];
                    new_t.projects = [];
                    new_t.researchers = [];
                }
                if(t.field_id){
                    new_t.fields.push({
                        id: t.field_id , name: t.field_name
                    });
                }
                if(t.file_id){
                    new_t.files.push({
                        id: t.file_id , name: t.filename
                    });
                }
                if(t.project_id){
                    new_t.projects.push({
                        id: t.project_id , name: t.project_title
                    });
                }
                if(t.researcher_id){
                    new_t.researchers.push({
                        id: t.researcher_id , name: t.researcher
                    });
                }

                new_t.fields        = return_uniq_arrays(new_t.fields);
                new_t.files         = return_uniq_arrays(new_t.files);
                new_t.projects      = return_uniq_arrays(new_t.projects);
                new_t.researchers   = return_uniq_arrays(new_t.researchers);

            });
    
        delete new_t['project_id'];
        delete new_t['field_name'];
        delete new_t['field_id'];        
        delete new_t['file_id'];
        delete new_t['filename'];
        delete new_t['path'];
        delete new_t['project_title'];
        delete new_t['researcher'];
        delete new_t['researcher_id'];

        new_tables.push(new_t);
    });

return new_tables;
}

function  return_uniq_arrays (fields) {
    var uniq_fields_ids = _.pluck( fields , 'id');
    var uniq_fields = _.uniq(uniq_fields_ids);
    var new_fields = [];

    _.each(uniq_fields, function(uniq){
        var field = _.findWhere(fields , { id: uniq });
        new_fields.push(field);
    });

    return new_fields;
}