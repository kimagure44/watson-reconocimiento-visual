// Dependencias para usar IBM Watson
var VisualRecognitionV3 = require('watson-developer-cloud/visual-recognition/v3');

// Crear servidor en Node
var http = require('http');

// Modulo de parseo de los datos de un formulario, incluyendo la subida de ficheros (multipart/form-data).
var formidable = require('formidable');

// Sistema de ficheros
var fs = require('fs');

// Puerto para el servidor
var port = process.env.PORT || 3000;

// Creamos el servidor
http.createServer(function(req, res) {
    // Donde va el proceso
    console.log("1");

    // Ruta para subir enviar el fichero
    if (req.url == '/uploadImage') {

        // Donde va el proceso
        console.log("2");

        // Creamos un nuevo formulario de entrada
        var form = new formidable.IncomingForm();

        // Analiza una solicitud entrante de node.js que contiene datos de formulario (Enviando archivos y campos)
        form.parse(req, function(err, fields, files) {
            // Donde va el proceso
            console.log("3");

            // Archivo temporal
            var tempPath = files.photo.path;

            // Nuevo archivo
            var newpath = 'uploads/' + files.photo.name;

            // Asynchronous rename (Cuando estan preparados los guardamos)
            fs.rename(tempPath, newpath, function(err) {

                // Donde va el proceso
                console.log("4");

                // Error
                if (err) throw err;

                // Donde va el proceso
                console.log("5");

                // API DE IBM Watson
                // 1 - Se autentica en la API de reconocimiento visual al proporcionar la clave API para la instancia de servicio que desea utilizar. 
                var visualRecognition = new VisualRecognitionV3({
                    version: '2018-03-19',
                    api_key: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
                });

                // La función fs.createReadStream () le permite abrir una secuencia legible de una manera muy simple. Todo lo que tiene que hacer es pasar la ruta del archivo para comenzar a transmitir
                var images_file = fs.createReadStream(newpath);

                // La puntuación mínima que una clase debe tener para mostrarse en la respuesta 0.0 => ignora la clasificación y devuelve todo
                var threshold = 0.0;

                // Parametros (documentacion muy bien explicada)
                var params = { images_file: images_file, threshold: threshold, accept_language: "es" };

                // Donde vamos
                console.log("6");

                // Comienza la clasificación
                visualRecognition.classify(params, function(err, response) {

                    // Donde vamos
                    console.log("7");

                    // Mostrar en la consola
                    err ? console.log(err) : console.log(JSON.stringify(response, null, 2));

                    // Enviamos una cadena de texto JSON
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(response));
                });
            });
        });
    }
}).listen(port);
console.log(`Servidor funcionando en el puerto ${port}`);