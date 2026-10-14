# Tarea 4: Análisis Matemático de Rendimiento (ABI)

**Asignatura:** Estructura de Datos, Unidad 1
**Práctica:** APE02, lectura síncrona vs. lectura por streams en Node.js

---

## 1. Definiciones

| Símbolo | Significado |
|---|---|
| **n** | Tamaño de la entrada: número de registros del archivo (n = 1.000.001) |
| **T(n)** | Tiempo de respuesta en función de n |
| **S(n)** | Impacto en memoria (espacio RAM usado) en función de n |
| **O(n)** | Crecimiento lineal: lectura síncrona (bloqueante), `fs.readFileSync` |
| **O(1)** | Crecimiento constante: lectura asíncrona con streams, `fs.createReadStream` |

Por definición de notación asintótica, **S(n) = O(g(n))** si existen constantes c > 0 y n₀ tales que S(n) ≤ c·g(n) para todo n ≥ n₀.

---

## 2. Resultados empíricos de la práctica

El generador creó un archivo de **1.000.000 de registros** (1.000.001 líneas leídas, incluida la cabecera), con un peso en disco de **26,86 MB**. Por tanto, cada registro pesa aproximadamente:

```
r = 26,86 MB / 10⁶ ≈ 28 bytes por registro
```

| Método | Registros | Tiempo | RAM neta |
|---|---|---|---|
| Lectura síncrona (`readFileSync`) | 1.000.001 | 0,08 s (I/O + parsing) | **64,77 MB** |
| Lectura por stream (`createReadStream`) | 1.000.001 | 0,03 s (I/O parcializado) | **1,20 MB** |

La versión síncrona consume ≈ 2,4 veces el tamaño del archivo (64,77 / 26,86). La versión por stream consume ≈ 54 veces menos RAM (64,77 / 1,20).

> **Nota metodológica:** el tiempo del stream (0,03 s) mide solo el I/O parcializado, mientras que el de la versión síncrona incluye también el parsing. Por eso no son directamente comparables, y la conclusión principal de este análisis se apoya en la **memoria**, no en el tiempo.

---

## 3. Demostración: por qué la función bloqueante impone S(n) = O(n)

`fs.readFileSync` debe cargar el archivo **completo** antes de devolver el control al programa. El proceso es:

1. Se reserva un `Buffer` con todo el contenido del archivo: **r·n bytes**.
2. El `Buffer` se convierte en un `string` (una segunda copia del contenido).
3. Se divide el texto con `split('\n')`, creando un arreglo con **n cadenas**, cada una con su sobrecarga de objeto en V8.
4. Todas estas estructuras permanecen en memoria al mismo tiempo mientras se procesan los datos.

Por lo tanto, la memoria utilizada es de la forma:

```
S_sync(n) = α·r·n + β        con α > 1 (copias + sobrecarga de V8) y β constante
```

**Cota superior.** Tomando g(n) = n y c = α·r + 1, se cumple S_sync(n) ≤ c·n para todo n suficientemente grande. Entonces S_sync(n) = O(n).

**Cota inferior.** Como el archivo completo debe residir en memoria, S_sync(n) ≥ r·n, es decir, S_sync(n) = Ω(n).

**Conclusión:** S_sync(n) = **Θ(n)**. La memoria crece de forma proporcional a la cantidad de registros: si n se duplica, la RAM se duplica.

Esto coincide con lo medido: 64,77 MB para n ≈ 10⁶ equivale a ≈ 65 bytes por registro, que es α·r con α ≈ 2,4.

---

## 4. Demostración: por qué el enfoque Stream logra S(n) = O(1)

Un stream no carga el archivo completo. Lo lee en **fragmentos (chunks) de tamaño fijo** c (por defecto, `highWaterMark` = 64 KB en `fs.createReadStream`), y procesa cada fragmento antes de solicitar el siguiente. En cualquier instante, la memoria contiene únicamente:

- un chunk: **c** bytes,
- como máximo una línea incompleta que quedó cortada entre dos chunks: **L** bytes (longitud máxima de una línea, constante e independiente de n),
- un contador de registros y variables auxiliares: **k** bytes.

```
S_stream(n) = c + L + k
```

Ninguno de los tres términos depende de n. Existe entonces una constante C = c + L + k tal que S_stream(n) ≤ C para todo n. Por definición:

```
S_stream(n) = O(1)
```

El mecanismo de **backpressure** garantiza esta cota: si el consumidor procesa más lento de lo que el disco entrega, el stream pausa la lectura en lugar de acumular datos en memoria.

Los 1,20 MB medidos corresponden al término constante (el runtime, el chunk y las variables). Para n = 10⁷, el stream seguiría usando ≈ 1,2 MB, mientras que la versión síncrona necesitaría ≈ 650 MB.

### Proyección de la memoria según n

| Registros (n) | Síncrona: O(n) | Stream: O(1) |
|---|---|---|
| 10⁶ | ≈ 65 MB | ≈ 1,2 MB |
| 10⁷ | ≈ 650 MB | ≈ 1,2 MB |
| 10⁸ | ≈ 6,5 GB | ≈ 1,2 MB |

