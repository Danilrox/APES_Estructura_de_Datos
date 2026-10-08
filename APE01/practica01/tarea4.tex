\documentclass[11pt]{article}
% -- Formato (formato.tex del profesor, debe estar en la misma carpeta)
\input{formato}

% -- Paquetes adicionales
\usepackage{amsmath,amssymb}
\usepackage{enumitem}

% -- Comandos extra
% ===================================================================
% >>> REEMPLAZA ESTOS VALORES CON LOS DE TU COMPUTADORA <<<
% (son los que imprime la consola al ejecutar cada archivo)
% Usa {,} para la coma decimal: 90{,}36
% ===================================================================
\newcommand{\nodever}{v20.x.x}    % salida de: node -v
\newcommand{\mObj}{90{,}36}       % Consumo Neto del enfoque Objetos (MB)
\newcommand{\mHeapPrim}{0{,}32}   % Consumo Neto (Heap) del enfoque Primitivos (MB)
\newcommand{\mBufPrim}{15{,}26}   % Consumo en ArrayBuffers del enfoque Primitivos (MB)
\newcommand{\cObj}{95}            % bytes por objeto = mObj * 1048576 / 1000000
\newcommand{\razon}{5{,}9}        % mObj / mBufPrim

% -- Datos
\title{APE 01: Micro-TDAs, Abstracción de Datos y Análisis de Memoria en Motores V8}
\author{Domenica Narvaez}
\affil{Carrera de Computación}
\date{\today}

% --- Archivo de bibliografía
\addbibresource{APE01_Referencias.bib}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\begin{document}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\maketitle
\thispagestyle{fancy}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\section{Introducción}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

Esta práctica mide el consumo de memoria al almacenar $N = 10^6$ coordenadas (latitud y longitud) con dos representaciones: un arreglo de objetos y dos arreglos tipados paralelos (\texttt{Float64Array}). La medición se realizó con \texttt{process.memoryUsage()} en Node.js \nodever{} \parencite{nodememory}. Como el programa divide entre $1024^2$, la unidad ``MB'' de este informe equivale a MiB ($2^{20}$ bytes).

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\section{Resultados}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

En la Tabla \ref{tab:resultados} se resumen los consumos.

% ----- Capturas de pantalla (copia tus imágenes a esta carpeta y quita los %) -----
% \begin{figure}[H]
%     \centering
%     \includegraphics[width=0.8\textwidth]{captura_objetos.png}
%     \caption{Ejecución de \texttt{lab01\_objetos.js}.}
%     \label{fig:objetos}
% \end{figure}
%
% \begin{figure}[H]
%     \centering
%     \includegraphics[width=0.8\textwidth]{captura_primitivos.png}
%     \caption{Ejecución de \texttt{lab01\_primitivos.js}.}
%     \label{fig:primitivos}
% \end{figure}

\begin{table}[H]
    \centering\small
    \begin{tabular}{@{}lccc@{}}
    \toprule
        \textbf{Enfoque} & \textbf{Heap neto (MB)} & \textbf{ArrayBuffers (MB)} & \textbf{Total aprox. (MB)} \\
    \midrule
        Arreglo de objetos & \mObj & 0 & \mObj \\
        \texttt{Float64Array} paralelos & \mHeapPrim & \mBufPrim & \mBufPrim \\
    \bottomrule
    \end{tabular}
    \caption{Consumo de memoria para $N = 10^6$ coordenadas.}
    \label{tab:resultados}
\end{table}

El arreglo de objetos consume aproximadamente \razon{} veces más memoria que los arreglos tipados. En el enfoque de primitivos el Heap casi no cambia, porque los \texttt{Float64Array} guardan sus datos en un bloque contiguo fuera del Heap (\texttt{ArrayBuffer}), que \texttt{heapUsed} no contabiliza; por eso la comparación justa suma ambos campos. Los valores varían un poco entre ejecuciones y entornos (por ejemplo, al ejecutar desde el depurador de un editor), ya que el Garbage Collector no actúa en un momento fijo y \texttt{heapUsed} puede incluir memoria que aún no ha sido liberada.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\section{Investigación: Hidden Classes en V8}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

JavaScript permite agregar propiedades a un objeto en cualquier momento, así que, sin ayuda, cada objeto tendría que guardar los nombres de sus propiedades. V8 evita este costo con las \textit{hidden classes} (internamente llamadas \textit{Maps}): cada objeto empieza con un puntero a su Map, que describe su estructura, es decir, qué propiedades tiene y en qué posición se guarda cada una. Los objetos creados con el mismo constructor y con las propiedades agregadas en el mismo orden comparten el mismo Map, por lo que los nombres \texttt{lat} y \texttt{lng} se almacenan una sola vez y no una vez por objeto \parencite{v8hidden}.

