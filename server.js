const inquirer = require("inquirer");
const cTable = require("console.table");
const mysql = require("mysql");
const validator = require("validator");

let connection;

connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "9EBu6swH",
    database: 'cms_db'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    start();
});


function start() {
    let msg = `
    ADD - add departments, roles, and employees.
    VIEW - view departments, roles, employees, employees by manager, and utilized budget by department.
    UPDATE - update employee roles and employee managers.`;
    console.log(msg);
    const questions = [{
        type: 'list',
        name: 'action',
        message: 'Select option',
        choices: [
            'ADD',
            'VIEW',
            'UPDATE'
        ],
    }];
    inquirer.prompt(questions).then(answers => {
        switch (answers.action) {
            case 'ADD':
                add();
                break;
            case 'VIEW':
                view();
                break;
            case 'UPDATE':
                update();
                break;
        }
    });
};

////////////////////////////////////////////////////////////
function add() {
    let msg = `ADD - departments, roles, and employees.`;
    console.log(msg);
    const questions = [{
        type: 'list',
        name: 'action',
        message: 'Select option',
        choices: [
            'Department',
            'Role',
            'Employee',
            '<-Back'
        ],
    }];
    inquirer.prompt(questions).then(answers => {
        switch (answers.action) {
            case 'Department':
                addDepartment();
                break;
            case 'Role':
                addRole();
                break;
            case 'Employee':
                addEmployee();
                break;
            case '<-Back':
                start();
                break;
        }
    });
};

function selectAllFromTable(table, cb) {

    connection.query(
        `SELECT * FROM ${table}`,
        function(err, res) {
            if (err) throw err;
            let tb = cTable.getTable(res);
            console.log(tb);
            cb();
        }
    );

};

function addDepartment() {
    selectAllFromTable("department", inquireDepartment);
};

function inquireDepartment() {
    const questions = [{
        type: 'input',
        name: 'name',
        message: 'Enter name for new department.',
        validate: function(value) {
            var valid = !validator.isEmpty(value);
            return valid || 'Department name can not be empty.';
        }
    }];
    inquirer.prompt(questions).then(answers => {
        console.log(answers.name);
        connection.query(
            "INSERT INTO department (name) VALUES (?)", [answers.name],
            function(err, res) {
                if (err) throw err;
                console.log(`${answers.name} sucessfully added to database.`);
                add();
            }
        );
    });
};

function addRole() {

};

function addEmployee() {

};

//////////////////////////////////////////////////////////

function view() {
    let msg = `VIEW - departments, roles, employees, employees by manager, and utilized budget by department.`;
    console.log(msg);
    const questions = [{
        type: 'list',
        name: 'action',
        message: 'Select option',
        choices: [
            'Department',
            'Role',
            'Employee',
            'Employees by manager.',
            'Utilized budget by department.',
            '<-Back'
        ],
    }];
    inquirer.prompt(questions).then(answers => {
        switch (answers.action) {
            case 'Department':
                viewDepartment();
                break;
            case 'Role':
                viewRole();
                break;
            case 'Employee':
                viewEmployee();
                break;
            case 'Employees by manager.':
                viewEmployeesByManager();
                break;
            case 'Utilized budget by department.':
                viewUtilizedBudgetByDepartment();
                break;
            case '<-Back':
                start();
                break;
        }
    });
};

function viewDepartment() {

};

function viewRole() {

};

function viewEmployee() {

};

function viewEmployeesByManager() {

};

function viewUtilizedBudgetByDepartment() {

};

///////////////////////////////////////////

function update() {
    let msg = `UPDATE - employee roles and employee managers.`;
    const questions = [{
        type: 'list',
        name: 'action',
        message: msg,
        choices: [
            'Employee role',
            'Employee manager',
            '<-Back'
        ],
    }];
    inquirer.prompt(questions).then(answers => {
        switch (answers.action) {
            case 'Employee role':
                updateEmployeeRole();
                break;
            case 'Employee manager':
                updateEmployeeManager();
                break;
            case '<-Back':
                start();
                break;
        }
    });
};

function updateEmployeeRole() {

};

function updateEmployeeManager() {

};

///////////////////////////////////////////////////////////////////////
// function login() {
//     const questions = [{
//             type: 'input',
//             name: 'username',
//             message: 'username:',
//             validate: function(value) {
//                 var valid = !validator.isEmpty(value);
//                 return valid || 'username can not be empty.';
//             }
//         },
//         {
//             type: 'password',
//             message: 'password:',
//             name: 'password',
//             mask: '*',
//             validate: function(value) {
//                 var valid = !validator.isEmpty(value);
//                 return valid || 'password can not be empty.';
//             }
//         }
//     ];
//     inquirer.prompt(questions).then(answers => {
//         console.log(answers.username, answers.password);
//         let { username: user, password } = answers;
//         connectUser(user, password);
//     });
// };

// function connectUser(user, password) {
//     connection = mysql.createConnection({
//         host: "localhost",
//         port: 3306,
//         user: user,
//         password: password,
//     });
//     connection.connect(function(err) {
//         if (err) throw err;
//         console.log("connected as id " + connection.threadId + "\n");
//         // if (databaseExists()) {
//         //     //inquireModifyDatabase();
//         //     start();
//         // } else {
//         //     buildDatabase();
//         // }
//         databaseExists().then(res => {
//             console.log(res);
//         });
//     });
// };

// async function databaseExists() {
//     try {
//         let connected;
//         connected = await connection.changeUser({ database: 'cms_db' }, function(err) {
//             // if (err) return false;
//             // else return true;
//         });
//         return connected;
//     } catch (err) {

//     }
//     //return boolean if project database already exists in mysql
//     // let connected = false;
//     // connection.changeUser({ database: 'cms_db' }, function(err) {
//     //     if (err) connected = false;
//     //     else connected = true;
//     // });
//     // return connected;

// };

// function buildDatabase() {

// };

///////////////////////////////////////////////////////////////////////


// login();

// connection.changeUser({ database: 'my_database' }, function(err) {
//     if (err) throw err;
// });