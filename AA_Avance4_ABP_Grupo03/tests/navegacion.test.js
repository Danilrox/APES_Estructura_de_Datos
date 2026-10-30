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
  // INTEGRANTE 4: pegar aquí las pruebas 4 (eliminación de nodo intermedio)
  // y 5 (casos límite con lista vacía).
  // --------------------------------------------------------------------------
});