Aun así, cada objeto paga un costo propio. Según la organización interna de V8, un objeto como \texttt{CoordenadaObj} contiene un puntero al Map, un puntero a su almacén de propiedades adicionales, un puntero a sus elementos indexados y un espacio para cada propiedad definida en el constructor. Además, \texttt{lat} y \texttt{lng} son números decimales: no caben en la representación directa de los enteros pequeños, por lo que suelen almacenarse como objetos \textit{HeapNumber} separados dentro del Heap. A esto se suma la referencia que el arreglo guarda hacia cada objeto \parencite{mdnmemory}. La Tabla \ref{tab:estimacion} resume la estimación para un sistema de 64 bits sin compresión de punteros.

\begin{table}[H]
    \centering\small
    \begin{tabular}{@{}lc@{}}
    \toprule
        \textbf{Componente por coordenada} & \textbf{Bytes (estimado)} \\
    \midrule
        Encabezado del objeto (Map, propiedades, elementos) & 24 \\
        Dos campos (\texttt{lat}, \texttt{lng}) & 16 \\
        Dos \textit{HeapNumber} (16 bytes cada uno) & 32 \\
        Referencia dentro del arreglo & 8 \\
    \midrule
        Total estimado & $\approx 80$ \\
        Total medido ($c$) & $\approx \cObj$ \\
    \bottomrule
    \end{tabular}
    \caption{Estimación del costo por objeto frente a la medición.}
    \label{tab:estimacion}
\end{table}

La diferencia entre lo estimado y lo medido se atribuye, principalmente, a que el arreglo reserva más capacidad de la necesaria al crecer con \texttt{push} y a la alineación de la memoria. La estimación es aproximada y puede variar según la versión de V8.

Otro efecto es el trabajo del Garbage Collector: debe recorrer cada uno de los $10^6$ objetos vivos para marcarlos, mientras que un \texttt{Float64Array} es un único objeto cuyo contenido son números sin referencias que recorrer \parencite{mdnmemory,nodememory}.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\section{Cálculo de la complejidad espacial}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

Sea $n$ el número de coordenadas. Un \texttt{Float64Array} ocupa 8 bytes por elemento y se usan dos arreglos (latitud y longitud):
\begin{equation}
    S_{\text{prim}}(n) = 2 \cdot 8 \cdot n + O(1) = 16\,n + O(1) \ \text{bytes}
\end{equation}
Para $n = 10^6$:
\begin{equation}
    S_{\text{prim}}(10^6) = 16 \times 10^6 \ \text{bytes} = \frac{16 \times 10^6}{1024^2} \approx 15{,}26 \ \text{MB}
\end{equation}
En el enfoque de objetos, cada coordenada cuesta $c$ bytes (encabezado, campos, \textit{HeapNumber} y referencia), y los Maps se comparten, por lo que aportan un término constante:
\begin{equation}
    S_{\text{obj}}(n) = c \cdot n + O(1) \ \text{bytes}, \qquad c = \frac{M_{\text{obj}} \cdot 1024^2}{n} \approx \cObj \ \text{bytes}
\end{equation}
Ambas representaciones crecen de forma lineal:
\begin{equation}
    S_{\text{prim}}(n) \in \Theta(n), \qquad S_{\text{obj}}(n) \in \Theta(n)
\end{equation}
La diferencia no está en el orden de crecimiento sino en la constante multiplicativa:
\begin{equation}
    \frac{S_{\text{obj}}(n)}{S_{\text{prim}}(n)} \longrightarrow \frac{c}{16} \approx \frac{\cObj}{16} \approx \razon
\end{equation}
Esto coincide con lo medido (Tabla \ref{tab:resultados}). En la notación asintótica la constante se omite, pero en memoria real determina si el programa cabe en el entorno: con objetos, $10^6$ coordenadas ya ocupan cerca de \mObj{} MB, y el costo crece de forma proporcional con $n$.

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\section{Conclusiones}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\begin{itemize}[leftmargin=*]
\item
    Representar $10^6$ coordenadas como objetos consume alrededor de \razon{} veces más memoria que usar \texttt{Float64Array} paralelos, aunque ambos enfoques sean $\Theta(n)$. La causa está en la representación física: cada objeto añade encabezado, valores empaquetados y una referencia, mientras que el arreglo tipado guarda solo los números en un bloque contiguo.

\item
    La medición con \texttt{heapUsed} por sí sola subestima el enfoque de arreglos tipados, porque sus datos viven fuera del Heap; por eso conviene medir también \texttt{arrayBuffers}.

\item
    Elegir la estructura adecuada es una decisión de diseño que impacta la memoria y el trabajo del Garbage Collector, y no una limitación del intérprete de JavaScript.
\end{itemize}

%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
\section{Bibliografía}
%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

\printbibliography[heading=none]

\end{document}
