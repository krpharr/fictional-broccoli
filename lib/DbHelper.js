const cTable = require("console.table");

class DbHelper {
    constructor(conn) {
        this.connection = conn;
    }
    selectAll(table, cb) {
        this.connection.query(
            `SELECT * FROM ${table}`,
            function(err, res) {
                if (err) throw err;
                let tb = cTable.getTable(res);
                console.log(tb);
                cb();
            }
        );
    }
}

module.exports = DbHelper;