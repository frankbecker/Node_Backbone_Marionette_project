var mysql = require('mysql');
var async = require('async');
var fs = require("fs");
var _ = require('underscore');
var logger = require('tracer').colorConsole();
var credentials = JSON.parse(fs.readFileSync('db.connection.mysql.json', 'utf8'));

exports.find_all = function(req, res) {
    var connection = mysql.createConnection(credentials);
    var sql = fs.readFileSync('app/sql/project.mysql.sql', 'utf8');
    //sql = mysql.format(sql, inserts);
    connection.connect();
     
    connection.query( sql , function(err, rows, fields) {
      if (err) throw err;
     
      //logger.warn('The solution is: ', rows);
      rows = format_projects(rows);
      res.send(rows);
    });
     
    connection.end();
};


function format_projects (results){

    var _ids = _.pluck(results , 'id');
    var uniq_ids = _.uniq(_ids);
    var new_projects = [];

    _.each(uniq_ids , function(id){
        var projects = _.where(results , {id: id});
        var new_p = [];
            _.each( projects , function(p , index){
                if(index == 0){
                    new_p = p;
                    new_p.file_names = [];
                    new_p.researches = [];
                    new_p.table_names = [];
                }
                    if(p.filename){
                        new_p.file_names.push( p.filename );
                    }
                    if(p.researcher){
                        new_p.researches.push( p.researcher );
                    }
                    if(p.table_name){
                        new_p.table_names.push( p.table_name );
                    }                    
            });

            var uniq_file_names = _.uniq(new_p.file_names);
            var uniq_researches = _.uniq(new_p.researches);
            var uniq_table_names = _.uniq(new_p.table_names);

            new_p.file_names = uniq_file_names;
            new_p.researches = uniq_researches;
            new_p.table_names = uniq_table_names;

            delete new_p['filename'];
            delete new_p['researcher'];
            delete new_p['table_name'];

            new_projects.push(new_p);
    });

return new_projects;
}