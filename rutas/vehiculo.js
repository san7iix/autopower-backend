const e = require('express');
const express = require('express')
const mysqlConnection = require('../database.js')

const router = express.Router();

//Constante con la ruta para vehiculos
const URI_VEHICULOS = '/vehiculos'



//Ruta para crear vehiculo
router.post(`${URI_VEHICULOS}/agregar`, (req, res) => {
    try {
        const {
            usuario,
            nombre,
            marca,
            modelo,
            color
        } = req.body

        mysqlConnection.query('INSERT INTO vehiculo (nombre, marca, modelo, color, propietario) VALUES (?,?,?,?,?);', [nombre, marca, modelo, color, usuario], (err, rows, fields) => {
            if (!err) {
                res.json({
                    status: true,
                    message: 'Vehiculo registrado correctamente'
                });
            } else {
                console.log(err)
            }
        });

    } catch (error) {
        console.error(error);
    }
})

//Ruta para consultar todos los vehiculos

router.get(`${URI_VEHICULOS}`, (req, res) => {
    mysqlConnection.query('SELECT * FROM vehiculo ORDER BY idvehiculo', [], (err, rows) => {
        if (!err) {
            res.json({
                data: rows,
                status: true,
                message: 'Datos obtenidos'
            })
        } else {
            res.json({
                data: [],
                status: false,
                message: 'Error al obtener datos'
            })
        }
    })
})


//Ruta para consultar un vehiculo
router.get(`${URI_VEHICULOS}/consultar/:idVehiculo`, (req, res) => {

    const {
        idVehiculo
    } = req.params

    if (idVehiculo === '') return res.json({
        data: [],
        status: true
    })

    mysqlConnection.query('SELECT * FROM vehiculo WHERE idvehiculo = ?;', [idVehiculo], (err, rows) => {
        if (!err) {
            res.json({
                data: rows[0],
                status: true,
                message: 'Datos obtenidos'
            })
        } else {
            res.json({
                data: [],
                status: false,
                message: 'Error al obtener datos'
            })
        }
    })
})

//Ruta para eliminar un vehiculo
router.delete(`${URI_VEHICULOS}/eliminar`, (req, res) => {
    const {
        idVehiculo,
        usuario
    } = req.body
    try {
        mysqlConnection.query('DELETE FROM vehiculo WHERE idvehiculo = ? and propietario = ?;', [idVehiculo, usuario], (err) => {
            if (!err) {
                res.json({
                    status: true,
                    message: 'Vehiculo eliminado correctamente'
                })
            } else {
                res.json({
                    status: false
                })
                console.error(err);
            }
        });
    } catch (error) {
        console.error(error);
    }
})


//Ruta para consultar los arreglos de un usuario
router.get(`${URI_VEHICULOS}/arreglos/:idusuario`, (req, res) => {
    const {
        idusuario
    } = req.params;
    try {
        mysqlConnection.query('SELECT * FROM arreglo as arr INNER JOIN vehiculo as vh ON arr.vehiculo = vh.idvehiculo INNER JOIN taller as tll ON tll.idtaller = arr.taller WHERE propietario = ?;', [idusuario], (err, rows) => {
            if (!err) {
                res.json({
                    data: rows,
                    status: true,
                    message: 'Datos obtenidos'
                })
            } else {
                res.json({
                    status: false
                })
                console.error(err);
            }
        })
    } catch (error) {
        console.error(error);
    }
})



//Ruta para consultar los vehiculos de un usuario
router.get(`${URI_VEHICULOS}/usuario/:idusuario`, (req, res) => {

    const {
        idusuario
    } = req.params

    mysqlConnection.query('SELECT * FROM vehiculo WHERE propietario = ?;', [idusuario], (err, rows) => {
        if (!err) {
            res.json({
                data: rows,
                status: true,
                message: 'Datos obtenidos'
            })
        } else {
            res.json({
                data: [],
                status: false,
                message: 'Error al obtener datos'
            })
        }
    })
})



module.exports = router;