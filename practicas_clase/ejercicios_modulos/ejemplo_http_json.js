const http = require('http');
const fs = require('fs');
const { rejects } = require('assert');

const fetchCovidData = async () => {
    return new Promise((resolve, reject) => {
        fs.readFile('./', 'utf-8', (err, data) => {
            if(err){
                reject(err)
            }else{
                resolve(JSON.parse(data));
            }
        });
    });
};

const HandleRequest = async (req, res) => {
    const covidData = await fetchCovidData()
    const regionName = decodeURI(req.url.substring(1))
    const regionData = covidData.find(region => region.denominazione_regione === regionName);

    if (regionData){
        const response = {
            'Región': regionData.denominazione_regione,
            'Casos totales': regionData.totale_casi,
            'Fallecidos': regionData.deceduti,
            'Recuperados': regionData.dimessi_guariti
        }
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(response, null, 4));
    }else{
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Esta región no existe.');
    }
}

const server = http.createServer(HandleRequest);
server.listen(3000, () => {
    console.log('Escuchando en el puerto 3000');
});

