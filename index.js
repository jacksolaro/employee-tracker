var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "acme_corpDB"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;

    console.log("=================================")
    console.log('||     WELCOME TO ACME CORP    ||');
    console.log("=================================")

    // run the start function after the connection is made to prompt the user
    start();
});


// Start Function / Prompt Input
function start() {

    // Prompt the user for their choice
    inquirer
        .prompt({
            name: "choice",
            type: "rawlist",
            message: "What would you like to do?",
            choices: ["Add Department", "Add Employee", "Add Role", "View Departments", "View Employees", "View Roles", "Update Employee Role", "Update Employee Manager", "EXIT"],
            loop: false
        })
        .then(function (answer) {
            // based on answer above, run function to retrive what user is looking for
            switch (answer.choice) {
                case "Add Department":
                    //   Call Add Department Function
                    addDepartment();
                    break;
                case "Add Employee":
                    //   Call Add Employee Function
                    addEmployee();
                    break;
                case "Add Role":
                    //   Call Add Role Function
                    addRole();
                    break;
                case "View Departments":
                    //   Console logs a table of all departments
                    getDepartments();
                    break;
                case "View Employees":
                    //   Console logs a table of all Employees
                    getEmployees();
                    break;
                case "View Roles":
                    //   Console logs a table of all roles
                    getRoles();
                    break;
                case "Update Employee Role":
                    //   Prompts the user for input to update an Employee's role
                    updateEmployeeRole();
                    break;
                case "Update Employee Manager":
                    //   Prompts the user for input to update an Employee's manager
                    updateEmployeeManager();
                    break;
                case "EXIT":
                    //   Exit Application
                    connection.end();
            }
        }).catch(error => {
            if (error) {
                console.log(error)
            }
        });
}

// ========================================================
// ADD METHODS
// ========================================================

// Add new Department to department table
function addDepartment() {
    // prompt for what to name the department
    inquirer
        .prompt([
            {
                name: "name",
                type: "input",
                message: "What is the name of the department?",
            }
        ])
        .then(function (answer) {
            // when finished prompting, add the new department into the department table in the database
            connection.query(`INSERT INTO department (name) VALUES (?)`, [answer.name], function (err, data) {
                if (err) {
                    throw err;
                } else {
                    getDepartments();
                    console.log("SUCCESS: Your Department has been added.")
                }
            })
        })
}

// Add a new role to the role table
function addRole() {
    // Retrieve existing department data from department table in database
    connection.query(`SELECT * FROM department`, function (err, data) {
        if (err) throw err;

        // Create an array to store currect departments
        let departmentArr = data.map(function (dep) {
            return {
                name: dep.name,
                value: dep.id
            }
        })
        // prompt for info on the new role to add
        inquirer
            .prompt([
                {
                    name: "title",
                    type: "input",
                    message: "What is the title of the Role?",
                },
                {
                    name: "salary",
                    type: "number",
                    message: "What is the salary of the Role?",
                },
                {
                    name: "department_id",
                    type: "list",
                    message: "Which department is this role in?",
                    choices: departmentArr
                }
            ])
            .then(function (answer) {
                // when finished prompting, add new role into the role table in the database
                connection.query(`INSERT INTO role (title,salary,department_id) VALUES (?,?,?)`, [answer.title, answer.salary, answer.department_id], function (err, data) {
                    if (err) {
                        throw err;
                    } else {
                        getRoles();
                        console.log("SUCCESS: Your Role has been added.")
                    }
                })
            })
    })
}

// Add a new employee to the employee table
function addEmployee() {

    // Retrieve existing role data from the database
    connection.query(`SELECT * FROM role`, function (err, data) {
        if (err) throw err;

        // Create a new array to store the role data
        let rolesArr = data.map(function (role) {
            return {
                name: role.title,
                value: role.id
            }
        })

        // Retrieve existing employee data from the database to use as manager options
        connection.query(`SELECT * FROM employee`, function (err, data) {
            if (err) throw err;

            // Create a new array to store the manager data
            let managerArr = data.map(function (employee) {
                return {
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.id
                }
            })

            // Add None/Null as an option to the manager array
            managerArr.unshift({ name: "None", value: null });

            // prompt for info on new employee to add
            inquirer
                .prompt([
                    {
                        name: "first_name",
                        type: "input",
                        message: "What is employee's FIRST NAME?",
                    },
                    {
                        name: "last_name",
                        type: "input",
                        message: "What is the employee's LAST NAME?",
                    },
                    {
                        name: "role_id",
                        type: "list",
                        message: "Which role is this employee in?",
                        choices: rolesArr
                    },
                    {
                        name: "manager_id",
                        type: "list",
                        message: "Who is this employee's manager?",
                        choices: managerArr
                    }
                ])
                .then(function (answer) {
                    // when finished prompting, add employee to the employee table
                    connection.query(`INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES (?,?,?,?)`, [answer.first_name, answer.last_name, answer.role_id, answer.manager_id], function (err, data) {
                        if (err) {
                            throw err;
                        } else {
                            getEmployees();
                            console.log("SUCCESS: Your Employee has been added.")
                        }
                    })
                })
        })
    })
}

