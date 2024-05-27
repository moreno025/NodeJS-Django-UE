const http = require('http');

const server = http.createServer((req, res) => {

    if (req.method === 'GET' && req.url === '/hora') {
    res.writeHead(200, { 'Content-Type': 'application/json' });

    const responseData = {
        message: 'La hora actual del servidor es:',
        hora: new Date().toLocaleTimeString(),
    };

        res.end(JSON.stringify(responseData));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Ruta no encontrada');
    }
});

server.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000.');
});
