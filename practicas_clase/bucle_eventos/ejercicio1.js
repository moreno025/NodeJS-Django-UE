console.time('miTemporizador1')
console.time('miTemporizador2')

setTimeout(() => {
    console.log('Hola')
    console.timeEnd('miTemporizador1')
}, 105)

let i = 0
setTimeout(() => {
    console.log('En bucle')
    console.timeEnd('miTemporizador2')
    while(true){
        if (i > 1000000000) {
            break
        }
        i++
    }
    console.log('Fin bucle')
}, 100)