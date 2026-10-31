const ListaDobleNavegacion = require('./models/ListaDobleNavegacion');

// Crear una lista doblemente enlazada
const lista = new ListaDobleNavegacion();

// Insertar elementos
lista.insertar("Inicio");
lista.insertar("Página 1");
lista.insertar("Página 2");

// Mostrar el elemento actual
console.log("Elemento actual:", lista.obtenerActual());

// Avanzar
lista.avanzar();
console.log("Después de avanzar:", lista.obtenerActual());

// Retroceder
lista.retroceder();
console.log("Después de retroceder:", lista.obtenerActual());

// Eliminar el elemento actual
lista.eliminarActual();
console.log("Después de eliminar:", lista.obtenerActual());