---

## 5. Diseño del bus de datos y el Thread Pool (libuv)

### Componentes involucrados

- **V8:** motor que ejecuta el código JavaScript y administra el heap y el recolector de basura.
- **libuv:** biblioteca en C que provee el *event loop* y el *Thread Pool* para la E/S asíncrona.
- **Módulos del núcleo de Node (`fs`, `stream`):** conectan el código JS con libuv mediante *bindings* en C++.

### Ruta de los datos

```
Disco → (DMA) → Memoria RAM → buffer de c bytes → callback en JS (V8)
```

El **bus de datos** transporta la información entre el disco y la RAM. Con **DMA** (*Direct Memory Access*), el controlador del disco escribe en memoria sin ocupar la CPU, lo que permite que el procesador atienda otras tareas durante la transferencia.

### Lectura síncrona

`fs.readFileSync` ejecuta la llamada de sistema en el **hilo principal**. Durante todo T(n), el event loop queda bloqueado: el servidor no puede atender ninguna otra petición. Además, el archivo completo debe estar en RAM antes de continuar.

### Lectura por stream

`fs.createReadStream` delega la lectura de cada chunk al **Thread Pool de libuv** (4 hilos por defecto, configurable con `UV_THREADPOOL_SIZE`):

1. El hilo principal solicita un chunk y queda **libre**.
2. Un hilo del pool realiza la lectura bloqueante del disco en segundo plano.
3. Al terminar, libuv notifica al **event loop**.
4. El callback procesa el chunk en el hilo principal y se solicita el siguiente.

El resultado es un *pipeline* de tamaño acotado: el bloqueo del event loop es de orden O(c) = O(1) por chunk, en lugar de O(n) para la lectura completa.

### Aclaración sobre el tiempo

En **tiempo total**, ambos enfoques son T(n) = O(n), porque los dos deben recorrer los n registros. La ventaja del stream no está en el tiempo total, sino en:

1. **Memoria:** O(1) frente a O(n).
2. **Latencia del event loop:** bloqueos cortos y acotados frente a un bloqueo prolongado.

---

## 6. Relación con el uso energético del servidor

> *Menos RAM implica menos recolección de basura y menor gasto térmico del procesador.*

**a) Recolección de basura (V8).**
V8 usa un recolector generacional. Los chunks del stream son objetos pequeños de vida corta: mueren en la generación joven y se limpian con *scavenges* baratos. En cambio, el `Buffer`, el `string` y el arreglo de un millón de cadenas de la lectura síncrona son objetos grandes y de larga vida que pasan a la generación vieja, donde se requieren ciclos *mark-sweep/compact* cuyo costo crece con el tamaño del heap vivo, es decir, **O(n)**.

**b) Uso de CPU y consumo energético.**
Más trabajo de GC implica más ciclos de CPU, más pausas *stop-the-world* y mayor utilización sostenida del procesador. La potencia dinámica de un procesador es proporcional a la actividad: `P ∝ C·V²·f·actividad`. Mayor actividad significa mayor consumo eléctrico y mayor disipación de calor. Con S(n) = O(1), el heap se mantiene pequeño y estable, y el GC trabaja muy poco.

**c) Escalabilidad con peticiones concurrentes.**
Con k peticiones simultáneas, el servidor síncrono necesita **k·r·n** bytes (riesgo de uso de swap o error *out of memory*), mientras que el de streams necesita solo **k·c** bytes, independiente del tamaño de los datos.

---

## 7. Conclusión

La lectura síncrona (`readFileSync`) tiene una complejidad espacial **Θ(n)** y bloquea el event loop durante toda la operación, porque necesita cargar el archivo completo en memoria. La lectura por streams (`createReadStream`) mantiene una complejidad espacial **O(1)**, ya que procesa fragmentos de tamaño fijo cuya lectura se delega al Thread Pool de libuv, y el backpressure impide que la memoria crezca con n.

Aunque el tiempo total sigue siendo O(n) en ambos casos, el enfoque por streams redujo el consumo de RAM de 64,77 MB a 1,20 MB (≈ 54 veces menos), evita pausas largas del event loop y disminuye la presión sobre el recolector de basura. Esto se traduce en menor uso de CPU, menor gasto energético y térmico, y mayor capacidad de escalar a archivos grandes y a múltiples peticiones concurrentes.

---

## Referencias

- libuv. *Design overview*. https://docs.libuv.org/en/v1.x/design.html
- libuv. *Thread pool work scheduling*. https://docs.libuv.org/en/v1.x/threadpool.html
- Node.js. *Don't Block the Event Loop (or the Worker Pool)*. https://nodejs.org/en/learn
- Node.js. *Backpressuring in Streams*. https://nodejs.org/en/learn
- Node.js. *Stream API documentation*. https://nodejs.org/api/stream.html
- Marathe, N. *An Introduction to libuv*. https://nikhilm.github.io/uvbook/
- Stallings, W. *Computer Organization and Architecture*. Pearson.
- Casciaro, M. *Node.js Design Patterns*. Packt.
