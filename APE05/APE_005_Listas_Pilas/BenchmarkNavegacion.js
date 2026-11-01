const PilaTransaccional = require('./PilaTransaccional');

// Devuelve la memoria Heap usada en ese momento, en megabytes (MB)
function obtenerMemoriaMB() {
    return (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
}

// Cantidad de operaciones del experimento
const N = 500000;
console.log(`=== BENCHMARK DE RENDIMIENTO (N = ${N}) ===\n`);

// ---------------------------------------------------------------------------
// 1. EVALUACIÓN CON ARREGLO TRADICIONAL (unshift / shift)
// ---------------------------------------------------------------------------
if (global.gc) global.gc();                          // Limpia basura previa para medir justo
const memInicialArray = process.memoryUsage().heapUsed; // Memoria antes de la prueba
console.time('Tiempo Array Nativo (unshift/shift)');   // Inicia el cronómetro

const arregloNativo = [];
for (let i = 0; i < N; i++) {
    // unshift inserta al INICIO: V8 debe correr todas las celdas un lugar -> O(n)
    arregloNativo.unshift({ id: i, log: 'Evento Satelital' });
}
for (let i = 0; i < N; i++) {
    // shift saca el PRIMERO: V8 debe correr todas las celdas hacia atrás -> O(n)
    arregloNativo.shift();
}

console.timeEnd('Tiempo Array Nativo (unshift/shift)'); // Detiene el cronómetro e imprime
const memFinalArray = process.memoryUsage().heapUsed;   // Memoria después de la prueba
const deltaMemArray = ((memFinalArray - memInicialArray) / 1024 / 1024).toFixed(2);
console.log(`Impacto de Memoria Heap Array: ${deltaMemArray} MB\n`);

// ---------------------------------------------------------------------------
// 2. EVALUACIÓN CON PILA DE PUNTEROS DINÁMICOS
// ---------------------------------------------------------------------------
if (global.gc) global.gc();                          // Limpia la basura del experimento anterior
const memInicialPila = process.memoryUsage().heapUsed;
console.time('Tiempo Pila Transaccional O(1)');

const pilaSatelital = new PilaTransaccional();
for (let i = 0; i < N; i++) {
    // push enlaza un nodo nuevo en el tope sin mover a los demás -> O(1)
    pilaSatelital.push({ id: i, log: 'Evento Satelital' });
}
for (let i = 0; i < N; i++) {
    // pop desenlaza el nodo del tope sin mover a los demás -> O(1)
    pilaSatelital.pop();
}

console.timeEnd('Tiempo Pila Transaccional O(1)');
const memFinalPila = process.memoryUsage().heapUsed;
const deltaMemPila = ((memFinalPila - memInicialPila) / 1024 / 1024).toFixed(2);
console.log(`Impacto de Memoria Heap Pila: ${deltaMemPila} MB\n`);

// Memoria total al terminar (usa la función auxiliar definida arriba)
console.log(`Memoria Heap total al finalizar: ${obtenerMemoriaMB()} MB`);