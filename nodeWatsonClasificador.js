// Dependencias para usar IBM Watson
var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');

// Crear servidor en Node
var http = require('http');

// Obtener rutas
var ruta = require("path");

// Modulo de parseo de los datos de un formulario, incluyendo la subida de ficheros (multipart/form-data).
var formidable = require('formidable');

// Sistema de ficheros
var fs = require('fs');

// Puerto para el servidor
var port = process.env.PORT || 17202;

// Creamos el servidor
http.createServer(function(req, res) {
    if (req.url == "/") {
        fs.readFile('index.html', function(error, contenido_archivo) {
            if (error) {
                res.writeHead(500, 'text/plain');
                res.end('Error interno.');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(contenido_archivo);
            }
        });
    } else if (req.url == "/uploadImage") {

        // Creamos un nuevo formulario de entrada
        var form = new formidable.IncomingForm();

        // Analiza una solicitud entrante de node.js que contiene datos de formulario (Enviando archivos y campos)
        form.parse(req, function(err, fields, files) {
            // Error
            if (err) throw err;

            // API DE IBM Watson
            // 1 - Se autentica en la API de reconocimiento visual al proporcionar la clave API para la instancia de servicio que desea utilizar. 
            var visualRecognition = new VisualRecognitionV3({
                version: '2018-03-19',
                api_key: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
            });

            // La función fs.createReadStream () le permite abrir una secuencia legible de una manera muy simple. Todo lo que tiene que hacer es pasar la ruta del archivo para comenzar a transmitir
            var images_file = fs.createReadStream(files.photo.path);

            // La puntuación mínima que una clase debe tener para mostrarse en la respuesta 0.0 => ignora la clasificación y devuelve todo
            var threshold = 0.0;

            // Parametros (documentacion muy bien explicada)
            var params = { images_file: images_file, threshold: threshold, accept_language: "es" };

            // Donde vamos
            console.log("6");

            // Comienza la clasificación
            visualRecognition.classify(params, function(err, response) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(response));
            });
        });
    } else {
        var codigo_html = '';
        res.writeHead(200, 'text/html');
        res.end(codigo_html);
    }
}).listen(port);
console.log(`Servidor funcionando en el puerto ${port}`);