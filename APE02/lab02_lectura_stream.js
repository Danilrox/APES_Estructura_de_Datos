/*/
    Tarea 3: Enfoque 2 - Lectura Asíncrona con Streams (
    Espacial)

    1. Cree el archivo lab02_lectura_stream.js.

    2. Implemente la abstracción de flujos (Streams) para leer fragmentos
    (chunks) secuenciales, reduciendo la complejidad espacial teórica de
    a un constante correspondiente al tamaño del buffer
/*/


const fs = require('fs');
const { performance } = require('perf_hooks');

const FILE_NAME = 'coordenadas_masivas.csv';

console.log('[Lectura por Stream] Iniciando procesamiento...');

// Medimos la memoria Heap antes de comenzar
const memoryBefore = process.memoryUsage().heapUsed;

// Iniciamos el cronómetro
const start = performance.now();

let totalRegistros = 0;

// Creamos un flujo de lectura secuencial asíncrona
const readableStream = fs.createReadStream(FILE_NAME, {
    encoding: 'utf-8'
});

// El archivo se procesa por pequeños fragmentos
readableStream.on('data', (chunk) => {

    // Contamos los saltos de línea del fragmento actual
    const lineBreakCount = (chunk.match(/\n/g) || []).length;

    totalRegistros += lineBreakCount;

    // Green Computing:
    // No almacenamos todos los registros en un arreglo.
    // Los fragmentos anteriores pueden ser liberados
    // por el recolector de basura (Garbage Collector).
});

// Cuando termina la lectura del archivo
readableStream.on('end', () => {

    const end = performance.now();

    // Medimos la memoria Heap al finalizar
    const memoryAfter = process.memoryUsage().heapUsed;

    console.log(`[Lectura por Stream] Total registros procesados: ${totalRegistros}`);

    console.log(`[Lectura por Stream] Tiempo de I/O parcializado: ${((end - start) / 1000).toFixed(2)} segundos.`);

    console.log(`[Lectura por Stream] Consumo Neto de RAM: ${((memoryAfter - memoryBefore) / 1024 / 1024).toFixed(2)} MB`);
});

// Control de errores
readableStream.on('error', (error) => {
    console.error('Error al leer el archivo:', error.message);
});
