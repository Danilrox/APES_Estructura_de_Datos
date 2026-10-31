const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const ListaDobleNavegacion = require('../src/models/ListaDobleNavegacion');

describe('Pruebas Unitarias - Navegación Bidireccional (Avance 4 ABP)', () => {
  let lista;

  beforeEach(() => {
    lista = new ListaDobleNavegacion();
    lista.insertar({ id: 101, accion: 'Cargar Vista A' });
    lista.insertar({ id: 102, accion: 'Filtrar Datos B' });
    lista.insertar({ id: 103, accion: 'Exportar Reporte C' });
  });
  
  test('1. Avance Inicial: Debe iniciar correctamente en el primer nodo', () => {
    assert.equal(lista.obtenerActual().id, 101);
    assert.equal(lista.longitud, 3);
  });
  test('2. Avance Secuencial: Debe desplazarse hacia adelante correctamente', () => {
    assert.equal(lista.avanzar().id, 102);
    assert.equal(lista.avanzar().id, 103);
    assert.equal(lista.avanzar(), null); // Límite superior alcanzado
  });

  test('3. Retroceso Secuencial: Debe navegar hacia atrás y mantener la consistencia', () => {
    lista.avanzar(); // Cursor en 102
    lista.avanzar(); // Cursor en 103
    assert.equal(lista.retroceder().id, 102);
    assert.equal(lista.retroceder().id, 101);
    assert.equal(lista.retroceder(), null); // Límite inferior alcanzado
  });

  // --------------------------------------------------------------------------
  // INTEGRANTE 4: pruebas 4 (eliminación de nodo intermedio)
  // y 5 (casos límite con lista vacía).
    test('4. Eliminación de nodo intermedio: Debe eliminar el nodo actual y reconectar los enlaces', () => {
    lista.avanzar(); // Cursor en el nodo 102

    const nodoEliminado = lista.actual;

    assert.equal(lista.obtenerActual().id, 102);
    assert.equal(lista.eliminarActual(), true);

    // Verificar que el cursor avance al siguiente nodo
    assert.equal(lista.obtenerActual().id, 103);

    // Verificar la longitud y los extremos de la lista
    assert.equal(lista.longitud, 2);
    assert.equal(lista.cabeza.dato.id, 101);
    assert.equal(lista.cola.dato.id, 103);

    // Verificar que los nodos restantes estén correctamente enlazados
    assert.equal(lista.cabeza.siguiente, lista.cola);
    assert.equal(lista.cola.anterior, lista.cabeza);

    // Verificar que el nodo eliminado esté desvinculado
    assert.equal(nodoEliminado.siguiente, null);
    assert.equal(nodoEliminado.anterior, null);
  });

  test('5. Casos límite: Debe controlar la eliminación en listas vacías y con un solo nodo', () => {
    // Caso 1: Lista vacía
    const listaVacia = new ListaDobleNavegacion();

    assert.equal(listaVacia.eliminarActual(), false);
    assert.equal(listaVacia.cabeza, null);
    assert.equal(listaVacia.cola, null);
    assert.equal(listaVacia.actual, null);
    assert.equal(listaVacia.longitud, 0);

    // Caso 2: Lista con un solo nodo
    const listaUnNodo = new ListaDobleNavegacion();
    listaUnNodo.insertar({ id: 201, accion: 'Único registro' });

    const nodoUnico = listaUnNodo.actual;

    assert.equal(listaUnNodo.eliminarActual(), true);
    assert.equal(listaUnNodo.cabeza, null);
    assert.equal(listaUnNodo.cola, null);
    assert.equal(listaUnNodo.actual, null);
    assert.equal(listaUnNodo.longitud, 0);

    // Verificar la desvinculación del nodo eliminado
    assert.equal(nodoUnico.siguiente, null);
    assert.equal(nodoUnico.anterior, null);
  });
  // --------------------------------------------------------------------------
});