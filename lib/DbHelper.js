const cTable = require("console.table");

class DbHelper {
    constructor(conn) {
        this.connection = conn;
    }
    selectAll(table_name, cb) {
        this.connection.query(
            `SELECT * FROM ${table_name}`,
            function(err, res) {
                if (err) throw err;
                // let tb = cTable.getTable(res);
                // console.log(tb);
                cb(res);
            }
        );
    }

    innerLeftJoin(t1, t2, select, on, cb) {
        let query = `SELECT ${select}
        FROM ${t1}
        LEFT JOIN ${t2} 
        ON ${on};`
        this.connection.query(
            query,
            function(err, res) {
                if (err) throw err;
                cb(res);
            }
        );
    }

    query(query, cb) {
        this.connection.query(
            query,
            function(err, res) {
                if (err) {
                    // console.log(err);
                    cb([]);
                } else {
                    cb(res);
                }
            }
        );
    }

    displayTable(table) {
        let tb = cTable.getTable(table);
        console.log(tb);
    }
}

module.exports = DbHelper;