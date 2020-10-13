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
            choices: ["Add Department, Role, or Employee", "View Departments, Roles, or Employees", "Update an Employees Role", "Bonus 1", "Bonus 2", "Bonus 3", "EXIT"],
            loop: false
        })
        .then(function (answer) {
            // based on answer above, run function to retrive what user is looking for
            switch (answer.choice) {
                case "Add Department, Role, or Employee":
                    //   Call Add Function
                    break;
                case "View Departments, Roles, or Employees":
                    //   Call View Function
                    break;
                case "Update an Employees Role":
                    //   Call Update Function
                    break;
                case "Bonus 1":
                    //   Bonus 1
                    break;
                case "Bonus 2":
                    //   Bonus 2
                    break;
                case "Bonus 3":
                    //   Bonus 3
                    break;
                case "EXIT":
                    //   Exit Application
                    connection.end();
            }
        }).catch(error => {
            if(error){
                console.log(error)
            }
        });
}

// TODO: Add [DEPARTMENT, ROLE, EMPLOYEE]



// TODO: View [DEPARTMENT, ROLE, EMPLOYEE]



// TODO: Update Employees Role





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