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
        FROM role
        LEFT JOIN department 
        ON ${on};`
        this.connection.query(
            query,
            function(err, res) {
                if (err) throw err;
                cb(res);
            }
        );
    }

    displayTable(table) {
        let tb = cTable.getTable(table);
        console.log(tb);
    }
}

module.exports = DbHelper;