// ========================================================
// VIEW METHODS
// ========================================================

// Console logs All Departments in department table
function getDepartments() {
    // Retrieve department data from department table
    connection.query(`SELECT * FROM department`, function (err, data) {
        if (err) {
            throw err;
        } else {
            console.table(data);
            start();
        }
    })
}

// Console logs All Employees with data joined from department and role tables
function getEmployees() {
    connection.query(`SELECT employee.id AS "Employee ID",CONCAT(employee.first_name,' ',employee.last_name) AS "Employee Name",role.title AS "Employee Title",department.name AS "Employee Department", CONCAT(manager.first_name,' ',manager.last_name) AS "Manager" 
    FROM employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN employee manager ON employee.manager_id = manager.id
    LEFT JOIN department ON role.department_id = department.id`, function (err, data) {
        if (err) {
            throw err;
        } else {
            console.table(data);
            start();
        }
    })
}

// Console logs All roles with data joined from department tables
function getRoles() {
    connection.query(`SELECT role.id AS "Role ID",role.title AS "Job Title",role.salary,department.name AS "Department" 
    FROM role
    LEFT JOIN department ON role.department_id = department.id`, function (err, data) {
        if (err) {
            throw err;
        } else {
            console.table(data);
            start();
        }
    })
}

// ========================================================
// UPDATE METHODS
// ========================================================

// Update Employees Role
function updateEmployeeRole() {

    connection.query(`SELECT * FROM employee`, function (err, data) {
        // If error, throw error
        if (err) throw err;

        // Create an array to hold the employee options
        let employeeArr = data.map(function (employee) {
            return {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id
            }
        })

        connection.query(`SELECT * FROM role`, function (err, data) {
            // Create an Array to hold the potential roles
            let roleArr = data.map(function (role) {
                return {
                    name: role.title,
                    value: role.id
                }
            })

            // prompt for info about which employee's role to update
            inquirer
                .prompt([
                    {
                        name: "employee",
                        type: "list",
                        message: "Which employee would you like to update?",
                        choices: employeeArr
                    },
                    {
                        name: "role",
                        type: "list",
                        message: "Which role would you like to assign to this employee?",
                        choices: roleArr
                    }
                ])
                .then(function (answer) {
                    // SQL update the manager for selected employee
                    connection.query(`UPDATE employee SET role_id = ? WHERE id = ?`, [answer.role, answer.employee], function (err, data) {
                        if (err) {
                            // If Error, throw error
                            throw err;
                        } else {
                            // Display List of all Employees
                            getEmployees();
                            // Console Log Success
                            console.log("SUCCESS: Your Employee's role has been updated.")
                        }
                    })
                })
        })
    })
}

// Update Employees Role
function updateEmployeeManager() {

    connection.query(`SELECT * FROM employee`, function (err, data) {
        // If error, throw error
        if (err) throw err;

        // Create an array to hold the employee options
        let employeeArr = data.map(function (employee) {
            return {
                name: `${employee.first_name} ${employee.last_name}`,
                value: employee.id
            }
        })

        // Create an Array to hold the potential managers
        let managerArr = data.map(function (manager) {
            return {
                name: `${manager.first_name} ${manager.last_name}`,
                value: manager.id
            }
        })

        // Add None/Null as an option to the manager array
        managerArr.unshift({ name: "None", value: null });

        // prompt for info about which employee's manager to update
        inquirer
            .prompt([
                {
                    name: "employee",
                    type: "list",
                    message: "Which employee would you like to update?",
                    choices: employeeArr
                },
                {
                    name: "manager",
                    type: "list",
                    message: "Which manager would you like to assign to this employee?",
                    choices: managerArr
                }
            ])
            .then(function (answer) {
                // SQL update the manager for selected employee
                connection.query(`UPDATE employee SET manager_id = ? WHERE id = ?`, [answer.manager, answer.employee], function (err, data) {
                    if (err) {
                        // If Error, throw error
                        throw err;
                    } else {
                        // Display List of all Employees
                        getEmployees();
                        // Console Log Success
                        console.log("SUCCESS: Your Employee's manager has been updated.")
                    }
                })
            })
    })
}
