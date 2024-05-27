const http = require('http');
const fs = require('fs');

const fetchPokedexData = () => {
    return new Promise((resolve, reject) => {
        fs.readFile('./pokedex.json', 'utf-8', (error, data) => {
            if(error){
                reject(error);
            }else{
                resolve(JSON.parse(data));
            }
        });
    });
};

const handleRequest = async (req, res) => {
    try{
        const pokemonData = await fetchPokedexData();
        const pokemonNombre = decodeURI(req.url.substring(1));
        const nombreData = pokemonData.find(pokemon => {
            return pokemon.id == pokemonNombre || pokemon.name.english == pokemonNombre || pokemon.name.japanese == pokemonNombre || pokemon.name.chinese == pokemonNombre || pokemon.name.french == pokemonNombre;
        });
        
        if (nombreData) {
            const response = {
                'Tipo': nombreData.type.join(', '),
                'HP': nombreData.base.HP,
                'Attack': nombreData.base.Attack,
                'Defense': nombreData.base.Defense,
                'Sp. Attack': nombreData.base['Sp. Attack'],
                'Sp. Defense': nombreData.base['Sp. Defense'],
                'Speed': nombreData.base.Speed
            }
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.end(JSON.stringify(response, null, 4));
        } else {
            res.writeHead(400, {'Content-Type': 'text/plain'});
            res.end('Ese pokemon no existe');
        }
    } catch(error) {
        res.writeHead(500, {'Content-Type': 'text/plain'});
        res.end('Error interno del servidor.');
    }
}

const port = 3000;

const server = http.createServer(handleRequest);
server.listen(port, () => {
    console.log('Escuchando en el puerto 3000');
});

