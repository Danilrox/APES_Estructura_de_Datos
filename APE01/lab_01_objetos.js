/*
APE01 - Laboratorio 01
Asingnatura: Estructuras de Datos
Participante: Dario "Monao" Chillogallo
Grupo: 3
Docente: Ing. Cristian Narvaez
*/

/*
Incluya el siguiente código, el cual creará $1,000,000$ de instancias de
coordenadas.
*/

const { getMemoryUsage } = require('./profiler');
const N = 1000000; // 1 millón de registros
const memoriaInicial = getMemoryUsage();
// TDA: Coordenada basada en Objetos
class CoordenadaObj {
constructor(lat, lng) {
this.lat = lat; // Número de punto flotante de 64 bits
this.lng = lng;
}
}
// Almacenamos en memoria
let coordenadas = [];
for (let i = 0; i < N; i++) {
coordenadas.push(new CoordenadaObj(i * 0.1, i * -0.1));
}
const memoriaFinal = getMemoryUsage();
console.log(`[Enfoque Objetos] Memoria inicial: ${memoriaInicial} MB`);
console.log(`[Enfoque Objetos] Memoria final: ${memoriaFinal} MB`);
console.log(`[Enfoque Objetos] Consumo Neto: ${memoriaFinal - memoriaInicial}
MB`);

/*
Resultados de la ejecución:
[Enfoque Objetos] Memoria inicial: 3.9 MB
[Enfoque Objetos] Memoria final: 94.23 MB
[Enfoque Objetos] Consumo Neto: 90.33 MB
*/

