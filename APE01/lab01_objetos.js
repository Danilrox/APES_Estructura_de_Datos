const { getMemoryUsage } = require('./profiler');
const N = 1000000;

const memoriaInicial = getMemoryUsage();

class CoordenadaObj {
  constructor(lat, lng) {
    this.lat = lat;
    this.lng = lng;
  }
}

let coordenadas = [];
for (let i = 0; i < N; i++) {
  coordenadas.push(new CoordenadaObj(i * 0.1, i * -0.1));
}

const memoriaFinal = getMemoryUsage();

// ESTAS LÍNEAS SON OBLIGATORIAS PARA QUE SE IMPRIMA EN CONSOLA:
console.log(`[Enfoque Objetos] Memoria inicial: ${memoriaInicial} MB`);
console.log(`[Enfoque Objetos] Memoria final: ${memoriaFinal} MB`);
console.log(`[Enfoque Objetos] Consumo Neto: ${memoriaFinal - memoriaInicial} MB`);