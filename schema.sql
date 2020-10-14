DROP DATABASE IF EXISTS acme_corpDB;
CREATE database acme_corpDB;

USE acme_corpDB;

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
  PRIMARY KEY (id),
  FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT,
  PRIMARY KEY (id),
  FOREIGN KEY (manager_id) REFERENCES employee(id),
  FOREIGN KEY (role_id) REFERENCES role(id)
);

INSERT INTO department (name) VALUES ("HR"),("Finance"),("Sales");
INSERT INTO role (title,salary,department_id) VALUES ("Account Executive",45000,3),("HR Coordinator",35000,1);
INSERT INTO employee (first_name,last_name,role_id) VALUES ("Susan","Doe",1),("John","Smith",2);
