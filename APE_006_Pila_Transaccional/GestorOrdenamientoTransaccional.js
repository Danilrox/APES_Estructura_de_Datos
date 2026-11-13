const { PilaTransaccional } = require('./PilaTransaccional');

/**
 * Mantiene N registros ordenados ascendentemente por watts y registra
 * cada mutación en una pila transaccional para poder deshacer lotes.
 */
class GestorOrdenamientoTransaccional {
    constructor(datosIniciales) {
        // Copia profunda de cada registro para no alterar el dataset base entre réplicas
        this.registros = datosIniciales
            .map(r => ({ ...r }))
            .sort((a, b) => a.watts - b.watts);
        this.pilaUndo = new PilaTransaccional(); // Historial de deltas para Undo
    }

    /**
     * Actualiza un registro y lo reubica localmente (paso de inserción),
     * registrando cada cambio como delta en la pila.
     */
    actualizarConRegistroDelta(indiceObjetivo, nuevoWatts, loteId) {
        // Registra el cambio directo del valor
        const valorPrevio = this.registros[indiceObjetivo].watts;
        this.pilaUndo.push(indiceObjetivo, valorPrevio, nuevoWatts, loteId);
        this.registros[indiceObjetivo].watts = nuevoWatts;

        // Desplaza el registro hacia la izquierda mientras el anterior sea mayor
        let i = indiceObjetivo;
        while (i > 0 && this.registros[i - 1].watts > this.registros[i].watts) {
            const temp = this.registros[i];

            // Registra los dos valores que cambian en el intercambio
            this.pilaUndo.push(i, this.registros[i].watts, this.registros[i - 1].watts, loteId);
            this.pilaUndo.push(i - 1, this.registros[i - 1].watts, temp.watts, loteId);

            // Intercambio de posiciones
            this.registros[i] = this.registros[i - 1];
            this.registros[i - 1] = temp;
            i--;
        }
    }

    /**
     * Estrategia A: revierte los m deltas del lote con pop() en O(m),
     * sin re-ordenar la colección completa.
     */
    deshacerLoteTransaccional(loteId) {
        let operacionesRevertidas = 0;
        // Extrae deltas mientras el tope pertenezca al lote fallido
        while (!this.pilaUndo.estaVacia() && this.pilaUndo.peek().loteId === loteId) {
            const delta = this.pilaUndo.pop();
            this.registros[delta.indice].watts = delta.estadoAnterior; // Restaura valor previo
            operacionesRevertidas++;
        }
        return operacionesRevertidas;
    }

    /**
     * Estrategia B: re-procesamiento completo con sort (TimSort) en O(N log N).
     */
    reprocesarOrdenamientoCompleto() {
        this.registros.sort((a, b) => a.watts - b.watts);
    }
}

module.exports = GestorOrdenamientoTransaccional;