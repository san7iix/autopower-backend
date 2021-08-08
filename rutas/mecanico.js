const e = require('express');
const express = require('express')
const bcrypt = require('bcryptjs')
const mysqlConnection = require('../database.js')

const router = express.Router();

//Constante con la ruta para usuarios
const URI_MECANICO = '/mecanico'

//Agregar mecanico
router.post(`${URI_MECANICO}/agregar`, (req, res) => {

    const {
        cedula,
        nombre,
        password
    } = req.body

    try {
        mysqlConnection.query('INSERT INTO mecanico (cedula,nombre,password) VALUES (?,?,?);', [cedula, nombre, bcrypt.hashSync(password, 10)], (err) => {
            if (!err) {
                res.json({
                    status: true,
                    message: "Se ha registrado correctamente"
                })
            } else {
                res.json({
                    status: false,
                    message: "Error al registrar, intente nuevamente"
                })
                console.error(err);
            }
        })

    } catch (error) {
        throw error;
    }

})

//Consultar mecanico
router.get(`${URI_MECANICO}/:cedula`, (req, res) => {

    const {
        cedula
    } = req.params
    try {

        mysqlConnection.query('SELECT nombre FROM mecanico WHERE cedula = ?;', [cedula], (err, rows) => {
            if (!err) {
                if (rows.length > 0) {
                    res.json({
                        status: true,
                        data: rows[0]
                    })
                } else {
                    res.json({
                        status: true,
                        data: []
                    })
                }
            } else {
                res.json({
                    status: false,
                    message: "Error al obtener los datos"
                })
                console.error(err);
            }
        })
    } catch (error) {
        console.error(error);
        throw error;
    }

})


//verificar que existe cedula
router.get(`${URI_MECANICO}/verificarCedula/:cedula`, (req, res) => {

    const {
        cedula
    } = req.params

    try {

        mysqlConnection.query('', [cedula], (err, rows) => {
            if (!err) {
                if (rows.length > 0) {
                    res.json({
                        status: false,
                        message: "Ya existe un mecanico con esta cedula"
                    })
                } else {
                    res.json({
                        status: true,
                        message: "Usuario o contraseña incorrectos"
                    })
                }
            } else {
                res.json({
                    status: true,
                    message: "Ocurrió un error al registrar"
                })
            }
        })

    } catch (error) {
        throw error;
    }

})

//Login mecanico
router.post(`${URI_MECANICO}/login`, (req, res) => {

    const {
        cedula,
        password
    } = req.body

    try {
        mysqlConnection.query('SELECT cedula,password FROM mecanico WHERE cedula = ?;', [cedula], (err, rows) => {
            if (!err) {
                if (rows.length > 0) {
                    bcrypt.compare(password, rows[0].password).then((result) => {
                        if (result) {
                            res.json({
                                idusuario: rows[0].idusuarios,
                                result: result
                            })
                        } else {
                            res.json({
                                message: "Usuario o contraseña incorrectos",
                                result: false
                            })
                        }
                    })
                } else {
                    res.json({
                        message: "Usuario o contraseña incorrectos",
                        result: false
                    })
                }
            }
        })
    } catch (error) {

    }

})


//Editar mecanico
router.put(`${URI_MECANICO}/editar`, (req, res) => {
    try {

        const {
            cedula_nueva,
            cedula,
            password,
            nombre
        } = req.body;


        mysqlConnection.query('SELECT cedula FROM mecanico WHERE cedula = ?;', [cedula_nueva], (err, rows) => {
            if (!err) {
                console.log(rows)
                if (rows.length > 0 && cedula != cedula_nueva) {
                    res.json({
                        status: false,
                        message: "Ya existe un mecanico con esta cedula"
                    })
                } else {
                    if (password != '') {
                        mysqlConnection.query('UPDATE mecanico SET cedula=?, nombre=?, password=? WHERE cedula = ?;', [cedula_nueva, nombre, bcrypt.hashSync(password, 10), cedula], (err, rows) => {
                            if (!err) {
                                res.json({
                                    status: true,
                                    message: "Cambio realizado correctamente"
                                })
                            } else {
                                res.json({
                                    status: false,
                                    message: "Ha ocurrido un error al editar"
                                })
                                console.err(err);
                            }
                        })
                    } else {
                        mysqlConnection.query('UPDATE mecanico SET cedula=?, nombre=? WHERE cedula = ?;', [cedula_nueva, nombre, cedula], (err, rows) => {
                            if (!err) {
                                res.json({
                                    status: true,
                                    message: "Cambio realizado correctamente"
                                })
                            } else {
                                res.json({
                                    status: false,
                                    message: "Ha ocurrido un error al editar"
                                })
                                console.error(err);
                            }
                        })

                    }
                }
            } else {
                res.json({
                    status: false,
                    message: "Ha ocurrido un error al editar"
                })
                console.err(err);
            }
        })


    } catch (error) {
        console.error(error);
        throw error;
    }
})


router.post(`${URI_MECANICO}/libres_fecha`, (req, res) => {

    const {
        fecha
    } = req.body

    try {
        mysqlConnection.query('SELECT cedula, nombre, count(*) as n_arreglos FROM mecanico as m INNER JOIN arreglo as arr ON m.cedula = mecanico WHERE fecha = ? GROUP BY cedula;', [fecha], (err, fecha_mecanico) => {

            if (!err) {
                mysqlConnection.query('SELECT cedula, nombre FROM mecanico;', [], (err2, mecanicos) => {
                    if (!err2) {

                        fecha_mecanico = fecha_mecanico.filter(elemento => elemento.n_arreglos >= 2);

                        mecanicos = mecanicos.map(mecanico => {
                            if (!fecha_mecanico.find(elemento => (elemento.cedula === mecanico.cedula))) return mecanico;
                        })

                        mecanicos = mecanicos.filter(el => el != null);
                        res.json({
                            status: true,
                            data: mecanicos
                        })
                    } else {
                        res.json({
                            status: false,
                            message: "Error al obtener los datos"
                        })
                    }
                })
            } else {
                console.error(err);
                throw err;
            }
        })
    } catch (error) {
        console.error(error);
        throw error;
    }

})




module.exports = router;