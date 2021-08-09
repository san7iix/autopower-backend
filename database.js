const mysql = require('mysql2');

// const mysqlConnection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '',
//     database: 'auto_power',
//     multipleStatements: true
// });

const mysqlConnection = mysql.createConnection({
    host: 'us-cdbr-east-04.cleardb.com',
    user: 'b0adf71c13480f',
    password: '14152889',
    database: 'heroku_d29a844f755278c',
    multipleStatements: true
});


mysqlConnection.connect(function(err) {
    if (err) {
        console.error(err);
        return;
    } else {
        console.log('Conectado a la base de datos');
    }
});

module.exports = mysqlConnection;
