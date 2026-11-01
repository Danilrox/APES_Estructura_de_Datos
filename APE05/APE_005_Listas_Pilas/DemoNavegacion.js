const { ListaDoblementeEnlazada } = require('./ListaDoble');
const PilaTransaccional = require('./PilaTransaccional');

// --- 1. Navegación bidireccional por el historial de telemetría ---
console.log('=== NAVEGACIÓN BIDIRECCIONAL ===');
const historial = new ListaDoblementeEnlazada();
historial.insertarFinal({ id: 1, evento: 'Encender panel solar' });
historial.insertarFinal({ id: 2, evento: 'Orientar antena' });
historial.insertarFinal({ id: 3, evento: 'Enviar telemetría' });

console.log('Actual:', historial.obtenerActual().evento);   // Empieza en el id 1
console.log('next():', historial.next().evento);            // Avanza al id 2
console.log('next():', historial.next().evento);            // Avanza al id 3
console.log('next():', historial.next());                   // null: ya es el final
console.log('prev():', historial.prev().evento);            // Retrocede al id 2
console.log('prev():', historial.prev().evento);            // Retrocede al id 1
console.log('prev():', historial.prev());                   // null: ya es el inicio

// --- 2. Undo/Redo con dos pilas LIFO ---
// pilaUndo guarda lo que se hizo; pilaRedo guarda lo que se deshizo.
console.log('\n=== UNDO / REDO ===');
const pilaUndo = new PilaTransaccional();
const pilaRedo = new PilaTransaccional();

// Ejecutamos tres comandos: cada uno se apila en pilaUndo
['Subir órbita', 'Activar cámara', 'Apagar sensor'].forEach((cmd) => {
    pilaUndo.push(cmd);
    console.log('Ejecutado:', cmd);
});

// Undo: sacamos el último comando (LIFO) y lo guardamos en pilaRedo
const deshecho = pilaUndo.pop();
pilaRedo.push(deshecho);
console.log('Undo ->', deshecho);

// Redo: recuperamos el último comando deshecho y vuelve a pilaUndo
const rehecho = pilaRedo.pop();
pilaUndo.push(rehecho);
console.log('Redo ->', rehecho);

console.log('Comandos en pilaUndo:', pilaUndo.obtenerTamano()); // 3
console.log('Comandos en pilaRedo:', pilaRedo.obtenerTamano()); // 0
