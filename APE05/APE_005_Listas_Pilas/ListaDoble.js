// ============================================================================
// APE 005 - Tarea 1: Lista Doblemente Enlazada (Navegación Bidireccional)
// Estructura de Datos - UNL | Autora: Domenica Narváez
// ============================================================================

/**
 * Representa un Nodo en una Lista Doblemente Enlazada.
 * Cada nodo es una "cajita" suelta en el Memory Heap que guarda un dato
 * y dos referencias (flechas): una al nodo de adelante y otra al de atrás.
 */
class NodoDoble {
    constructor(datos) {
        this.datos = datos; // Carga útil de telemetría satelital
        this.next = null;   // Referencia al siguiente nodo (null = no hay nadie adelante)
        this.prev = null;   // Referencia al nodo anterior (null = no hay nadie atrás)
    }
}

/**
 * Estructura de Datos Dinámica Doblemente Enlazada.
 * Además de head y tail, guarda un cursor (actual) para la navegación
 * bidireccional que evalúa la rúbrica (métodos next() y prev()).
 */
class ListaDoblementeEnlazada {
    constructor() {
        this.head = null;     // Primer nodo de la lista
        this.tail = null;     // Último nodo de la lista
        this.actual = null;   // Cursor: nodo en el que estamos "parados"
        this.longitud = 0;    // Cantidad de nodos almacenados
    }

    /**
     * Inserta un nuevo elemento al final de la lista.
     * Complejidad Temporal: O(1) -> solo se cambian referencias, no se recorre nada.
     */
    insertarFinal(datos) {
        // Creamos la cajita nueva con el dato recibido
        const nuevoNodo = new NodoDoble(datos);

        if (!this.head) {
            // Lista vacía: el nuevo nodo es a la vez el primero y el último
            this.head = nuevoNodo;
            this.tail = nuevoNodo;
            this.actual = nuevoNodo; // El cursor empieza en el primer nodo
        } else {
            // El último nodo actual apunta hacia adelante al nuevo
            this.tail.next = nuevoNodo;
            // El nuevo nodo apunta hacia atrás al que era el último
            nuevoNodo.prev = this.tail;
            // Ahora el nuevo nodo pasa a ser la cola
            this.tail = nuevoNodo;
        }

        this.longitud++;  // Hay un nodo más
        return nuevoNodo;
    }

    /**
     * Elimina el último elemento de la lista.
     * Complejidad Temporal: O(1) -> gracias a prev llegamos al penúltimo sin recorrer.
     */
    eliminarFinal() {
        // Si no hay cola, la lista está vacía: no hay nada que eliminar
        if (!this.tail) return null;

        // Guardamos el nodo que vamos a sacar para devolver su dato al final
        const nodoEliminado = this.tail;

        if (this.head === this.tail) {
            // Solo había un nodo: la lista queda vacía
            this.head = null;
            this.tail = null;
            this.actual = null;
        } else {
            // Si el cursor estaba en el nodo que se elimina, lo movemos un paso atrás
            if (this.actual === nodoEliminado) this.actual = nodoEliminado.prev;
            // La cola retrocede al penúltimo nodo usando la referencia prev
            this.tail = this.tail.prev;
            // El nuevo último ya no debe apuntar al nodo eliminado
            this.tail.next = null;
        }

        // Cortamos la referencia del nodo eliminado para que el Garbage
        // Collector pueda liberarlo (ya nadie lo apunta y él no apunta a nadie)
        nodoEliminado.prev = null;
        this.longitud--;  // Hay un nodo menos
        return nodoEliminado.datos;
    }

    /**
     * Navegación: mueve el cursor al siguiente nodo.
     * Complejidad Temporal: O(1) -> se sigue una sola referencia (next).
     * @returns el dato del nuevo nodo actual, o null si ya está en el final.
     */
    next() {
        // Solo avanzamos si el cursor existe y hay un nodo adelante
        if (this.actual && this.actual.next) {
            this.actual = this.actual.next; // Un paso hacia adelante
            return this.actual.datos;
        }
        return null; // Lista vacía o ya estamos en la cola: el cursor no se mueve
    }

    /**
     * Navegación: mueve el cursor al nodo anterior.
     * Complejidad Temporal: O(1) -> se sigue una sola referencia (prev).
     * En una lista simple esto costaría O(n), porque habría que recorrer desde head.
     * @returns el dato del nuevo nodo actual, o null si ya está en el inicio.
     */
    prev() {
        // Solo retrocedemos si el cursor existe y hay un nodo atrás
        if (this.actual && this.actual.prev) {
            this.actual = this.actual.prev; // Un paso hacia atrás
            return this.actual.datos;
        }
        return null; // Lista vacía o ya estamos en la cabeza: el cursor no se mueve
    }

    /**
     * Devuelve el dato del nodo donde está el cursor (o null si la lista está vacía).
     */
    obtenerActual() {
        return this.actual ? this.actual.datos : null;
    }
}

// Exportamos ambas clases para usarlas en los demás archivos
module.exports = { NodoDoble, ListaDoblementeEnlazada };
