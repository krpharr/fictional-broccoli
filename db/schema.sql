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