const inquirer = require("inquirer");
const cTable = require("console.table");
const mysql = require("mysql");
const validator = require("validator");

let connection;

function login() {
    const questions = [{
            type: 'input',
            name: 'username',
            message: 'username:',
            validate: function(value) {
                var valid = !validator.isEmpty(value);
                return valid || 'username can not be empty.';
            }
        },
        {
            type: 'password',
            message: 'password:',
            name: 'password',
            mask: '*',
            validate: function(value) {
                var valid = !validator.isEmpty(value);
                return valid || 'password can not be empty.';
            }
        }
    ];
    inquirer.prompt(questions).then(answers => {
        console.log(answers.username, answers.password);
        let { username: user, password } = answers;
        connectUser(user, password);
    });
};

function connectUser(user, password) {
    connection = mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: user,
        password: password,
    });
    connection.connect(function(err) {
        if (err) throw err;
        console.log("connected as id " + connection.threadId + "\n");
        if (databaseExists()) {
            //inquireModifyDatabase();
            start();
        } else {
            buildDatabase();
        }
    });
};

function databaseExists() {
    //return boolean if project database already exists in mysql
    connection.changeUser({ database: 'cms_db' }, function(err) {
        if (err) return false;
    });

};

function buildDatabase() {

};

function start() {
    let msg = `
    ADD - add departments, roles, and employees.
    VIEW - view departments, roles, employees, employees by manager, and utilized budget by department.
    UPDATE - update employee roles and employee managers.`;
    const questions = [{
        type: 'list',
        name: 'action',
        message: msg,
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

function add() {
    let msg = `ADD - departments, roles, and employees.`;
    const questions = [{
        type: 'list',
        name: 'action',
        message: msg,
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

function view() {
    let msg = `VIEW - departments, roles, employees, employees by manager, and utilized budget by department.`;
    const questions = [{
        type: 'list',
        name: 'action',
        message: msg,
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

///////////////////////////////////////////////////////////////////////


login();

// connection.changeUser({ database: 'my_database' }, function(err) {
//     if (err) throw err;
// });