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
    // run the start function after the connection is made to prompt the user
    start();
});


// Start Function / Prompt Input
function start() {
    inquirer
        .prompt({
            name: "choice",
            type: "rawlist",
            message: "What would you like to do?",
            choices: ["Add Department", "Add Employee", "Add Role", "View Departments", "View Employees", "View Roles", "Update Employee Role","Update Employee Manager", "EXIT"],
            loop: false
        })
        .then(function (answer) {
            // based on answer above, run function to retrive what user is looking for
            switch (answer.choice) {
                case "Add Department":
                    //   Call Add Function
                    addDepartment();
                    break;
                case "Add Employee":
                    //   Call View Function
                    addEmployee();
                    break;
                case "Add Role":
                    //   Call Update Function
                    addRole();
                    break;
                case "View Departments":
                    //   Returns a table of all departments
                    getDepartments();
                    break;
                case "View Employees":
                    //   Returns a table of all Employees
                    getEmployees();
                    break;
                case "View Roles":
                    //   Returns a table of all roles
                    getRoles();
                    break;
                case "Update Employee Role":
                    //   Returns a table of all roles
                    getRoles();
                    break;
                case "Update Employee Manager":
                    //   Returns a table of all roles
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

// Add Department to Database
function addDepartment() {
    // prompt for info about which song to look up
    inquirer
        .prompt([
            {
                name: "name",
                type: "input",
                message: "What is the name of the department?",
            }
        ])
        .then(function (answer) {
            // when finished prompting, return songs that match that song title
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

function addRole() {
    connection.query(`SELECT * FROM department`, function (err, data) {
        if (err) throw err;

        let departmentArr = data.map(function (dep) {
            return {
                name: dep.name,
                value: dep.id
            }
        })
        // prompt for info about which song to look up
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
                // when finished prompting, return songs that match that song title
                connection.query(`INSERT INTO role (title,salary,department_id) VALUES (?,?,?)`, [answer.title,answer.salary,answer.department_id], function (err, data) {
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

function addEmployee() {

    connection.query(`SELECT * FROM role`, function (err, data) {
        if (err) throw err;

        let rolesArr = data.map(function (role) {
            return {
                name: role.title,
                value: role.id
            }
        })

        connection.query(`SELECT * FROM employee`, function (err, data) {
            if (err) throw err;
    
            let employeeArr = data.map(function (employee) {
                return {
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.id
                }
            })

        // prompt for info about which song to look up
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
                    choices: employeeArr
                }
            ])
            .then(function (answer) {
                // when finished prompting, return songs that match that song title
                connection.query(`INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES (?,?,?,?)`, [answer.first_name,answer.last_name,answer.role_id,answer.manager_id], function (err, data) {
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

// View All Departments
function getDepartments() {
    connection.query(`SELECT * FROM department`, function (err, data) {
        if (err) {
            throw err;
        } else {
            console.table(data);
            start();
        }
    })
}

// View All Employees
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

// View All Roles
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
        managerArr.unshift({name:"None",value:null});

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
                connection.query(`UPDATE employee SET manager_id = ? WHERE id = ?`, [answer.manager,answer.employee], function (err, data) {
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




// COPY PASTED CODE V

// function which prompts the user for what action they would like to take


// function to search by song title
// function searchBySong() {
//     // prompt for info about which song to look up
//     inquirer
//         .prompt([
//             {
//                 name: "songTitle",
//                 type: "input",
//                 message: "What song would you like to search for?"
//             }
//         ])
//         .then(function (answer) {
//             // when finished prompting, return songs that match that song title
//             connection.query(`SELECT * FROM top5000 WHERE song = ?`, [answer.songTitle], function (err, data) {
//                 if (err) {
//                     throw err;
//                 } else {
//                     console.table(data);
//                     start();
//                 }
//             })
//         })
// }

// // function to search by artist
// function searchByArtist() {
//     // prompt for info about which artist to look up
//     inquirer
//         .prompt([
//             {
//                 name: "artist",
//                 type: "input",
//                 message: "What artist would you like to search for?"
//             }
//         ])
//         .then(function (answer) {
//             // when finished prompting, return songs by that artist
//             connection.query(`SELECT * FROM top5000 WHERE artist = ?`, [answer.artist], function (err, data) {
//                 if (err) {
//                     throw err;
//                 } else {
//                     console.table(data);
//                     start();
//                 }
//             })
//         })
// }

// // returns artists that have more than one song
// function searchByDuplicateArtist() {
//     // Return artists that have more than one song
//     connection.query(`SELECT artist FROM top5000 GROUP BY artist HAVING count(artist) > 1`, function (err, data) {
//         if (err) {
//             throw err;
//         } else {
//             console.table(data);
//             start();
//         }
//     })
// }


// // function to search by year range
// function searchByYear() {
//     // prompt for info about which year range look up
//     inquirer
//         .prompt([
//             {
//                 name: "year_min",
//                 type: "input",
//                 message: "What is the minimum year?"
//             },
//             {
//                 name: "year_max",
//                 type: "input",
//                 message: "What is the maximum year?"
//             }
//         ])
//         .then(function (answer) {
//             connection.query(`SELECT * FROM top5000 WHERE year > ? and year < ?`, [answer.year_min,answer.year_max], function (err, data) {
//                 if (err) {
//                     throw err;
//                 } else {
//                     console.table(data);
//                     start();
//                 }
//             })
//         })
// }

// // function to search by song title
// function searchByTop() {
//     // prompt for info about which song to look up
//     inquirer
//         .prompt([
//             {
//                 name: "whichTop",
//                 type: "list",
//                 message: "Which top do you want to search by?",
//                 choices: 
//                 [     
//                     {value: 'raw_total', name: "TOTAL TOP"},
//                     {value: 'raw_us', name: "TOP US"},
//                     {value: 'raw_uk', name: "TOP UK"},
//                     {value: 'raw_eur', name: "TOP EUROPE"}
//                 ]
//             },
//             {
//                 name: "numTop",
//                 type: "input",
//                 message: "How many top results?",
//             }
//         ])
//         .then(function (answer) {
//             // when finished prompting, return songs that match that song title
//             connection.query(`SELECT song,artist,${answer.whichTop} FROM top5000 ORDER BY ${answer.whichTop} DESC LIMIT ?`, [parseInt(answer.numTop)], function (err, data) {
//                 if (err) {
//                     throw err;
//                 } else {
//                     console.table(data);
//                     start();
//                 }
//             })
//         })
// }

// // function to search by song title
// function searchByTopArtistAndAlbum() {
//     // prompt for info about which song to look up
//     inquirer
//         .prompt([
//             {
//                 name: "artist",
//                 type: "input",
//                 message: "Which artist would you like to search by?",
//             }
//         ])
//         .then(function (answer) {
//             // when finished prompting, return songs that match that song title
//             connection.query(`SELECT top5000.artist,top5000.year,topalbums.album,topalbums.position as "Album Position",top5000.song,top5000.position as "Song Position"
//             FROM topalbums
//             INNER JOIN top5000 ON top5000.year=topalbums.year AND top5000.artist=topalbums.artist
//             WHERE topalbums.artist=?
//             ORDER BY top5000.year ASC, topalbums.album, top5000.position;`, answer.artist, function (err, data) {
//                 if (err) {
//                     throw err;
//                 } else {
//                     console.table(data);
//                     start();
//                 }
//             })
//         })
// }