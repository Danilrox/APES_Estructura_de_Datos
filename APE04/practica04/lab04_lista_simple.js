// Tarea 1: Implementación del TDA Lista Enlazada

// Nodo: la unidad básica de memoria dinámica
class Nodo {
  constructor(dato) {
    this.dato = dato;        // Carga útil (la coordenada)
    this.siguiente = null;   // Puntero al siguiente nodo (referencia)
  }
}

// Lista simple enlazada: solo recuerda dónde está la cabeza
class ListaSatelital {
  constructor() {
    this.cabeza = null;      // Primer elemento de la lista (null = lista vacía)
    this.tamaño = 0;         // Contador de nodos
  }

  // Insertar al inicio: complejidad O(1)
  prepend(dato) {
    const nuevoNodo = new Nodo(dato);   // 1. se crea el nodo nuevo
    if (!this.cabeza) {                 // 2. si la lista está vacía...
      this.cabeza = nuevoNodo;          //    ...el nuevo nodo es la cabeza
    } else {
      nuevoNodo.siguiente = this.cabeza; // 3. el nuevo apunta a la antigua cabeza
      this.cabeza = nuevoNodo;           // 4. la cabeza pasa a ser el nuevo
    }
    this.tamaño++;                      // 5. se actualiza el contador
  }

  // Tarea 3: recorrido secuencial O(n), imprime solo los primeros 'limite' nodos
  imprimirPrimeros(limite) {
    let actual = this.cabeza;           // empieza en la cabeza
    let contador = 0;                   // cuántos nodos se han impreso
    let salida = "";                    // texto acumulado
    while (actual && contador < limite) {   // mientras haya nodo y no se pase del límite
      salida += `[ID: ${actual.dato.id}] -> `;
      actual = actual.siguiente;        // avanza siguiendo el puntero
      contador++;
    }
    console.log(salida + "NULL");       // NULL marca el final
  }
}

// Exporta la clase para usarla en otro archivo
module.exports = { ListaSatelital };
