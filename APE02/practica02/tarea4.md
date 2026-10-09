# Tarea 4: Análisis matemático de rendimiento (ABI)

**Asignatura:** Estructura de Datos · **Práctica 02:** acceso secuencial y aleatorio a archivos con métricas de I/O
**Estudiante:** Domenica Narvaez

**Qué pide la tarea:** (1) demostrar con notación de orden asintótico por qué la lectura bloqueante impone $S(n)=O(n)$ frente al enfoque con *Streams* $S(n)=O(1)$, y (2) relacionar la respuesta con el uso energético del servidor.

---

## 1. Resultados que se van a explicar

Archivo `coordenadas_masivas.csv` con $N = 10^6$ registros (`Total registros` = 1 000 001, porque incluye la línea de cabecera). Resultados de mi ejecución:

| Enfoque | Archivo | Tiempo (s) | Consumo neto de RAM (MB) |
|---|---|---|---|
| Lectura síncrona | `lab02_lectura_sync.js` | 0,15 | 64,82 |
| Lectura con Streams | `lab02_lectura_stream.js` | 0,14 | 0,50 |

Peso del archivo en disco (salida de `lab02_generador.js`): 26,86 MB.

La RAM neta de la lectura síncrona es unas 130 veces la de los streams (64,82 / 0,50), y el tiempo es prácticamente el mismo. El valor de 0,50 MB está al nivel del ruido de la medición, así que debe leerse como "cercano a cero". La demostración siguiente explica ambos hechos.

---

## 2. Demostración asintótica

Notación: $n$ es el tamaño del archivo en bytes; como cada registro ocupa una cantidad acotada de bytes, $n=\Theta(N)$. $B$ es el tamaño de cada fragmento (*chunk*) de lectura: en `fs.createReadStream` el valor por defecto de `highWaterMark` es 64 KiB [3]. $S(n)$ es la memoria máxima que el programa mantiene viva.

### 2.1 Lectura bloqueante: $S(n)=O(n)$ (de hecho, $\Theta(n)$)

1. `fs.readFileSync(FILE_NAME, 'utf-8')` devuelve **una sola cadena** con todo el contenido. Su longitud es del orden de $n$ caracteres, así que mientras exista ocupa al menos $n$ bytes: $S(n)=\Omega(n)$.
2. `data.split('\n')` crea un arreglo con $m=N+1$ líneas. Cada línea cuesta como máximo una constante $c_L$ de bytes (la referencia y, a lo sumo, un objeto cadena acotado). Como $m\le n$, este aporte es $\le c_L\,m=O(n)$.
3. `data` y `lineas` siguen siendo alcanzables hasta el final del programa, así que coexisten en el punto de máxima memoria:

$$
n \;\le\; S_{\text{sync}}(n) \;\le\; n + c_L\,m \;\le\; (1+c_L)\,n \quad\Longrightarrow\quad S_{\text{sync}}(n)=O(n)\ \text{y además}\ \Omega(n),\ \text{es decir}\ \Theta(n). \qquad \blacksquare
$$

**Contraste con lo medido:** 64,82 MB crece con el tamaño del archivo, como predice $\Theta(n)$. Si se compara con el peso del archivo (26,86 MB), $S_{\text{sync}}/n \approx 64{,}82/26{,}86 \approx 2{,}4$: una constante mayor que 1, porque además de la cadena completa están las 1 000 001 líneas.

### 2.2 Lectura con Streams: $S(n)=O(1)$

Sea $k$ el número de fragmentos recibidos hasta el momento. Al terminar de procesar cada fragmento, el programa conserva únicamente `totalRegistros`, un número entero: **estado de tamaño $O(1)$**.

1. Cada `chunk` mide como máximo $B$ bytes, así que su cadena ocupa $O(B)$.
2. `chunk.match(/\n/g)` crea un arreglo temporal con a lo sumo $B$ elementos, es decir $O(B)$. Tanto el fragmento como ese arreglo dejan de ser alcanzables al terminar el *callback* `on('data')`, así que el recolector de basura puede liberarlos antes de que lleguen los siguientes.
3. En cualquier instante la memoria viva es a lo sumo $c_1B+c_2$, con $c_1,c_2$ constantes que **no dependen de $n$**:

$$
S_{\text{stream}}(n)\;\le\;c_1B+c_2\;=\;O(1)\quad(B\ \text{constante}). \qquad \blacksquare
$$

**El resultado es el mismo (inducción sobre $k$).** Sea $s_k$ el valor de `totalRegistros` tras $k$ fragmentos: $s_0=0$ y $s_k=s_{k-1}+(\text{saltos de línea del fragmento }k)$. Entonces $s_k$ cuenta los saltos de línea de los primeros $k$ fragmentos y, al terminar, el total del archivo. Por eso ambos enfoques reportan **1 000 001**.

