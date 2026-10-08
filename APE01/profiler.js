/*
APE01 - Laboratorio 01
Asingnatura: Estructuras de Datos
Participante: Dario "Monao" Chillogallo
Grupo: 3
Docente: Ing. Cristian Narvaez
*/

/*
Implemente la función de medición de memoria RAM (Heap):

* Tarea 1: Utilidad para medir la memoria Heap en Megabytes (MB).
* El Heap es el espacio de memoria dinámico donde V8 almacena objetos y
variable
*/

function getMemoryUsage() {
const memoryData = process.memoryUsage();
// Convertimos de bytes a Megabytes (MB) usando notación matemática estándar
const heapUsedMB = Math.round(memoryData.heapUsed / 1024 / 1024 * 100)
/ 100;
return heapUsedMB;
}
module.exports = { getMemoryUsage };
