DROP DATABASE IF EXISTS cms_db;
CREATE DATABASE cms_db;
USE cms_db;

CREATE TABLE department (
	id INT NOT NULL AUTO_INCREMENT,
	name VARCHAR(30) NOT NULL,
	PRIMARY KEY (id)
);

CREATE TABLE role (
	id INT NOT NULL AUTO_INCREMENT,
	title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT NOT NULL,
    CONSTRAINT `fk_role_department`
    FOREIGN KEY (department_id) 
        REFERENCES department(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
	PRIMARY KEY (id)
);

CREATE TABLE employee (
	id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NULL,
    CONSTRAINT `fk_employee_role`
    FOREIGN KEY (role_id) 
        REFERENCES role(id)
        ON UPDATE CASCADE
        ON DELETE RESTRICT,
	CONSTRAINT `fk_employee_manager`
	FOREIGN KEY (manager_id) 
        REFERENCES employee(id)
        ON UPDATE CASCADE
        ON DELETE SET NULL,
    PRIMARY KEY (id)
);

INSERT INTO department (name) VALUES ("HR");
INSERT INTO department (name) VALUES ("IT");
INSERT INTO department (name) VALUES ("Finance");

INSERT INTO role (title, salary, department_id) VALUES ("HR Manager", 80000.00,1);
INSERT INTO role (title, salary, department_id) VALUES ("IT Manager", 80000.00,2);
INSERT INTO role (title, salary, department_id) VALUES ("CFO", 180000.00,3);
INSERT INTO role (title, salary, department_id) VALUES ("Online Rep", 45000.00,1);
INSERT INTO role (title, salary, department_id) VALUES ("Help Desk Analyst", 45000.00,2);
INSERT INTO role (title, salary, department_id) VALUES ("Junior Programmer", 60000.00,2);
INSERT INTO role (title, salary, department_id) VALUES ("Senior Programmer", 70000.00,2);
INSERT INTO role (title, salary, department_id) VALUES ("Accountant", 60000.00,3);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Bob", "Peckman", 1, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Hal", "Frommovie", 2, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Fred", "Hass", 3, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Nancy", "Drew", 4, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Clark", "Kent", 5, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Leslie", "Snead", 6, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Jerry", "Bergonzi", 7, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Linda", "Oh", 8, 3);

SELECT e.id, e.manager_id, d.name as dept
FROM employee AS e
INNER JOIN role as r
ON r.id = e.role_id
INNER JOIN department as d
ON r.department_id = d.id;


DELETE FROM role WHERE id = 1;
DELETE FROM department WHERE id = 1;
DELETE FROM employee WHERE id = 1;

UPDATE role SET salary = "82000.00" WHERE id = 2;

-- INSERT INTO department (name) VALUES ("Marketing");
-- INSERT INTO department (name) VALUES ("Finance");
-- INSERT INTO department (name) VALUES ("Operations");

-- INSERT INTO role (title, salary, department_id) VALUES ("CFO Chief Financial Officer", 120000.00,2);
-- INSERT INTO role (title, salary, department_id) VALUES ("Accounts Payable Accountant", 80000.00,2);
-- INSERT INTO role (title, salary, department_id) VALUES ("VP of Marketing", 120000.00,1);
-- INSERT INTO role (title, salary, department_id) VALUES ("Marketing Manager", 80000.00,1);
-- INSERT INTO role (title, salary, department_id) VALUES ("Operations Manager", 80000.00,3);
-- INSERT INTO role (title, salary, department_id) VALUES ("HR Manager", 80000.00,1);
-- INSERT INTO role (title, salary, department_id) VALUES ("IT Manager", 80000.00,2);
-- INSERT INTO role (title, salary, department_id) VALUES ("Hardware Tech", 50000.00,5);
-- INSERT INTO role (title, salary, department_id) VALUES ("Help Desk Analyst", 45000.00,5);
-- INSERT INTO role (title, salary, department_id) VALUES ("Network Administrator", 55000.00,5);
 -- INSERT INTO role (title, salary, department_id) VALUES ("Project Manager", 60000.00,2);
--  INSERT INTO role (title, salary, department_id) VALUES ("Project Manager", 60000.00,3);
-- INSERT INTO role (title, salary, department_id) VALUES ("Systems Engineering Manager", 65000.00,5);
-- INSERT INTO role (title, salary, department_id) VALUES ("CIO", 80000.00,5);

select * FROM department;

SELECT * FROM role;

SELECT * FROM employee;

UPDATE employee SET role_id = 4, manager_id = null WHERE id = 6;

SELECT role.id, role.title as role, role.salary , department.name as department
FROM role
LEFT JOIN `department` 
ON role.department_id = department.id
ORDER BY department, salary DESC;

-- view employee info
SELECT e.id,concat(e.first_name, ' ', e.last_name) as employee,
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
ORDER BY d.name, r.salary DESC;

-- view employee by manager
SELECT e.id, concat(e.first_name, ' ', e.last_name) as employee, 
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
     
SELECT e.id, r.salary, d.name
FROM employee e   
INNER JOIN role r
ON e.role_id = r.id
INNER JOIN department d
ON r.department_id = d.id
WHERE d.name = "IT";         
-- GROUP BY d.name;     


