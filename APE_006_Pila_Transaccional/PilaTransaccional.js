/**
 * Unidad atómica de cambio (delta) almacenada en la pila transaccional.
 * Guarda solo la variación de estado para evitar clonaciones O(N).
 */
class NodoDelta {
    constructor(indice, estadoAnterior, estadoNuevo, loteId) {
        this.indice = indice;                 // Posición afectada en el arreglo ordenado
        this.estadoAnterior = estadoAnterior; // Valor previo, usado para restaurar en O(1)
        this.estadoNuevo = estadoNuevo;       // Valor aplicado por la transacción
        this.loteId = loteId;                 // Lote al que pertenece el cambio
        this.siguiente = null;                // Referencia al nodo inferior de la pila
    }
}

/**
 * Pila LIFO basada en nodos enlazados (sin arreglos auxiliares).
 * push, pop y peek se ejecutan en tiempo O(1).
 */
class PilaTransaccional {
    constructor() {
        this.tope = null; // Nodo en la cima de la pila
        this.tamano = 0;  // Cantidad de deltas almacenados
    }

    /**
     * Apila un delta en el tope.
     * Tiempo: O(1) | Espacio auxiliar: O(1)
     */
    push(indice, estadoAnterior, estadoNuevo, loteId) {
        const nuevoNodo = new NodoDelta(indice, estadoAnterior, estadoNuevo, loteId);
        nuevoNodo.siguiente = this.tope; // El nuevo nodo apunta al tope actual
        this.tope = nuevoNodo;           // El nuevo nodo pasa a ser el tope
        this.tamano++;
    }

    /**
     * Extrae y retorna el último delta registrado.
     * Tiempo: O(1)
     */
    pop() {
        if (this.estaVacia()) return null;      // Pila vacía: no hay nada que revertir
        const nodoExtraido = this.tope;
        this.tope = this.tope.siguiente;        // El tope baja un nivel
        nodoExtraido.siguiente = null;          // Corta la referencia para el Garbage Collector
        this.tamano--;
        return nodoExtraido;
    }

    /** Retorna el tope sin extraerlo. Tiempo: O(1) */
    peek() {
        return this.tope;
    }

    /** Indica si la pila no contiene deltas. Tiempo: O(1) */
    estaVacia() {
        return this.tamano === 0;
    }
}

module.exports = { NodoDelta, PilaTransaccional };