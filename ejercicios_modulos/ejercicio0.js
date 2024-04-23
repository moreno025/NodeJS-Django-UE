const {readFile} = require('fs')

readFile('./ejemplo.txt', 'utf-8', (err, texto) => {
    console.log(texto)
})

console.log(texto)

console.log('Haz esto primero')
