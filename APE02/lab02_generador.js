/*/ Tarea 1: Generación del Conjunto de Datos Masivo (Mock Data)
    Para poder medir el I/O, primero necesitamos un archivo físico considerable.

    1. En el directorio de su proyecto, cree un archivo llamado
    lab02_generador.js.

    2. Implemente el siguiente código para escribir un archivo CSV con
    registros utilizando escritura en flujo (Stream) para no saturar la
    memoria durante su creación
/*/


const fs = require('fs');
const { performance } = require('perf_hooks');

const FILE_NAME = 'coordenadas_masivas.csv';
const N = 1000000;

console.log(`[Generador] Iniciando escritura de ${N} registros...`);

const start = performance.now();

const writableStream = fs.createWriteStream(FILE_NAME);

writableStream.write('id,latitud,longitud\n');

for (let i = 0; i < N; i++) {
    const lat = (Math.random() * 180 - 90).toFixed(6);
    const lng = (Math.random() * 360 - 180).toFixed(6);

    writableStream.write(`${i},${lat},${lng}\n`);
}

writableStream.end();

writableStream.on('finish', () => {
    const end = performance.now();

    console.log(`[Generador] Archivo creado en ${((end - start) / 1000).toFixed(2)} segundos.`);

    const stats = fs.statSync(FILE_NAME);
    const sizeInMB = stats.size / (1024 * 1024);

    console.log(`[Generador] Peso físico en disco: ${sizeInMB.toFixed(2)} MB`);
});
