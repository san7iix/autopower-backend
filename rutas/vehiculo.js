const e = require('express');
const express = require('express')
const mysqlConnection = require('../database.js')

const router = express.Router();

//Constante con la ruta para vehiculos
const URI_VEHICULOS = '/vehiculos'



//Ruta para crear vehiculo
router.post(`${URI_VEHICULOS}/agregar`, (req, res, next) => {
    try {
        const {
            usuario,
            nombre,
            marca,
            modelo,
            color,
            placa,
            nombre_propietario,
            cedula_propietario
        } = req.body


        mysqlConnection.query('INSERT INTO vehiculo (nombre, nombre_propietario,cedula_propietario, marca, modelo, color, placa) VALUES (?,?,?,?,?,?,?);', [nombre, nombre_propietario,cedula_propietario, marca, modelo, color, placa], (err) => {
            if (!err) {
                res.json({
                    status: true,
                    message: 'Vehiculo registrado correctamente'
                });
            } else {
                res.json({
                    status: false,
                    message: 'Error al registrar el vehiculo'
                });
                console.log(err)
            }
        })

    } catch (error) {
        console.error(error);
        throw error;
    }
})


router.get(`${URI_VEHICULOS}/verificarPlaca/:placa`, (req, res) => {
    try {
        const {
            placa
        } = req.params

        mysqlConnection.query('SELECT placa FROM vehiculo WHERE placa = ?;', [placa], (err, rows) => {
            if (!err) {
                if (rows.length > 0) {
                    res.json({
                        status: false,
                        message: 'Ya existe un vehiculo con esta placa'
                    });
                } else {
                    res.json({
                        status: true
                    })
                }
            } else {
                res.json({
                    status: false,
                    message: 'Error al registrar el vehiculo'
                });
                console.log(err)
            }
        })




    } catch (error) {
        console.log(error);
        throw error;
    }
});

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


//Ruta para consultar todos los vehiculos a entregar

router.get(`${URI_VEHICULOS}/entregar`, (req, res) => {
    mysqlConnection.query('SELECT * FROM vehiculo WHERE estado = 5 ORDER BY idvehiculo ;', [], (err, rows) => {
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
            console.error(err);
        }
    })
})

//Ruta para consultar todos los vehiculos para reparar
router.get(`${URI_VEHICULOS}/arreglar`, (req, res) => {
    mysqlConnection.query('SELECT * FROM vehiculo WHERE estado = 0 ORDER BY idvehiculo', [], (err, rows) => {
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


//Ruta para consultar los arreglos de los vehiculos
router.get(`${URI_VEHICULOS}/arreglos`, (req, res) => {
    console.log("asdasd")
    try {
        mysqlConnection.query('SELECT * FROM arreglo as arr INNER JOIN vehiculo as vh ON arr.vehiculo = vh.idvehiculo INNER JOIN taller as tll ON tll.idtaller = arr.taller;', [], (err, rows) => {
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

//Modificar estado

router.put(`${URI_VEHICULOS}/mecanico/cambiar_estado`, (req, res) => {

    const {
        estado,
        vehiculo
    } = req.body

    let mensaje;

    switch (estado) {
        case 4:
            mensaje = "Se ha iniciado la reparacion"
            break;
    
        case 6:
            mensaje = "Se entregado el vehiculo"
            break;
    
        default:
            mensaje = "se ha cambiado de estado correctamente";
            break;
    }

    mysqlConnection.query('UPDATE vehiculo SET estado = ? WHERE idvehiculo = ?;', [estado, vehiculo], (err) => {
        if (!err) {
            res.json({
                status: true,
                message: mensaje,
            })
        } else {
            console.error(err);
            res.json({
                status: false,
                message: "Ha ocurrido un error al cambiar de estado"
            })
            throw err;
        }
    })

});



module.exports = router;