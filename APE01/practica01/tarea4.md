# APE 01: Micro-TDAs, Abstracción de Datos y Análisis de Memoria en Motores V8

**Autor:** Domenica Narvaez  
**Afiliación:** Carrera de Computación  
**Fecha:** 08/10/2026

---

## 1. Introducción

Esta práctica mide el consumo de memoria al almacenar $N = 10^6$ coordenadas (latitud y longitud) con dos representaciones: un arreglo de objetos y dos arreglos tipados paralelos (`Float64Array`). La medición se realizó con `process.memoryUsage()` en Node.js v20.x.x. Como el programa divide entre $1024^2$, la unidad "MB" de este informe equivale a MiB ($2^{20}$ bytes).

---

## 2. Resultados

En la Tabla 1 se resumen los consumos.

| Enfoque | Heap neto (MB) | ArrayBuffers (MB) | Total aprox. (MB) |
| :--- | :---: | :---: | :---: |
| Arreglo de objetos | $90{,}36$ | $0$ | $90{,}36$ |
| `Float64Array` paralelos | $0{,}32$ | $15{,}26$ | $15{,}26$ |

El arreglo de objetos consume aproximadamente $5{,}9$ veces más memoria que los arreglos tipados. En el enfoque de primitivos el Heap casi no cambia, porque los `Float64Array` guardan sus datos en un bloque contiguo fuera del Heap (`ArrayBuffer`), que `heapUsed` no contabiliza; por eso la comparación justa suma ambos campos. Los valores varían un poco entre ejecuciones y entornos (por ejemplo, al ejecutar desde el depurador de un editor), ya que el Garbage Collector no actúa en un momento fijo y `heapUsed` puede incluir memoria que aún no ha sido liberada.

---

## 3. Investigación: Hidden Classes en V8

JavaScript permite agregar propiedades a un objeto en cualquier momento, así que, sin ayuda, cada objeto tendría que guardar los nombres de sus propiedades. V8 evita este costo con las *hidden classes* (internamente llamadas *Maps*): cada objeto empieza con un puntero a su Map, que describe su estructura, es decir, qué propiedades tiene y en qué posición se guarda cada una. Los objetos creados con el mismo constructor y con las propiedades agregadas en el mismo orden comparten el mismo Map, por lo que los nombres `lat` y `lng` se almacenan una sola vez y no una vez por objeto.

Aun así, cada objeto paga un costo propio. Según la organización interna de V8, un objeto como `CoordenadaObj` contiene un puntero al Map, un puntero a su almacén de propiedades adicionales, un puntero a sus elementos indexados y un espacio para cada propiedad definida en el constructor. Además, `lat` y `lng` son números decimales: no caben en la representación directa de los enteros pequeños, por lo que suelen almacenarse como objetos *HeapNumber* separados dentro del Heap. A esto se suma la referencia que el arreglo guarda hacia cada objeto. La Tabla 2 resume la estimación para un sistema de 64 bits sin compresión de punteros.

| Componente por coordenada | Bytes (estimado) |
| :--- | :---: |
| Encabezado del objeto (Map, propiedades, elementos) | $24$ |
| Dos campos (`lat`, `lng`) | $16$ |
| Dos *HeapNumber* ($16$ bytes cada uno) | $32$ |
| Referencia dentro del arreglo | $8$ |
| **Total estimado** | $\approx 80$ |
| **Total medido ($c$)** | $\approx 95$ |

La diferencia entre lo estimado y lo medido se atribuye, principalmente, a que el arreglo reserva más capacidad de la necesaria al crecer con `push` y a la alineación de la memoria. La estimación es aproximada y puede variar según la versión de V8.

Otro efecto es el trabajo del Garbage Collector: debe recorrer cada uno de los $10^6$ objetos vivos para marcarlos, mientras que un `Float64Array` es un único objeto cuyo contenido son números sin referencias que recorrer.

---

## 4. Cálculo de la complejidad espacial

Sea $n$ el número de coordenadas. Un `Float64Array` ocupa $8$ bytes por elemento y se usan dos arreglos (latitud y longitud):

$$S_{\text{prim}}(n) = 2 \cdot 8 \cdot n + O(1) = 16\,n + O(1) \text{ bytes}$$

Para $n = 10^6$:

$$S_{\text{prim}}(10^6) = 16 \times 10^6 \text{ bytes} = \frac{16 \times 10^6}{1024^2} \approx 15{,}26 \text{ MB}$$

En el enfoque de objetos, cada coordenada cuesta $c$ bytes (encabezado, campos, *HeapNumber* y referencia), y los Maps se comparten, por lo que aportan un término constante:

$$S_{\text{obj}}(n) = c \cdot n + O(1) \text{ bytes}, \qquad c = \frac{M_{\text{obj}} \cdot 1024^2}{n} \approx 95 \text{ bytes}$$

Ambas representaciones crecen de forma lineal:

$$S_{\text{prim}}(n) \in \Theta(n), \qquad S_{\text{obj}}(n) \in \Theta(n)$$

La diferencia no está en el orden de crecimiento sino en la constante multiplicativa:

$$\frac{S_{\text{obj}}(n)}{S_{\text{prim}}(n)} \longrightarrow \frac{c}{16} \approx \frac{95}{16} \approx 5{,}9$$

Esto coincide con lo medido (Tabla 1). En la notación asintótica la constante se omite, pero en memoria real determina si el programa cabe en el entorno: con objetos, $10^6$ coordenadas ya ocupan cerca de $90{,}36$ MB, y el costo crece de forma proporcional con $n$.

---

## 5. Conclusiones

- Representar $10^6$ coordenadas como objetos consume alrededor de $5{,}9$ veces más memoria que usar `Float64Array` paralelos, aunque ambos enfoques sean $\Theta(n)$. La causa está en la representación física: cada objeto añade encabezado, valores empaquetados y una referencia, mientras que el arreglo tipado guarda solo los números en un bloque contiguo.
- La medición con `heapUsed` por sí sola subestima el enfoque de arreglos tipados, porque sus datos viven fuera del Heap; por eso conviene medir también `arrayBuffers`.
- Elegir la estructura adecuada es una decisión de diseño que impacta la memoria y el trabajo del Garbage Collector, y no una limitación del intérprete de JavaScript.

---

## 6. Bibliografía

- Node.js Documentation: `process.memoryUsage()`.
- V8 Dev Blog: *Hidden Classes and Inline Caches*.
- MDN Web Docs: *Memory Management*.
