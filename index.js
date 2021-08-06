const express = require('express');
const app = express();
var bodyParser = require('body-parser');
var cors = require('cors')

//Archivo de configuración
app.use(require('./config/config'));

app.use(cors())

//Configuración de la forma de mostrar los datos para el API
app.use(express.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


//Configuración del archivo de rutas
app.use(require('./rutas/rutas'));

//Inicio del servidor en el puerto para el app
app.listen(process.env.PORT, () => {
    console.log(`Server on port ${process.env.PORT}`);
});