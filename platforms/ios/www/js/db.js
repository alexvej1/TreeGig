(function () {
    'use strict';

    angular.module('TreeGigApp').factory('dbApi', ['$q', 'DB_CONFIG', '$cordovaSQLite', dbApi]);

    function dbApi($q, DB_CONFIG, $cordovaSQLite) {

        var self = this;
        self.db = null;


        self.init = function () {

            /*   if(window.cordova) {
             // App syntax
             self.db =$cordovaSQLite.openDB(DB_CONFIG.name);
             } else {
             // Ionic serve syntax
             self.db  = window.openDatabase( DB_CONFIG.name, "1.0", "Tree Gig App", -1);
             }
             */

            if (window.sqlitePlugin)
                self.db = window.sqlitePlugin.openDatabase({name: DB_CONFIG.name});
            else if (window.openDatabase)
                self.db = window.openDatabase(DB_CONFIG.name, '1.0', 'database', -1);

            for (var tableName in DB_CONFIG.tables) {
                var defs = [];
                var columns = DB_CONFIG.tables[tableName];
                for (var columnName in columns) {
                    var type = columns[columnName];
                    defs.push(columnName + ' ' + type);
                }
                /*   var sql = 'DROP  TABLE locations';
                 var sql1 = 'DROP  TABLE items';*/

                var sql = 'CREATE TABLE IF NOT EXISTS ' + tableName + ' (' + defs.join(', ') + ')';
                // var   sql1 = 'CREATE UNIQUE CLUSTERED INDEX uuid_phone ON TABLE locations (uuid,phoneNumber)';
                var sql1 = 'CREATE UNIQUE INDEX uuid_locations  ON locations(uuid, phoneNumber)';

                self.query(sql);

                self.query(sql1);
            }
        };

        self.query = function (sql, bindings) {
            bindings = typeof bindings !== 'undefined' ? bindings : [];
            var deferred = $q.defer();

            self.db.transaction(function (transaction) {


                transaction.executeSql(sql, bindings, function (transaction, result) {
                    deferred.resolve(result);
                }, function (transaction, error) {

                    deferred.reject(error);
                    console.log("Error inserting data." + error.code + " " + error.message);
                });
            });

            return deferred.promise;
        };

        self.insertAll = function (tableName, data) {
            var columns = [],
                bindings = [];

            for (var columnName in DB_CONFIG.tables[tableName]) {
                columns.push(columnName);
                bindings.push('?');
            }

            var sql = 'INSERT OR IGNORE INTO ' + tableName + ' (' + columns.join(', ') + ') VALUES (' + bindings.join(', ') + ')';

            for (var i = 0; i < data.length; i++) {
                var values = [];
                for (var j = 0; j < columns.length; j++) {
                    values.push(data[i][columns[j]]);
                }
                self.query(sql, values);

            }
        };

        self.fetchAll = function (result) {
            var output = [];

            for (var i = 0; i < result.rows.length; i++) {
                output.push(result.rows.item(i));
            }

            return output;
        };
        return {
            init: self.init,
            insertAll: self.insertAll,
            query: self.query,
            fetchAll: self.fetchAll
        };
    };
})();