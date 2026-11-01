// ============================================================================
// APE 005 - Tarea 2: Pila Transaccional (Stack LIFO) sobre punteros
// Estructura de Datos - UNL | Autora: Domenica Narváez
// ============================================================================

// Reutilizamos la lista doble: la pila se apoya en sus nodos enlazados
const { ListaDoblementeEnlazada } = require('./ListaDoble');

/**
 * Pila (Stack) orientada a Sostenibilidad Computacional.
 * LIFO = Last In, First Out: el último comando que entra es el primero que sale,
 * como una pila de platos. El "tope" de la pila es la cola (tail) de la lista.
 * Operaciones fundamentales Push y Pop en O(1) estricto.
 */
class PilaTransaccional {
    constructor() {
        // Lista interna donde se guardan los comandos
        this.lista = new ListaDoblementeEnlazada();
    }

    /**
     * Apila un comando de telemetría en el tope.
     * Complejidad Temporal: O(1) -> insertarFinal solo cambia referencias.
     */
    push(comando) {
        this.lista.insertarFinal(comando);
    }

    /**
     * Desapila y retorna el comando en el tope (Undo).
     * Complejidad Temporal: O(1) -> eliminarFinal usa prev para llegar al penúltimo.
     */
    pop() {
        return this.lista.eliminarFinal();
    }

    /**
     * Retorna la cantidad de elementos almacenados.
     */
    obtenerTamano() {
        return this.lista.longitud;
    }
}

module.exports = PilaTransaccional;