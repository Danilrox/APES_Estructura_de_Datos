/*/
    Tarea 2: Enfoque 1 - Lectura Síncrona (Bloqueante /
    Espacial)
    
    Este enfoque representa la manera más intuitiva, pero menos eficiente, de
    procesar un archivo físico.
    
    1. Cree un archivo llamado lab02_lectura_sync.js.

    2. Implemente el código para cargar todo el archivo en la RAM.
/*/


const fs = require('fs');
const { performance } = require('perf_hooks');

const FILE_NAME = 'coordenadas_masivas.csv';

console.log('[Lectura Síncrona] Iniciando carga en memoria...');

// Medimos la memoria antes de leer
const memoryBefore = process.memoryUsage().heapUsed;

// Iniciamos el cronómetro
const start = performance.now();

// Leemos TODO el archivo de una sola vez
// Esta operación bloquea el hilo principal
const data = fs.readFileSync(FILE_NAME, 'utf-8');

// Separamos el contenido en líneas
const lineas = data.split('\n');

// Detenemos el cronómetro
const end = performance.now();

// Medimos la memoria después de leer
const memoryAfter = process.memoryUsage().heapUsed;

// Mostramos los resultados
console.log(`[Lectura Síncrona] Total registros leídos: ${lineas.length - 1}`);

console.log(`[Lectura Síncrona] Tiempo de I/O + Parsing: ${((end - start) / 1000).toFixed(2)} segundos.`);

console.log(`[Lectura Síncrona] Consumo Neto de RAM: ${((memoryAfter - memoryBefore) / 1024 / 1024).toFixed(2)} MB`);
