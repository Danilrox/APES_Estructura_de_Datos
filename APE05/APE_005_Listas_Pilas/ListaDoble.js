/**
 * Representa un Nodo en una Lista Doblemente Enlazada.
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
        const nuevoNodo = new NodoDoble(datos);

        if (!this.head) {
            this.head = nuevoNodo;
            this.tail = nuevoNodo;
            this.actual = nuevoNodo; // El cursor empieza en el primer nodo
        } else {
            this.tail.next = nuevoNodo;
            nuevoNodo.prev = this.tail;
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
        if (!this.tail) return null;
        const nodoEliminado = this.tail;
        if (this.head === this.tail) {
            this.head = null;
            this.tail = null;
            this.actual = null;
        } else {
            if (this.actual === nodoEliminado) this.actual = nodoEliminado.prev;
            this.tail = this.tail.prev;
            this.tail.next = null;
        }
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
        if (this.actual && this.actual.prev) {
            this.actual = this.actual.prev; // Un paso hacia atrás
            return this.actual.datos;
        }
        return null; // Lista vacía o ya estamos en la cabeza: el cursor no se mueve
    }
    obtenerActual() {
        return this.actual ? this.actual.datos : null;
    }
}

// Exportamos ambas clases para usarlas en los demás archivos
module.exports = { NodoDoble, ListaDoblementeEnlazada };
