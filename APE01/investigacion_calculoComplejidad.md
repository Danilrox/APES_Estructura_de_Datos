# **Tarea 4: Investigación y Cálculo de Complejidad**

## **Basado en los resultados, el estudiante debe aplicar ABI para investigar el porqué de la diferencia matemática**

1. **Busque en la documentación oficial de V8 cómo se empaquetan las propiedades en los Hidden Classes de JavaScript.**

V8 distingue principalmente entre propiedades nombradas y propiedades indexadas, como las de un array. Para las propiedades nombradas existen diferentes formas de almacenamiento:

**In-object properties:** se almacenan directamente dentro del objeto y proporcionan el acceso más rápido.
F**ast properties:** se almacenan en un properties store. El DescriptorArray de la Hidden Class indica dónde encontrar cada propiedad.
**Slow properties:** cuando un objeto cambia mucho, por ejemplo agregando y eliminando muchas propiedades, V8 puede utilizar un diccionario de propiedades. Esta representación es más flexible, pero normalmente menos eficiente para el acceso.

2. **Calcule teóricamente en LaTeX el espacio asintótico. Sabiendo que un Float64 pesa 8 bytes, demuestre por qué.**

## Espacio asintótico

Cada instancia de `CoordenadaObj` contiene dos valores numéricos: `lat` y `lng`. Para el cálculo teórico se considera que cada valor es un `Float64`, el cual ocupa 8 bytes.

Por lo tanto, el espacio necesario para almacenar una coordenada es:

$$
M_{\text{coordenada}} = 8 + 8 = 16\text{ bytes}
$$

Si se almacenan $N$ coordenadas, el espacio total requerido para los valores numéricos es:

$$
M(N) = 16N\text{ bytes}
$$

Para el caso del laboratorio, donde:

$$
N = 1\,000\,000
$$

se obtiene:

$$
M(1\,000\,000) = 16(1\,000\,000)
$$

$$
M(1\,000\,000) = 16\,000\,000\text{ bytes}
$$

Por lo tanto, considerando únicamente los dos valores `Float64` de cada coordenada, el espacio crece linealmente con respecto al número de elementos.

En términos de complejidad espacial:

$$
\boxed{M(N) = \Theta(N)}
$$

También puede expresarse como:

$$
M(N) \in O(N)
$$

Esto significa que, al aumentar el número de coordenadas, el espacio necesario aumenta proporcionalmente. El factor constante de 16 bytes no modifica el orden asintótico.

> **Nota:** este cálculo es teórico y considera únicamente los 16 bytes correspondientes a los dos valores `Float64` de cada coordenada. El consumo de memoria obtenido mediante `process.memoryUsage()` puede ser mayor, debido a la memoria adicional utilizada por los objetos de JavaScript, el arreglo que los almacena y las estructuras internas del motor V8.
