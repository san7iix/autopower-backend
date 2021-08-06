const mysql = require('mysql2');

const mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Mimondaca12!',
    database: 'auto_power',
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