**Salvedades.** Si el *callback* guardara lo que lee (por ejemplo, `lineas.push(chunk)`), el estado volvería a crecer como $\Theta(n)$ y se perdería el $O(1)$. Y los 0,50 MB medidos incluyen el ruido propio del proceso, no solo el fragmento.

### 2.3 Por qué el tiempo casi no cambia

Ambos enfoques deben leer cada byte una vez, así que $T_{\text{sync}}(n)=T_{\text{stream}}(n)=\Theta(n)$. Los tiempos medidos (0,15 s y 0,14 s) son prácticamente iguales: **la ventaja asintótica de los Streams está en el espacio, no en el tiempo.**

| | $S(n)$ | $T(n)$ | Medido: RAM neta | Medido: tiempo |
|---|---|---|---|---|
| Bloqueante | $\Theta(n)$ | $\Theta(n)$ | 64,82 MB | 0,15 s |
| Streams | $O(1)$ | $\Theta(n)$ | 0,50 MB | 0,14 s |

---

## 3. Mecanismo: *Event Loop* y *thread pool* de libuv

- Node.js ejecuta el JavaScript en un **Event Loop** (hilo principal) y dispone de un **Worker Pool** (*thread pool*) implementado en libuv para tareas costosas como la E/S de archivos [2].
- Según la guía oficial de Node.js, todas las API del sistema de archivos, excepto `fs.FSWatcher()` y las explícitamente síncronas, usan el *thread pool* de libuv [2]. Su tamaño por defecto es 4 hilos y se puede cambiar con `UV_THREADPOOL_SIZE` (máximo 1024) [1].
- Con Streams, un hilo del *pool* hace la lectura bloqueante del sistema operativo y, al terminar cada fragmento, el *Event Loop* ejecuta el *callback* `on('data')` en el hilo principal [2]. Con `readFileSync`, en cambio, el **hilo principal** espera la lectura completa y el servidor no atiende nada más mientras tanto.

---

## 4. Relación con el uso energético del servidor

**Cadena de razonamiento**

1. Con `readFileSync`, la cadena completa y el millón de líneas permanecen vivos a la vez (64,82 MB). Con Streams, cada fragmento y su arreglo temporal mueren casi enseguida (0,50 MB).
2. El recolector de basura generacional de V8 limpia la generación joven con el *Scavenger*, que **copia los objetos que siguen vivos** y descarta el resto [4]. Su costo depende de cuántos objetos sigan vivos, no de cuánta basura haya. Con Streams casi no hay nada vivo que copiar; con `readFileSync`, sí.
3. Por lo tanto, menos memoria viva no significa necesariamente menos recolecciones, pero sí recolecciones **más baratas** y menos tiempo del procesador dedicado al GC.
4. Menos trabajo del procesador implica, en principio, menor consumo eléctrico. Y como la energía eléctrica consumida se disipa como calor, también menor gasto térmico (inferencia de la física general).

**Respaldo en la literatura.** Hussein et al. midieron la energía de los componentes de un sistema Android y hallaron que el hilo del recolector de basura de su máquina virtual consume una cantidad significativa de energía; cambiar la estrategia de GC redujo la energía total del chip entre un 20 % y un 30 %, a cambio de algo de rendimiento [5]. El estudio es de Android y Java, no de Node.js.

**Límites de esta práctica.** No se midió energía (ni con contadores de potencia ni con vatímetro); se midieron RAM y tiempo. La relación con el consumo energético es, por tanto, una **hipótesis razonable** apoyada en el diseño del GC de V8 y en la literatura, no un resultado medido aquí.

---

## 5. Conclusión

- La lectura bloqueante tiene $S(n)=\Theta(n)$, porque conserva el archivo completo y su lista de líneas (64,82 MB medidos). Los Streams mantienen $S(n)=O(B)=O(1)$ (0,50 MB medidos), con el mismo resultado.
- En tiempo ambos son $\Theta(n)$; lo que cambia es el espacio y el bloqueo del hilo principal.
- Menos memoria viva abarata la recolección de basura, lo que sugiere menos CPU y, por tanto, menor consumo energético del servidor (hipótesis).

---

## Referencias

[1] libuv. (s. f.). *Thread pool work scheduling*. https://docs.libuv.org/en/v1.x/threadpool.html

[2] OpenJS Foundation. (s. f.). *Don't block the Event Loop (or the Worker Pool)*. Node.js. https://nodejs.org/en/guides/dont-block-the-event-loop

[3] OpenJS Foundation. (s. f.). *File system*. Node.js v20.x documentation. https://nodejs.org/docs/latest-v20.x/api/fs.html

[4] Marshall, P. (2019). *Trash talk: the Orinoco garbage collector*. V8. https://v8.dev/blog/trash-talk

[5] Hussein, A., Payer, M., Hosking, A., y Vick, C. A. (2015). *Impact of GC design on power and performance for Android*. SYSTOR 2015, ACM. https://solar.cs.ucl.ac.uk/appoptimization.github.io/publications/HPH2015