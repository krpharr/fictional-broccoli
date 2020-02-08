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
    let msg = "ADD - add departments, roles, and employees.\n";
    msg += "VIEW - view departments, roles, employees, employees by manager, and utilized budget by department.\n";
    msg += "UPDATE - update employee roles and employee managers.";
    const questions = [{
        type: 'list',
        name: 'action',
        message: msg,
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
    // let msg = `ADD - departments, roles, and employees.`;
    // console.log(msg);
    const questions = [{
        type: 'list',
        name: 'action',
        message: 'ADD:',
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
    dbhelper.selectAll("department", inquireAddDepartment);
};

function inquireAddDepartment(tbl) {

    let tb = cTable.getTable(tbl);
    console.log("\nCurrent Departments\n")
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
        connection.query(
            "INSERT INTO department (name) VALUES (?)", [answers.name],
            function(err, res) {
                if (err) throw err;
                console.log(`\n${answers.name} sucessfully added to database.\n`);
                start();
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
    console.log("\n");
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
        connection.query(
            "INSERT INTO role (title, salary, department_id) VALUES (?,?,?)", [answers.title, answers.salary, tbl[i].id],
            function(err, res) {
                if (err) throw err;
                console.log(`\n${answers.title} role sucessfully added to ${answers.dept} department.\n`);
                start();
            }
        );
    });
};

function addEmployee() {
    dbhelper.selectAll("department", inquireDepartmentForEmployee);
};

function inquireDepartmentForEmployee(deptTable) {
    dbhelper.displayTable(deptTable);
    const depts = deptTable.map(e => {
        return e.name;
    });
    const questions = [{
        type: 'list',
        name: 'department',
        message: 'Choose department for new employee.',
        choices: depts,
    }];
    inquirer.prompt(questions).then(answers => {
        let i = depts.findIndex(obj => obj === answers.department);
        let deptID = deptTable[i].id;
        let query = `SELECT role.id as id, role.title as title, role.salary , department.name as department
        FROM role
        LEFT JOIN department 
        ON role.department_id = department.id
        WHERE role.department_id = ${deptID}
        ORDER BY role.salary DESC;`;
        //let query = `SELECT * FROM role WHERE department_id = (${deptID})`;
        dbhelper.query(query, res => {
            dbhelper.displayTable(res);
            const roles = res.map(e => {
                return `${e.id} ${e.title} ${e.department}`;
            });
            const questions2 = [{
                type: 'list',
                name: 'title',
                message: 'Choose title for new employee.',
                choices: roles,
            }];
            inquirer.prompt(questions2).then(ans => {
                let i = roles.findIndex(obj => obj === ans.title);
                let roleID = res[i].id;
                //inquireManager(deptID, roleID); 
                inquireEmployeeData(roleID, null);
            });
        });
    });
};

function inquireManager(deptID, roleID) {
    // get employee id, manager_id, and department and filter out managers for desired deptarment
    let query = `SELECT e.id, e.first_name, e.last_name, e.manager_id, r.title, d.name as dept, d.id as dept_id
    FROM employee AS e
    INNER JOIN role as r
    ON r.id = e.role_id
    INNER JOIN department as d
    ON r.department_id = d.id;`;
    dbhelper.query(query, res => {
        dbhelper.displayTable(res);
        const managers = res.filter(obj => obj.manager_id === null && obj.dept_id === deptID);
        if (managers.length === 0) inquireEmployeeData(roleID, null);
        const choicesArray = managers.map(obj => {
            return `${obj.first_name} ${obj.last_name}`;
        });
        choicesArray.push("SKIP");
        // console.log(managers);
        // console.log(choices);
        const questions = [{
            type: 'list',
            name: 'manager',
            message: 'Choose manager for new employee.',
            choices: choicesArray,
        }];
        inquirer.prompt(questions).then(ans => {
            if (ans.manager === "SKIP") {
                inquireEmployeeData(roleID, null);
            } else {
                let i = choicesArray.findIndex(obj => obj === ans.manager);
                let managerID = managers[i].id;
                inquireEmployeeData(roleID, managerID);
            }
        });
    });
};

function inquireEmployeeData(roleID, managerID) {
    const questions = [{
            type: 'input',
            name: 'first_name',
            message: "Enter new employee's first name.",
            validate: function(value) {
                var valid = !validator.isEmpty(value);
                return valid || 'First name can not be empty.';
            }
        },
        {
            type: 'input',
            name: 'last_name',
            message: "Enter new employee's last name.",
            validate: function(value) {
                var valid = !validator.isEmpty(value);
                return valid || 'Last name can not be empty.';
            }
        }
    ];
    inquirer.prompt(questions).then(answers => {
        let { first_name, last_name } = answers;
        connection.query(
            "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)", [answers.first_name, answers.last_name, roleID, managerID],
            function(err, res) {
                if (err) throw err;
                console.log(`\n${answers.first_name} ${answers.last_name} sucessfully added as new employee.\nSet employee's managager by UPDATE -> Employee Manager.\n`);
                start();
            }
        );
    });
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
    dbhelper.selectAll("department", res => {
        dbhelper.displayTable(res);
        start();
    });
};

function viewRoles() {
    let query = `SELECT role.id, role.title as role, role.salary , department.name as department
FROM role
LEFT JOIN department
ON role.department_id = department.id
ORDER BY department, salary DESC`;

    dbhelper.query(query, res => {
        dbhelper.displayTable(res);
        start();
    });

    // dbhelper.innerLeftJoin("role", "department",
    //     "role.title as role, role.salary , department.name as department",
    //     "role.department_id = department.id", res => {
    //         dbhelper.displayTable(res);
    //         start();
    //     });
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
ORDER BY d.name, r.salary DESC;`;

    dbhelper.query(query, res => {
        dbhelper.displayTable(res);
        start();
    });

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
ORDER BY e.manager_id, r.salary DESC;
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
    WHERE d.name = "${answers.action}";`;
        dbhelper.query(query, calcBudget);
    });

};

function calcBudget(table) {
    let dept = table[0].name;
    let bArray = table.map(e => {
        return e.salary;
    });
    let budget = bArray.reduce((total, num) => {
        return total + num;
    });

    let budgetTable = [{
        department: dept,
        "utilized budget": budget
    }];
    dbhelper.displayTable(budgetTable);
    start();

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

function selectEmployee(callback) {
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
ORDER BY department, r.salary DESC;`;

    dbhelper.query(query, res => {
        dbhelper.displayTable(res);
        const choicesArray = res.map(obj => {
            return `${obj.employee} ${obj.department} ${obj.title}`;
        });
        choicesArray.push("CANCEL");
        const questions = [{
            type: 'list',
            name: 'employee',
            message: "Pick employee:",
            choices: choicesArray,
        }];
        inquirer.prompt(questions).then(answers => {
            if (answers.employee === "CANCEL") {
                start();
            } else {
                let i = choicesArray.findIndex(obj => obj === answers.employee);
                const employeeID = res[i].id;
                callback(employeeID);
            }
        });
    });
};

function selectManager(callback) {
    let query = `SELECT e.id,concat(e.first_name, ' ', e.last_name) as employee,
    d.name as department,
    r.title as title,r.salary, 
    concat(m.first_name, ' ', m.last_name) as manager
FROM employee e 
INNER JOIN role r
 ON e.role_id=r.id
INNER JOIN department d
 ON r.department_id = d.id
LEFT OUTER JOIN employee m
 ON e.manager_id = m.id
ORDER BY r.salary DESC;`;

    dbhelper.query(query, res => {
        dbhelper.displayTable(res);
        const choicesArray = res.map(obj => {
            return `${obj.employee} ${obj.department} ${obj.title}`;
        });
        choicesArray.push("CANCEL");
        const questions = [{
            type: 'list',
            name: 'manager',
            message: "Pick manager:",
            choices: choicesArray,
        }];
        inquirer.prompt(questions).then(answers => {
            if (answers.employee === "CANCEL") {
                start();
            } else {
                let i = choicesArray.findIndex(obj => obj === answers.manager);
                const managerID = res[i].id;
                callback(managerID);
            };
        });
    });
};

function selectRole(callback) {
    let query = `SELECT role.id, role.title as role, role.salary , department.name as department
    FROM role
    LEFT JOIN department 
    ON role.department_id = department.id
    ORDER BY department, role.salary DESC;`;
    dbhelper.query(query, res => {
        dbhelper.displayTable(res);
        const rolesArray = res.map(obj => {
            return `${obj.role} salary: ${obj.salary} dept: ${obj.department}`;
        });
        rolesArray.push("CANCEL");
        const questions = [{
            type: 'list',
            name: 'role',
            message: "Pick role:",
            choices: rolesArray,
        }];
        inquirer.prompt(questions).then(answers => {
            if (answers.role === "CANCEL") {
                start();
            } else {
                let i = rolesArray.findIndex(obj => obj === answers.role);
                const roleID = res[i].id;
                callback(roleID);
            };
        });
    });
};

function selectDepartment(callback) {
    dbhelper.selectAll("department", res => {
        dbhelper.displayTable(res);
        const departmentArray = res.map(obj => {
            return obj.name;
        });
        departmentArray.push("CANCEL");
        const questions = [{
            type: 'list',
            name: 'department',
            message: "Pick department:",
            choices: departmentArray,
        }];
        inquirer.prompt(questions).then(answers => {
            if (answers.department === "CANCEL") {
                start();
            } else {
                let i = departmentArray.findIndex(obj => obj === answers.department);
                const departmentID = res[i].id;
                callback(departmentID);
            };
        });
    });
};

function updateEmployeeRole() {
    selectEmployee(eID => {
        selectRole(rID => {
            let query = `UPDATE employee SET role_id = ${rID}, manager_id = null WHERE id = ${eID}`;
            dbhelper.query(query, res => {
                console.log("\nEmployee role updated.\n");
                start();
            });
        });
    });
};

function updateEmployeeManager() {
    // pick employee
    selectEmployee(eID => {
        selectManager(mID => {
            let query = `UPDATE employee SET manager_id = ${mID} WHERE id = ${eID}`;
            dbhelper.query(query, res => {
                console.log("\nEmployee role updated.\n");
                start();
            });
        });
    });
};


function remove() {
    const questions = [{
        type: 'list',
        name: 'action',
        message: 'Delete',
        choices: [
            'Employee',
            'Role',
            'Department',
            '<- Back'
        ],
    }];
    inquirer.prompt(questions).then(answers => {
        switch (answers.action) {
            case 'Employee':
                deleteEmployee();
                break;
            case 'Role':
                deleteRole();
                break;
            case 'Department':
                deleteDepartment();
                break;
            case '<- Back':
                start();
                break;
        }
    });
};

function deleteEmployee() {
    selectEmployee(eID => {
        let query = `DELETE FROM employee WHERE id = ${eID};`;
        dbhelper.query(query, res => {
            console.log("\nEmployee removed.\n");
            start();
        });
    });
};

function deleteRole() {
    selectRole(rID => {
        let query = `DELETE FROM role WHERE id = ${rID};`;
        dbhelper.query(query, res => {
            if (res.length < 1) {
                console.log("\nRole has employees associated with it and can not be deleted until employee is removed.\n")
            } else {
                console.log("\nRole deleted.\n");
            }
            start();
        });
    });

};

function deleteDepartment() {
    selectDepartment(dID => {
        let query = `DELETE FROM department WHERE id = ${dID};`;
        dbhelper.query(query, res => {
            if (res.length < 1) {
                console.log("\nDepartment has roles associated with it and can not be deleted until roles are removed.\n")
            } else {
                console.log("\nDepartment deleted.\n");
            }
            start();
        });
    });
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