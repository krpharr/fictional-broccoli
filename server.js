const inquirer = require("inquirer");
const cTable = require("console.table");
const mysql = require("mysql");
const validator = require("validator");
const DbHelper = require("./lib/DbHelper");

let dbhelper;

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "9EBu6swH",
    database: 'cms_db'
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    dbhelper = new DbHelper(connection);
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
            'UPDATE',
            'DELETE',
            'QUIT'
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
            case 'DELETE':
                remove();
                break;
            case 'QUIT':
                connection.end();
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

function addDepartment() {
    dbhelper.selectAll("department", inquireDepartment);
};

function inquireDepartment(tbl) {
    let tb = cTable.getTable(tbl);
    console.log("Current Departments")
    console.log(tb);
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
    // query departments and id's for role department choices
    dbhelper.selectAll("department", inquireRole);
};

function inquireRole(tbl) {
    let tb = cTable.getTable(tbl);
    console.log(tb);

    const choices = tbl.map(e => {
        return e.name;
    });

    const questions = [{
            type: 'input',
            name: 'title',
            message: 'Enter title for new role.',
            validate: function(value) {
                var valid = !validator.isEmpty(value);
                return valid || 'Role title can not be empty.';
            }
        },
        {
            type: 'input',
            name: 'salary',
            message: 'Salary:',
            validate: function(value) {
                if (validator.isEmpty(value)) return "Salary can not be empty.";
                var valid = validator.isDecimal(value);
                return valid || 'must be a valid year';
            }
        },
        {
            type: 'list',
            name: 'dept',
            message: 'Select department for role.',
            choices: choices
        }
    ];
    inquirer.prompt(questions).then(answers => {
        // console.log(answers.title);
        let i = tbl.findIndex(obj => obj.name === answers.dept);
        console.log(i, tbl[i]);

        connection.query(
            "INSERT INTO role (title, salary, department_id) VALUES (?,?,?)", [answers.title, answers.salary, tbl[i].id],
            function(err, res) {
                if (err) throw err;
                console.log(`${answers.title} role sucessfully added to ${answers.dept} department.`);
                add();
            }
        );
    });
}

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
            'Departments',
            'Roles',
            'Employees',
            'Employees by manager.',
            'Utilized budget by department.',
            '<- Back'
        ],
    }];
    inquirer.prompt(questions).then(answers => {
        switch (answers.action) {
            case 'Departments':
                viewDepartments();
                break;
            case 'Roles':
                viewRoles();
                break;
            case 'Employees':
                viewEmployees();
                break;
            case 'Employees by manager.':
                viewEmployeesByManager();
                break;
            case 'Utilized budget by department.':
                viewUtilizedBudgetByDepartment();
                break;
            case '<- Back':
                start();
                break;
        }
    });
};

function viewDepartments() {
    dbhelper.selectAll("department", dbhelper.displayTable);
};

function viewRoles() {
    dbhelper.innerLeftJoin("role", "department",
        "role.title as role, role.salary , department.name as department",
        "role.department_id = department.id", dbhelper.displayTable);
};

function viewEmployees() {
    let query = `SELECT e.id,concat(e.first_name, ' ', e.last_name) as employee,
    d.name as department,
    r.title,r.salary, 
    concat(m.first_name, ' ', m.last_name) as manager
FROM employee e 
INNER JOIN role r
 ON e.role_id=r.id
INNER JOIN department d
 ON r.department_id = d.id
LEFT OUTER JOIN employee m
 ON e.manager_id = m.id
ORDER BY r.salary DESC;`;

    dbhelper.query(query, dbhelper.displayTable);

};

function viewEmployeesByManager() {
    let query = `SELECT e.id, concat(e.first_name, ' ', e.last_name) as employee, 
d.name as department,
r.title,r.salary, 
concat(m.first_name, ' ', m.last_name) as manager
FROM employee e
INNER JOIN role r
ON e.role_id=r.id
INNER JOIN department d
ON r.department_id = d.id
INNER JOIN employee m
ON e.manager_id = m.id
ORDER BY e.manager_id;
 `;
    dbhelper.query(query, inquireEmployeesByManager);
};

function inquireEmployeesByManager(table) {
    let last = '';
    const managers = [];
    table.forEach((e, i) => {
        if (e.manager !== last) {
            last = e.manager;
            managers.push(e.manager);
        }
    });
    const questions = [{
        type: 'list',
        name: 'action',
        message: 'Select manager:',
        choices: managers,
    }];
    inquirer.prompt(questions).then(answers => {
        let rows = table.filter(e => {
            return e.manager === answers.action;
        });
        dbhelper.displayTable(rows);
        start();
    });
};

function viewUtilizedBudgetByDepartment() {
    dbhelper.selectAll("department", inquireDepartment);
};

function inquireDepartment(table) {
    /////inquirer code
    let last = '';
    const departments = [];
    table.forEach((e, i) => {
        if (e.name !== last) {
            last = e.name;
            departments.push(e.name);
        }
    });
    const questions = [{
        type: 'list',
        name: 'action',
        message: 'Select department:',
        choices: departments,
    }];
    inquirer.prompt(questions).then(answers => {
        let rows = table.filter(e => {
            return e.name === answers.action;
        });

        let action = answers.action;
        let query = `SELECT e.id, r.salary, d.name
    FROM employee e   
    INNER JOIN role r
    ON e.role_id = r.id
    INNER JOIN department d
    ON r.department_id = d.id
    WHERE d.name = "${action}";`;
        dbhelper.query(query, calcBudget);
    });

};

function calcBudget(table) {
    console.log(table);
    let bArray = table.map(e => {
        return e.salary;
    });
    console.log(bArray);
    let budget = bArray.reduce((total, num) => {
        return total + num;
    });
    console.log(budget);
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

function remove() {

};

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