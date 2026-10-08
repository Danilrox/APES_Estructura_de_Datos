Autor: Dario CHillogallo
# **Tarea 4: Análisis Matemático de Rendimiento**

1. **Demuestre 	teóricamente (utilizando notación de orden asintótico) por qué 	la función bloqueante impone  S(n) = O(n)  	frente al enfoque Stream S(n) = 0(1)**

## **A. Lectura síncrona -> S(n) = O(n)**
En la tarea 2 se uso:
    const data = fs.readFileSync(FILE_NAME, 'utf-8');
    const lineas = data.split('\n');

Se entiende que:
n = tamaño del archivo
S(n) = memoria adicional necesitada por el algoritmo en funcion del tamaño de entrada

**Primera operación**
    const data = fs.readFileSync(FILE_NAME, 'utf-8');
Se carga todo en una cadena, por tanto el espacio requerido para esta representación es proprocional al tamaño de entrada

    S(n) = O(n)

**Segunda operación**
    const lineas = data.split('\n');

Crea un arreglo con lineas del archivo, en el peor caso, el arreglo contiende cantidad de elemtnos proporcional al tamaño de la entrada, por lo que la estructura podra requerir espacio adicional O(n)

**Por lo tanto**
considerando ambas representaciones, el espacio auciliar esta acotado por:
S(n) = O(n) + O(n)

## **B. Lectura mediante Stream: S(n) = O(1)**

En la tarea 3 se uso:
    const readableStream = fs.createReadStream(
        FILE_NAME,
        { encoding: 'utf-8' }
    );

    readableStream.on('data', (chunk) => {
        let lineBreakCount = (chunk.match(/\n/g) || []).length;
        totalRegistros += lineBreakCount;
    });

Procesa el archivo progresivamente el contenido en una única cadena, podemos definir:
- n: tamaño total del archivo
- k: tamaño ,áximo del fragmento procesado
- S(n): memoria adicional usada

Hay que considerar:
- el Stream recibe fragmentos de datos
- el programa mantiene un contador "totalRegistros", cuyo tamaño ya es acotado para los tamaños de input posibles
- Si el tamaño de cada fragmento esta limitado a un valor fijo, la memoria no crecera proporcionalmente al tamaño total del archivo

Por tanto podemos expresar:

    S(n) = O(1)


2. **Estructure su respuesta relacionándola con el uso energético del servidor (menos RAM implica menor recolección de basura y menor gasto térmico del procesador).**

**Consumo de memoria:**
la lectura síncrona almacena el contenido completo, en cambio stream procesa fragmentos, por ello el segundo enfoque puede reducir la cantidad de memoria requerida para procesar archivos grandes

**Recolección de basura:**
Un procesamiento progresivo puede reducir las asignaciones y la cantidad de datos que deben permanecer vivos simultáneamente. Esto puede disminuir la presión sobre el recolector de basura, aunque el efecto concreto depende de la implementación y de la ejecución.

**Consumo térmico y temperatura**
La gestión de memoria, el procesamiento de datos y la recolección de basura requieren trabajo del procesador, que consume energía y genera calor.

Si una implementación reduce suficientemente ese trabajo, puede disminuir el consumo energético y la generación de calor.

Sin embargo, debemos ser rigurosos: una menor utilización del heap no demuestra por sí sola un menor consumo energético ni una menor temperatura. El resultado depende también del tiempo de ejecución, la actividad del procesador, las operaciones de entrada/salida y otros factores

