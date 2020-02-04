DROP DATABASE IF EXISTS cms_db;
CREATE DATABASE cms_db;
USE cms_db;

CREATE TABLE employee (
	id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    PRIMARY KEY (id)
);

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
	PRIMARY KEY (id)
);

-- INSERT INTO department (name) VALUES ("Marketing");
-- INSERT INTO department (name) VALUES ("Finance");
-- INSERT INTO department (name) VALUES ("Operations");
INSERT INTO department (name) VALUES ("HR");
INSERT INTO department (name) VALUES ("IT");

INSERT INTO role (title, salary, department_id) VALUES ("HR Manager", 80000.00,1);
INSERT INTO role (title, salary, department_id) VALUES ("IT Manager", 80000.00,2);
INSERT INTO role (title, salary, department_id) VALUES ("Help Desk Analyst", 45000.00,2);

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
-- INSERT INTO role (title, salary, department_id) VALUES ("Project Manager", 60000.00,5);
-- INSERT INTO role (title, salary, department_id) VALUES ("Systems Engineering Manager", 65000.00,5);
-- INSERT INTO role (title, salary, department_id) VALUES ("CIO", 80000.00,5);

SELECT * FROM role;

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Bob", "Control", 1, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Hal", "Computer", 3, 1);

SELECT * FROM employee;

select * FROM department;

select * from role;

SELECT role.title as role, role.salary , department.name as department
FROM role
LEFT JOIN `department` 
ON role.department_id = department.id;

select first_name, last_name, name, title, salary, manager_id
from employee as e, department as d, role as r
where d.id = r.department_id and e.role_id = r.id;

select e.first_name, e.last_name, d.name, r.title, r.salary, m.last_name as manager
from employee as e, department as d, role as r, employee as m
where d.id = r.department_id and e.role_id = r.id and m.id = e.manager_id;




