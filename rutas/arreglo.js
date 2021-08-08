const e = require('express');
const express = require('express')
const mysqlConnection = require('../database.js')

const router = express.Router();

//Constante con la ruta para usuarios
const URI_ARREGLOS = '/arreglos'


router.get(`${URI_ARREGLOS}`, (req, res) => {

    try {
        mysqlConnection.query('SELECT * FROM arreglo', [], (err, rows) => {
            if (!err) {
                res.json({
                    status: true,
                    message: 'Exitoso',
                    data: rows
                })
            } else {
                res.json({
                    status: false,
                    message: 'Error al obtener datos'
                })
            }
        })
    } catch (error) {
        console.log(error);
        res.json({
            status: false,
            message: 'Error al obtener datos'
        })
    }

});


router.post(`${URI_ARREGLOS}/agregar`, (req, res) => {
    const {
        vehiculo,
        fecha,
        tipo_arreglo,
        taller,
        mecanico
    } = req.body


    console.log(vehiculo);

    mysqlConnection.query('INSERT INTO arreglo (vehiculo, fecha, tipo_arreglo, taller, mecanico) VALUES (?,?,?,?,?)', [vehiculo, fecha, tipo_arreglo, taller,mecanico], (err) => {
        if (err) {
            console.log(err);
            res.json({
                status: false,
                message: 'Ocurrió un error al agendar, intente nuevamente, por favor'
            })
            return;
        }
    })


    mysqlConnection.query('UPDATE vehiculo SET estado = 3 WHERE idvehiculo = ?;', [vehiculo], (err) => {
        if (!err) {
            res.json({
                status: true,
                message: 'Su arreglo ha sido agendado correctamente'
            })
        } else {
            console.log(err);
            res.json({
                status: false,
                message: 'Ocurrió un error al agendar, intente nuevamente, por favor'
            })
        }
    })

});


router.get(`${URI_ARREGLOS}/:idvehiculo`, (req, res) => {
    const {
        idvehiculo
    } = req.params

    try {
        mysqlConnection.query('SELECT * from arreglo as arr INNER JOIN vehiculo as veh ON arr.vehiculo = veh.idvehiculo WHERE idvehiculo = ?;', [idvehiculo], (err, rows) => {
            if (!err) {
                res.json({
                    status: true,
                    message: 'Su arreglo ha sido agendado correctamente',
                    data: rows
                })

            } else {
                console.log(err);
                res.json({
                    status: true,
                    message: 'Ocurrió un error al agendar, intente nuevamente, por favor'
                })
            }
        })
    } catch (error) {
        console.log(err);
        res.json({
            status: true,
            message: 'Ocurrió un error al agendar, intente nuevamente, por favor'
        })
    }
});


router.post(`${URI_ARREGLOS}/fecha_mecanico`, (req, res) => {

    const {
        cedula,
        fecha
    } = req.body    

    try {
        mysqlConnection.query('SELECT idvehiculo,direccion, idarreglo,fecha, tipo_arreglo, taller, placa FROM arreglo as arr INNER JOIN vehiculo as vh ON arr.vehiculo = vh.idvehiculo INNER JOIN taller as tll ON arr.taller = tll.idtaller WHERE mecanico = ? AND fecha = ? AND estado = 3 ;', [cedula, fecha], (err, rows) => {

            if (!err) {
                if (rows.length > 0) {
                    res.json({
                        data: rows,
                        status: true
                    })
                } else {
                    res.json({
                        data: [],
                        status: true
                    })
                }

            } else {
                console.error(err);
                res.json({
                    status: false,
                    message: "Error al obtener los datos"
                })
                throw err;
            }

        })
    } catch (error) {
        console.error(error);
        throw error;
    }

})


router.put(`${URI_ARREGLOS}/mecanico/finalizar_reparacion`, (req, res) => {

    const {
        descripcion,
        idarreglo,
        vehiculo
    } = req.body

    try {
        mysqlConnection.query('UPDATE arreglo SET descripcion = ? WHERE idarreglo = ?', [descripcion, idarreglo], (err) => {
            if (!err) {
                mysqlConnection.query('UPDATE vehiculo SET estado = 5 WHERE idvehiculo =?;', [vehiculo], (err) => {
                    if (!err) {
                        res.json({
                            status: true,
                            message: "Revisión terminada"
                        })
                    } else {
                        res.json({
                            status: false,
                            message: "Error al editar los datos"
                        })
                        throw err;
                    }
                })
            } else {
                res.json({
                    status: false,
                    message: "Error al editar los datos"
                })
                throw err;
            }
        })
    } catch (error) {
        console.error(error);
        throw error;
    }
})




module.exports = router;