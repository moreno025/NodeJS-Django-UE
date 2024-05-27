const {readFile} = require('fs').promises

async function printFile() {
    const file = await readFile('./ejemplo.txt', 'utf-8')
    console.log(file)
}

printFile()
console.log('Haz esto primero')