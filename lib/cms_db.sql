DROP DATABASE IF EXISTS cms_db;
CREATE DATABASE cms_db;
USE cms_db;

CREATE TABLE employee (
	id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    FOREIGN KEY (role_id) 
        REFERENCES role(id),
	FOREIGN KEY (manager_id) 
        REFERENCES employee(id),
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
    FOREIGN KEY (department_id) 
        REFERENCES department(id),
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
INSERT INTO role (title, salary, department_id) VALUES ("Junior Programmer", 50000.00,2);

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

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Bob", "Peckman", 1, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Hal", "Frommovie", 3, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Fred", "Hass", 2, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Nancy", "Drew", 4, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Clark", "Kent", 4, 3);

SELECT * FROM employee;

select * FROM department;

select * from role;

SELECT role.title as role, role.salary , department.name as department
FROM role
LEFT JOIN `department` 
ON role.department_id = department.id;

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
ORDER BY r.salary DESC;

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
     
SELECT e.id, r.salary,d.name, 
FROM employee e   
INNER JOIN role r
ON e.role_id = r.id
INNER JOIN department d
ON r.department_id = d.id         
GROUP BY d.name;     


