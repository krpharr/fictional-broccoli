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
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Hal", "Lett", 2, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Fred", "Hass", 3, NULL);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Nancy", "Drew", 4, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Clair", "Kent", 5, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Leslie", "Gourdet", 6, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Jerry", "Bergonzi", 7, 2);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Linda", "Oh", 8, 3);