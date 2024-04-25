console.time("temp1")
console.time("temp2")

setTimeout(() => {
    console.log("Hola")
    console.timeEnd("temp1")
}, 1000)

console.log("Adios")

setTimeout(() => {
    console.log("Elefante")
    console.timeEnd("temp2")
}, 1000)

