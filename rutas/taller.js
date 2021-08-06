const express = require('express')
const bcrypt = require('bcryptjs')
const mysqlConnection = require('../database.js')

const router = express.Router();

//Constante con la ruta para usuarios
const URI_TALLERES = '/taller'


//Ruta para consultar todos los talleres
router.get(`${URI_TALLERES}`, (req, res) => {
    try {
        mysqlConnection.query('SELECT * FROM taller', (err, rows, fields) => {
            if (!err) {
                res.json({
                    data: rows,
                    status: true
                })
            } else {
                res.json({
                    status: false,
                    message: 'Ha ocurrido un error al obtener los talleres'
                })
                console.log(err)
            }
        });
    } catch (error) {
        console.error(error);
    }
});


module.exports = router;