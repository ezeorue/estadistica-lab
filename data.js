/* =========================================================================
   Estadística · Laboratorio de práctica
   Banco de contenidos: temas, preguntas y formulario.
   Sin dependencias. Los decimales de las consignas usan coma (es-AR).
   ========================================================================= */

const TOPICS = [
  {
    id: "discretas",
    num: "01",
    name: "Variables aleatorias discretas",
    short: "Discretas",
    desc: "Función de probabilidad y de distribución, proceso de Bernoulli y distribución binomial.",
    source: "Anderson · Cap. V–VI"
  },
  {
    id: "hiperpoisson",
    num: "02",
    name: "Hipergeométrica y Poisson",
    short: "Hiper. y Poisson",
    desc: "Muestreo sin reemplazo, eventos por intervalo, aproximaciones y aplicaciones.",
    source: "Anderson · Cap. V–VI"
  },
  {
    id: "continuas",
    num: "03",
    name: "Variables continuas y normal",
    short: "Continuas",
    desc: "Funciones de densidad, distribución uniforme, normal y normal estandarizada.",
    source: "Anderson · Cap. VII"
  },
  {
    id: "sumas",
    num: "04",
    name: "Sumas y Teorema Central del Límite",
    short: "Sumas y TCL",
    desc: "Suma de variables aleatorias, medias muestrales y aproximación normal.",
    source: "Anderson · Cap. VII"
  },
  {
    id: "propiedades",
    num: "05",
    name: "Media, varianza y covarianza",
    short: "Media y varianza",
    desc: "Propiedades del valor esperado, la varianza, la covarianza y las carteras.",
    source: "Anderson · Cap. VII"
  },
  {
    id: "indices",
    num: "06",
    name: "Números índices",
    short: "Índices",
    desc: "Índices de precios, cantidades y valor; Laspeyres, Paasche e IPC.",
    source: "Anderson · Cap. XX"
  }
];

/* ------------------------------------------------------------------ */
/* Preguntas                                                           */
/* type: "mc" (opción múltiple) | "num" (respuesta numérica)           */
/* level: 1 básico · 2 intermedio · 3 avanzado                         */
/* ------------------------------------------------------------------ */

const QUESTIONS = [

  /* ============================ 01 · DISCRETAS ==================== */
  {
    id: "d01", topic: "discretas", level: 1, type: "mc",
    prompt: "¿Cuándo una variable aleatoria es discreta?",
    options: [
      "Cuando puede tomar cualquier valor dentro de un intervalo.",
      "Cuando toma un conjunto finito o numerable de valores.",
      "Cuando todos sus valores son enteros positivos.",
      "Cuando su función de distribución es continua."
    ],
    answer: 1,
    explanation: "Una variable discreta cuenta resultados: sus valores se pueden enumerar (0, 1, 2, …), aunque el conjunto sea infinito numerable. No hace falta que sean positivos ni que el recorrido sea finito.",
    formula: "X discreta ⇔ recorrido finito o numerable"
  },
  {
    id: "d02", topic: "discretas", level: 1, type: "mc",
    prompt: "En una distribución de probabilidad discreta, la suma de todas las probabilidades f(x) debe ser igual a:",
    options: ["0", "1", "n", "μ"],
    answer: 1,
    explanation: "La suma de las probabilidades de todos los valores posibles es 1: Σ f(x) = 1. Además, cada probabilidad debe estar entre 0 y 1.",
    formula: "Σ f(x) = 1,  0 ≤ f(x) ≤ 1"
  },
  {
    id: "d03", topic: "discretas", level: 1, type: "num",
    prompt: "Se lanzan tres monedas equilibradas. Sea X el número de caras. Calcula P(X = 2).",
    answer: 0.375, tol: 0.001,
    explanation: "Hay 2³ = 8 resultados equiprobables y C(3,2) = 3 formas de obtener exactamente dos caras. Entonces P(X = 2) = 3/8 = 0,375.",
    formula: "P(X = x) = C(n,x) · pˣ · (1−p)ⁿ⁻ˣ"
  },
  {
    id: "d04", topic: "discretas", level: 1, type: "mc",
    prompt: "¿Cuál de estos conjuntos de probabilidades define una distribución válida para x = 0, 1, 2, 3?",
    options: [
      "0,1; 0,2; 0,3; 0,5",
      "0,1; 0,2; 0,3; 0,4",
      "−0,1; 0,4; 0,4; 0,3",
      "0,2; 0,3; 0,3; 0,4"
    ],
    answer: 1,
    explanation: "Solo la segunda opción cumple las dos condiciones: todas las probabilidades están entre 0 y 1 y suman 1. La primera suma 1,1; la tercera tiene un valor negativo; la cuarta suma 1,2.",
    formula: "0 ≤ f(x) ≤ 1  y  Σ f(x) = 1"
  },
  {
    id: "d05", topic: "discretas", level: 2, type: "num",
    prompt: "Sea X ~ Bin(n = 5; p = 0,3). Calcula P(X = 2).",
    answer: 0.3087, tol: 0.001,
    explanation: "P(X = 2) = C(5,2)(0,3)²(0,7)³ = 10 × 0,09 × 0,343 = 0,3087.",
    formula: "C(5,2) = 10"
  },
  {
    id: "d06", topic: "discretas", level: 2, type: "num",
    prompt: "Sea X ~ Bin(10; 0,5). Calcula P(X = 5).",
    answer: 0.2461, tol: 0.001,
    explanation: "P(X = 5) = C(10,5)(0,5)⁵(0,5)⁵ = 252/1024 = 0,2461.",
    formula: "C(10,5) = 252"
  },
  {
    id: "d07", topic: "discretas", level: 1, type: "mc",
    prompt: "En un proceso de Bernoulli, cada ensayo:",
    options: [
      "Puede tener más de dos resultados posibles.",
      "Es independiente de los demás y tiene una probabilidad constante de éxito.",
      "Depende del resultado del ensayo anterior.",
      "Solo puede tomar valores continuos."
    ],
    answer: 1,
    explanation: "El proceso de Bernoulli exige dos resultados mutuamente excluyentes (éxito/fracaso), probabilidad constante de éxito e independencia entre ensayos.",
    formula: "P(éxito) = p,  P(fracaso) = 1 − p"
  },
  {
    id: "d08", topic: "discretas", level: 2, type: "num",
    prompt: "Sea X ~ Bin(4; 0,2). Calcula P(X ≤ 2).",
    answer: 0.9728, tol: 0.001,
    explanation: "P(X = 0) = 0,4096; P(X = 1) = 0,4096; P(X = 2) = 0,1536. La suma es 0,9728. También: 1 − P(3) − P(4) = 1 − 0,0256 − 0,0016.",
    formula: "F(2) = f(0) + f(1) + f(2)"
  },
  {
    id: "d09", topic: "discretas", level: 1, type: "num",
    prompt: "Sea X ~ Bin(20; 0,15). ¿Cuál es la media de X?",
    answer: 3, tol: 0.01,
    explanation: "La media de una binomial es μ = n·p = 20 × 0,15 = 3.",
    formula: "μ = n·p"
  },
  {
    id: "d10", topic: "discretas", level: 2, type: "num",
    prompt: "Sea X ~ Bin(50; 0,2). ¿Cuál es la varianza de X?",
    answer: 8, tol: 0.01,
    explanation: "La varianza de una binomial es σ² = n·p·(1−p) = 50 × 0,2 × 0,8 = 8.",
    formula: "σ² = n·p·(1−p)"
  },
  {
    id: "d11", topic: "discretas", level: 1, type: "mc",
    prompt: "La función de distribución acumulada F(x) se define como:",
    options: [
      "P(X = x)",
      "P(X ≤ x)",
      "P(X ≥ x)",
      "1 − f(x)"
    ],
    answer: 1,
    explanation: "F(x) acumula la probabilidad de todos los valores menores o iguales a x. Es no decreciente y termina en 1.",
    formula: "F(x) = P(X ≤ x) = Σ f(t), t ≤ x"
  },
  {
    id: "d12", topic: "discretas", level: 2, type: "num",
    prompt: "La distribución de X es: P(0) = 0,5; P(1) = 0,3; P(2) = 0,2. Calcula F(1).",
    answer: 0.8, tol: 0.001,
    explanation: "F(1) = P(X ≤ 1) = P(0) + P(1) = 0,5 + 0,3 = 0,8.",
    formula: "F(1) = f(0) + f(1)"
  },
  {
    id: "d13", topic: "discretas", level: 1, type: "mc",
    prompt: "¿Cuál NO es un supuesto del modelo binomial?",
    options: [
      "Cada ensayo tiene dos resultados posibles.",
      "La probabilidad de éxito es constante.",
      "Los ensayos son independientes.",
      "Las extracciones se hacen sin reemplazo."
    ],
    answer: 3,
    explanation: "La binomial supone independencia, lo que equivale a muestrear con reemplazo (o con probabilidad constante). Sin reemplazo corresponde a la hipergeométrica.",
    formula: "Binomial: con reemplazo / independencia"
  },
  {
    id: "d14", topic: "discretas", level: 2, type: "num",
    prompt: "Sea X ~ Bin(8; 0,25). Calcula P(X = 0).",
    answer: 0.1001, tol: 0.001,
    explanation: "P(X = 0) = (0,75)⁸ = 0,1001. Es la probabilidad de que ningún ensayo resulte exitoso.",
    formula: "P(X = 0) = (1−p)ⁿ"
  },
  {
    id: "d15", topic: "discretas", level: 2, type: "mc",
    prompt: "Si X ~ Bin(n, p) cuenta el número de éxitos, el número de fracasos se distribuye como:",
    options: [
      "Bin(n, 1−p)",
      "Bin(n, p)",
      "Poisson(n·p)",
      "Bernoulli(p)"
    ],
    answer: 0,
    explanation: "Cada ensayo que no es éxito es fracaso. El número de fracasos es n − X, que se distribuye Bin(n, 1−p).",
    formula: "n − X ~ Bin(n, 1−p)"
  },
  {
    id: "d16", topic: "discretas", level: 3, type: "num",
    prompt: "Un vendedor concreta una venta en cada llamada con probabilidad 0,2, de forma independiente. Si realiza 6 llamadas, ¿cuál es la probabilidad de concretar al menos una venta?",
    answer: 0.7379, tol: 0.001,
    explanation: "Conviene usar el complemento: P(al menos una) = 1 − P(ninguna) = 1 − 0,8⁶ = 1 − 0,2621 = 0,7379.",
    formula: "P(X ≥ 1) = 1 − (1−p)ⁿ"
  },
  {
    id: "d17", topic: "discretas", level: 2, type: "mc",
    prompt: "Si X ~ Bin(10; 0,4), ¿cuál es la desviación estándar de X?",
    options: ["1,55", "2,40", "4,00", "6,00"],
    answer: 0,
    explanation: "σ² = 10 × 0,4 × 0,6 = 2,4; por lo tanto σ = √2,4 ≈ 1,55.",
    formula: "σ = √(n·p·(1−p))"
  },
  {
    id: "d18", topic: "discretas", level: 3, type: "num",
    prompt: "El 10% de las piezas producidas es defectuoso. En una muestra de 5 piezas, ¿cuál es la probabilidad de encontrar exactamente 1 defectuosa?",
    answer: 0.3281, tol: 0.001,
    explanation: "P(X = 1) = C(5,1)(0,1)(0,9)⁴ = 5 × 0,1 × 0,6561 = 0,3281.",
    formula: "X ~ Bin(5; 0,1)"
  },
  {
    id: "d19", topic: "discretas", level: 2, type: "mc",
    prompt: "Al aumentar n y mantener p fijo, la distribución binomial:",
    options: [
      "Se vuelve uniforme.",
      "Se aproxima a una normal con μ = np y σ = √(np(1−p)).",
      "Se aproxima a una Poisson con λ = p.",
      "Deja de ser discreta."
    ],
    answer: 1,
    explanation: "Con n grande, la binomial adopta forma de campana y puede aproximarse con una normal de media np y desviación estándar √(np(1−p)).",
    formula: "Bin(n,p) ≈ N(np, √(np(1−p)))"
  },
  {
    id: "d20", topic: "discretas", level: 3, type: "num",
    prompt: "Sea X ~ Bin(5; 0,1). Calcula P(X ≥ 1).",
    answer: 0.4095, tol: 0.001,
    explanation: "P(X ≥ 1) = 1 − P(X = 0) = 1 − 0,9⁵ = 1 − 0,5905 = 0,4095.",
    formula: "P(X ≥ 1) = 1 − (1−p)ⁿ"
  },

  /* ======================== 02 · HIPERGEOMÉTRICA Y POISSON ======== */
  {
    id: "h01", topic: "hiperpoisson", level: 1, type: "mc",
    prompt: "La distribución hipergeométrica se utiliza cuando:",
    options: [
      "Se muestrea sin reemplazo de una población finita.",
      "Se muestrea con reemplazo de una población infinita.",
      "Se cuentan eventos en un intervalo de tiempo.",
      "La variable aleatoria es continua."
    ],
    answer: 0,
    explanation: "La hipergeométrica modela el número de éxitos al extraer n elementos sin reemplazo de una población finita con K éxitos. La probabilidad cambia en cada extracción.",
    formula: "N población · K éxitos · n muestra"
  },
  {
    id: "h02", topic: "hiperpoisson", level: 2, type: "num",
    prompt: "Una población tiene N = 10 elementos, de los cuales K = 3 son defectuosos. Se extraen n = 4 sin reemplazo. Calcula P(X = 1).",
    answer: 0.5, tol: 0.001,
    explanation: "P(X = 1) = C(3,1)·C(7,3) / C(10,4) = 3 × 35 / 210 = 0,5.",
    formula: "C(K,x)·C(N−K,n−x) / C(N,n)"
  },
  {
    id: "h03", topic: "hiperpoisson", level: 2, type: "num",
    prompt: "Con N = 20, K = 5 y n = 3 (sin reemplazo), calcula P(X = 0).",
    answer: 0.3991, tol: 0.001,
    explanation: "P(X = 0) = C(5,0)·C(15,3) / C(20,3) = 455 / 1140 = 0,3991.",
    formula: "C(15,3) = 455; C(20,3) = 1140"
  },
  {
    id: "h04", topic: "hiperpoisson", level: 1, type: "mc",
    prompt: "Los parámetros de la distribución hipergeométrica son:",
    options: [
      "N (población), K (éxitos en la población) y n (tamaño de la muestra).",
      "n (ensayos) y p (probabilidad de éxito).",
      "λ (tasa media de eventos).",
      "μ y σ."
    ],
    answer: 0,
    explanation: "La hipergeométrica queda definida por el tamaño de la población N, la cantidad de éxitos K y el tamaño de la muestra n.",
    formula: "X ~ Hipergeométrica(N, K, n)"
  },
  {
    id: "h05", topic: "hiperpoisson", level: 1, type: "mc",
    prompt: "La distribución de Poisson modela:",
    options: [
      "El número de eventos que ocurren en un intervalo fijo de tiempo o espacio.",
      "El número de éxitos en n ensayos sin reemplazo.",
      "Una variable aleatoria continua con forma de campana.",
      "La proporción de éxitos en una muestra."
    ],
    answer: 0,
    explanation: "Poisson cuenta ocurrencias de un evento en un intervalo (llamadas por minuto, fallas por km, clientes por hora), a partir de una tasa media λ.",
    formula: "X ~ Poisson(λ)"
  },
  {
    id: "h06", topic: "hiperpoisson", level: 2, type: "num",
    prompt: "Sea X ~ Poisson(λ = 3). Calcula P(X = 2).",
    answer: 0.224, tol: 0.001,
    explanation: "P(X = 2) = e⁻³ · 3² / 2! = 0,0498 × 4,5 = 0,2240.",
    formula: "P(X = x) = e⁻λ · λˣ / x!"
  },
  {
    id: "h07", topic: "hiperpoisson", level: 1, type: "num",
    prompt: "Sea X ~ Poisson(λ = 2). Calcula P(X = 0).",
    answer: 0.1353, tol: 0.001,
    explanation: "P(X = 0) = e⁻² · 2⁰ / 0! = e⁻² = 0,1353.",
    formula: "P(X = 0) = e⁻λ"
  },
  {
    id: "h08", topic: "hiperpoisson", level: 2, type: "num",
    prompt: "Sea X ~ Poisson(λ = 4). Calcula P(X ≥ 1).",
    answer: 0.9817, tol: 0.001,
    explanation: "P(X ≥ 1) = 1 − P(X = 0) = 1 − e⁻⁴ = 1 − 0,0183 = 0,9817.",
    formula: "P(X ≥ 1) = 1 − e⁻λ"
  },
  {
    id: "h09", topic: "hiperpoisson", level: 1, type: "mc",
    prompt: "En una distribución de Poisson, la media y la varianza son:",
    options: [
      "Iguales a λ.",
      "λ y √λ, respectivamente.",
      "λ y λ², respectivamente.",
      "0 y 1, respectivamente."
    ],
    answer: 0,
    explanation: "Poisson tiene una propiedad distintiva: su media y su varianza coinciden e igualan la tasa λ.",
    formula: "μ = σ² = λ"
  },
  {
    id: "h10", topic: "hiperpoisson", level: 2, type: "mc",
    prompt: "Se eligen 5 estudiantes de un curso de 30, sin reemplazo, y se cuenta cuántas mujeres hay. ¿Qué modelo corresponde?",
    options: [
      "Hipergeométrica.",
      "Binomial.",
      "Poisson.",
      "Normal."
    ],
    answer: 0,
    explanation: "Hay una población finita (30 estudiantes), se extrae sin reemplazo y se cuenta el número de éxitos (mujeres). Ese es el esquema hipergeométrico.",
    formula: "N = 30, n = 5, sin reemplazo"
  },
  {
    id: "h11", topic: "hiperpoisson", level: 2, type: "mc",
    prompt: "El número de llamadas que llegan por minuto a una central telefónica se modela habitualmente con:",
    options: [
      "Poisson.",
      "Hipergeométrica.",
      "Uniforme.",
      "Binomial con n = 1."
    ],
    answer: 0,
    explanation: "Se cuentan eventos raros e independientes en un intervalo fijo de tiempo, con una tasa media estable: es el caso típico de Poisson.",
    formula: "λ = llamadas esperadas por minuto"
  },
  {
    id: "h12", topic: "hiperpoisson", level: 2, type: "num",
    prompt: "En una hipergeométrica con N = 50, K = 10 y n = 5, calcula la media de X.",
    answer: 1, tol: 0.01,
    explanation: "μ = n · K/N = 5 × (10/50) = 1.",
    formula: "μ = n · K/N"
  },
  {
    id: "h13", topic: "hiperpoisson", level: 3, type: "num",
    prompt: "Sea X ~ Poisson(λ = 0,5). Calcula P(X = 1).",
    answer: 0.3033, tol: 0.001,
    explanation: "P(X = 1) = e⁻⁰·⁵ × 0,5 / 1! = 0,6065 × 0,5 = 0,3033.",
    formula: "P(X = 1) = λ·e⁻λ"
  },
  {
    id: "h14", topic: "hiperpoisson", level: 2, type: "mc",
    prompt: "La distribución binomial se aproxima a una Poisson cuando:",
    options: [
      "n es grande, p es pequeño y λ = np.",
      "n es pequeño y p es cercano a 1.",
      "El muestreo es sin reemplazo.",
      "La variable es continua."
    ],
    answer: 0,
    explanation: "Cuando n es grande y p pequeño (eventos raros), Bin(n,p) se aproxima a Poisson(λ = np). Es una regla práctica muy usada.",
    formula: "Bin(n,p) ≈ Poisson(λ = n·p)"
  },
  {
    id: "h15", topic: "hiperpoisson", level: 3, type: "num",
    prompt: "Con n = 100 y p = 0,02, usa la aproximación de Poisson para calcular P(X = 0).",
    answer: 0.1353, tol: 0.001,
    explanation: "λ = np = 100 × 0,02 = 2. Entonces P(X = 0) ≈ e⁻² = 0,1353.",
    formula: "λ = n·p = 2"
  },
  {
    id: "h16", topic: "hiperpoisson", level: 3, type: "mc",
    prompt: "La distribución hipergeométrica se aproxima a la binomial cuando:",
    options: [
      "El tamaño de la población N es mucho mayor que el tamaño de la muestra n.",
      "La muestra es igual a la población (n = N).",
      "K = 0.",
      "p = 0,5 exactamente."
    ],
    answer: 0,
    explanation: "Si N es grande respecto de n, extraer sin reemplazo apenas modifica la probabilidad de éxito y el modelo se comporta como una binomial con p = K/N.",
    formula: "Hipergeométrica(N,K,n) ≈ Bin(n, K/N) si N ≫ n"
  },
  {
    id: "h17", topic: "hiperpoisson", level: 3, type: "num",
    prompt: "Con N = 12, K = 4 y n = 3 (sin reemplazo), calcula P(X = 3).",
    answer: 0.0182, tol: 0.001,
    explanation: "P(X = 3) = C(4,3)·C(8,0) / C(12,3) = 4 × 1 / 220 = 0,0182.",
    formula: "C(12,3) = 220"
  },
  {
    id: "h18", topic: "hiperpoisson", level: 2, type: "num",
    prompt: "Sea X ~ Poisson(λ = 1,5). Calcula P(X = 2).",
    answer: 0.251, tol: 0.001,
    explanation: "P(X = 2) = e⁻¹·⁵ × 1,5² / 2! = 0,2231 × 2,25 / 2 = 0,2510.",
    formula: "P(X = 2) = e⁻λ λ² / 2"
  },

  /* ========================= 03 · CONTINUAS Y NORMAL ============== */
  {
    id: "c01", topic: "continuas", level: 1, type: "mc",
    prompt: "Para una variable aleatoria continua, la probabilidad de que X tome un valor exacto a, P(X = a), es:",
    options: ["0", "f(a)", "F(a)", "1"],
    answer: 0,
    explanation: "En una distribución continua la probabilidad se asocia a intervalos, no a puntos. Por eso P(X = a) = 0 para cualquier valor a.",
    formula: "P(X = a) = 0"
  },
  {
    id: "c02", topic: "continuas", level: 1, type: "mc",
    prompt: "Una función de densidad f(x) debe cumplir:",
    options: [
      "f(x) ≥ 0 y el área total bajo la curva es 1.",
      "La suma de f(x) es 1.",
      "f(x) ≤ 1 para todo x.",
      "F(x) es la derivada de f(x)."
    ],
    answer: 0,
    explanation: "La densidad es no negativa y encierra área total 1. Además, la probabilidad de un intervalo es el área bajo f sobre ese intervalo.",
    formula: "f(x) ≥ 0,  ∫ f(x) dx = 1"
  },
  {
    id: "c03", topic: "continuas", level: 1, type: "num",
    prompt: "Sea X ~ Uniforme(0, 10). Calcula P(2 < X < 7).",
    answer: 0.5, tol: 0.001,
    explanation: "En una uniforme, la probabilidad es la longitud del intervalo dividida por la longitud total: (7 − 2)/(10 − 0) = 0,5.",
    formula: "P(a < X < b) = (b−a)/(B−A)"
  },
  {
    id: "c04", topic: "continuas", level: 2, type: "num",
    prompt: "Sea X ~ Uniforme(4, 12). Calcula P(X < 6).",
    answer: 0.25, tol: 0.001,
    explanation: "P(X < 6) = (6 − 4)/(12 − 4) = 2/8 = 0,25.",
    formula: "P(X < x) = (x−A)/(B−A)"
  },
  {
    id: "c05", topic: "continuas", level: 1, type: "mc",
    prompt: "La media de una distribución uniforme continua en el intervalo (a, b) es:",
    options: ["(a + b)/2", "b − a", "ab/2", "1/(b − a)"],
    answer: 0,
    explanation: "La uniforme es simétrica, por lo que su media es el punto medio del intervalo: (a + b)/2.",
    formula: "μ = (a + b)/2"
  },
  {
    id: "c06", topic: "continuas", level: 2, type: "num",
    prompt: "Sea X ~ Uniforme(10, 20). Calcula la desviación estándar de X.",
    answer: 2.8868, tol: 0.01,
    explanation: "σ² = (b − a)²/12 = 100/12 = 8,3333; por lo tanto σ = 2,8868.",
    formula: "σ = (b−a)/√12"
  },
  {
    id: "c07", topic: "continuas", level: 1, type: "num",
    prompt: "Sea X ~ N(μ = 100; σ = 15). Calcula el valor z correspondiente a x = 130.",
    answer: 2, tol: 0.01,
    explanation: "z = (x − μ)/σ = (130 − 100)/15 = 2. El valor está a dos desviaciones estándar sobre la media.",
    formula: "z = (x − μ)/σ"
  },
  {
    id: "c08", topic: "continuas", level: 1, type: "num",
    prompt: "Sea X ~ N(μ = 100; σ = 15). Calcula el valor z correspondiente a x = 85.",
    answer: -1, tol: 0.01,
    explanation: "z = (85 − 100)/15 = −1. El valor está una desviación estándar por debajo de la media.",
    formula: "z = (x − μ)/σ"
  },
  {
    id: "c09", topic: "continuas", level: 1, type: "mc",
    prompt: "En la normal estándar, Φ(0) = P(Z ≤ 0) es igual a:",
    options: ["0,5", "0", "1", "0,8413"],
    answer: 0,
    explanation: "La normal estándar es simétrica alrededor de 0, por lo que la mitad del área queda a la izquierda: Φ(0) = 0,5.",
    formula: "Φ(0) = 0,5"
  },
  {
    id: "c10", topic: "continuas", level: 2, type: "num",
    prompt: "Calcula P(Z < 1,5) usando la normal estándar.",
    answer: 0.9332, tol: 0.001,
    explanation: "Buscando z = 1,5 en la tabla normal estándar se obtiene Φ(1,5) = 0,9332.",
    formula: "P(Z < 1,5) = Φ(1,5)"
  },
  {
    id: "c11", topic: "continuas", level: 2, type: "num",
    prompt: "Calcula P(Z > 1,96) usando la normal estándar.",
    answer: 0.025, tol: 0.001,
    explanation: "P(Z > 1,96) = 1 − Φ(1,96) = 1 − 0,9750 = 0,0250.",
    formula: "P(Z > z) = 1 − Φ(z)"
  },
  {
    id: "c12", topic: "continuas", level: 2, type: "num",
    prompt: "Calcula P(−1 < Z < 1) usando la normal estándar.",
    answer: 0.6827, tol: 0.001,
    explanation: "P(−1 < Z < 1) = Φ(1) − Φ(−1) = 0,8413 − 0,1587 = 0,6827. Es la regla del 68%.",
    formula: "Φ(1) − Φ(−1)"
  },
  {
    id: "c13", topic: "continuas", level: 2, type: "num",
    prompt: "Sea X ~ N(μ = 50; σ = 10). Calcula P(X < 60).",
    answer: 0.8413, tol: 0.001,
    explanation: "z = (60 − 50)/10 = 1. Entonces P(X < 60) = Φ(1) = 0,8413.",
    formula: "z = 1 → Φ(1) = 0,8413"
  },
  {
    id: "c14", topic: "continuas", level: 2, type: "num",
    prompt: "Sea X ~ N(μ = 200; σ = 25). Calcula P(X > 225).",
    answer: 0.1587, tol: 0.001,
    explanation: "z = (225 − 200)/25 = 1. P(X > 225) = P(Z > 1) = 1 − 0,8413 = 0,1587.",
    formula: "P(Z > 1) = 0,1587"
  },
  {
    id: "c15", topic: "continuas", level: 1, type: "mc",
    prompt: "En una distribución normal, aproximadamente el 68% de los datos se encuentra entre:",
    options: ["μ − σ y μ + σ", "μ − 2σ y μ + 2σ", "μ − 1,96σ y μ + 1,96σ", "0 y μ"],
    answer: 0,
    explanation: "La regla empírica indica 68% entre μ ± σ, 95% entre μ ± 2σ y 99,7% entre μ ± 3σ.",
    formula: "μ ± σ → ≈ 68%"
  },
  {
    id: "c16", topic: "continuas", level: 3, type: "num",
    prompt: "Sea X ~ N(μ = 100; σ = 15). Halla el valor x tal que P(X ≤ x) = 0,90. Usa z = 1,28.",
    answer: 119.2, tol: 0.3,
    explanation: "Despejando: x = μ + z·σ = 100 + 1,28 × 15 = 119,2. El 90% de los valores queda por debajo de 119,2.",
    formula: "x = μ + z·σ"
  },
  {
    id: "c17", topic: "continuas", level: 1, type: "mc",
    prompt: "En una distribución normal, la media, la mediana y la moda:",
    options: [
      "Coinciden en el centro de la distribución.",
      "Son siempre distintas.",
      "Dependen de la desviación estándar.",
      "Solo coinciden si σ = 1."
    ],
    answer: 0,
    explanation: "La normal es simétrica y unimodal, por lo que media, mediana y moda coinciden en μ.",
    formula: "μ = mediana = moda"
  },
  {
    id: "c18", topic: "continuas", level: 3, type: "num",
    prompt: "Sea X ~ N(μ = 500; σ = 50). Calcula P(450 < X < 600).",
    answer: 0.8186, tol: 0.001,
    explanation: "z₁ = (450 − 500)/50 = −1 y z₂ = (600 − 500)/50 = 2. P = Φ(2) − Φ(−1) = 0,9772 − 0,1587 = 0,8186.",
    formula: "Φ(2) − Φ(−1)"
  },
  {
    id: "c19", topic: "continuas", level: 2, type: "mc",
    prompt: "¿Para qué sirve estandarizar una variable normal?",
    options: [
      "Para expresarla en unidades de desviación estándar y usar una única tabla N(0,1).",
      "Para convertirla en una variable discreta.",
      "Para aumentar su media.",
      "Para eliminar su variabilidad."
    ],
    answer: 0,
    explanation: "Al restar la media y dividir por σ se obtiene Z ~ N(0,1). Así cualquier normal puede resolverse con la misma tabla o software.",
    formula: "Z = (X − μ)/σ ~ N(0,1)"
  },
  {
    id: "c20", topic: "continuas", level: 2, type: "num",
    prompt: "Sea X ~ N(μ = 70; σ = 8). Calcula P(X > 62).",
    answer: 0.8413, tol: 0.001,
    explanation: "z = (62 − 70)/8 = −1. Por simetría, P(Z > −1) = P(Z < 1) = 0,8413.",
    formula: "P(Z > −1) = Φ(1)"
  },

  /* ======================= 04 · SUMAS Y TCL ======================= */
  {
    id: "s01", topic: "sumas", level: 1, type: "mc",
    prompt: "Para dos variables aleatorias cualesquiera, E(X + Y) es igual a:",
    options: [
      "E(X) + E(Y), siempre.",
      "E(X) + E(Y), solo si son independientes.",
      "E(X) · E(Y).",
      "E(X) − E(Y)."
    ],
    answer: 0,
    explanation: "La esperanza es lineal: E(X + Y) = E(X) + E(Y) para cualquier par de variables, sin necesidad de independencia.",
    formula: "E(X + Y) = E(X) + E(Y)"
  },
  {
    id: "s02", topic: "sumas", level: 1, type: "mc",
    prompt: "Si X e Y son independientes, Var(X + Y) es igual a:",
    options: [
      "Var(X) + Var(Y)",
      "Var(X) − Var(Y)",
      "Var(X) · Var(Y)",
      "√(Var(X) + Var(Y))"
    ],
    answer: 0,
    explanation: "La independencia hace que la covarianza sea 0, por lo que las varianzas se suman: Var(X + Y) = Var(X) + Var(Y).",
    formula: "Var(X + Y) = Var(X) + Var(Y) + 2Cov(X,Y)"
  },
  {
    id: "s03", topic: "sumas", level: 1, type: "num",
    prompt: "X ~ N(10; 2) e Y ~ N(5; 3) son independientes (los segundos valores son desviaciones estándar). Calcula E(X + Y).",
    answer: 15, tol: 0.01,
    explanation: "La media de la suma es la suma de las medias: E(X + Y) = 10 + 5 = 15.",
    formula: "E(X + Y) = μₓ + μᵧ"
  },
  {
    id: "s04", topic: "sumas", level: 2, type: "num",
    prompt: "Con X ~ N(10; 2) e Y ~ N(5; 3) independientes (σ = 2 y σ = 3), calcula la desviación estándar de X + Y.",
    answer: 3.6056, tol: 0.01,
    explanation: "Var(X + Y) = 2² + 3² = 4 + 9 = 13; σ = √13 = 3,6056.",
    formula: "σ(X+Y) = √(σₓ² + σᵧ²)"
  },
  {
    id: "s05", topic: "sumas", level: 3, type: "num",
    prompt: "X ~ N(20; 3) e Y ~ N(10; 4) son independientes (σ = 3 y σ = 4). Calcula P(X + Y > 35).",
    answer: 0.1587, tol: 0.001,
    explanation: "X + Y ~ N(30; 5), porque 20 + 10 = 30 y √(3² + 4²) = 5. Entonces z = (35 − 30)/5 = 1 y P(Z > 1) = 0,1587.",
    formula: "P(Z > 1) = 1 − Φ(1)"
  },
  {
    id: "s06", topic: "sumas", level: 1, type: "mc",
    prompt: "El Teorema Central del Límite afirma que:",
    options: [
      "La distribución de la media muestral se aproxima a una normal cuando n es grande.",
      "Toda población debe ser normal.",
      "La media muestral siempre es igual a la media poblacional.",
      "La varianza muestral disminuye al aumentar n."
    ],
    answer: 0,
    explanation: "Para n suficientemente grande, la distribución de x̄ se aproxima a una normal con media μ y error estándar σ/√n, sin importar la forma de la población.",
    formula: "x̄ ≈ N(μ, σ/√n) para n grande"
  },
  {
    id: "s07", topic: "sumas", level: 2, type: "num",
    prompt: "Una población tiene μ = 50 y σ = 12. Para muestras de n = 36, calcula el error estándar de la media.",
    answer: 2, tol: 0.01,
    explanation: "σx̄ = σ/√n = 12/√36 = 12/6 = 2.",
    formula: "σx̄ = σ/√n"
  },
  {
    id: "s08", topic: "sumas", level: 2, type: "num",
    prompt: "Con μ = 50, σ = 12 y n = 36, calcula P(x̄ > 53).",
    answer: 0.0668, tol: 0.001,
    explanation: "El error estándar es 2, entonces z = (53 − 50)/2 = 1,5. P(Z > 1,5) = 1 − 0,9332 = 0,0668.",
    formula: "z = (x̄ − μ)/(σ/√n)"
  },
  {
    id: "s09", topic: "sumas", level: 2, type: "mc",
    prompt: "¿El Teorema Central del Límite exige que la población de origen sea normal?",
    options: [
      "No: para n grande, la media muestral se aproxima a la normal aunque la población no lo sea.",
      "Sí, siempre.",
      "Solo si la muestra es menor que 30.",
      "Solo para variables discretas."
    ],
    answer: 0,
    explanation: "La potencia del TCL es que no requiere normalidad en la población. Con n grande, la distribución de x̄ tiende a la normal.",
    formula: "n grande → x̄ aproximadamente normal"
  },
  {
    id: "s10", topic: "sumas", level: 2, type: "num",
    prompt: "Con μ = 100, σ = 15 y n = 25, calcula P(x̄ < 103).",
    answer: 0.8413, tol: 0.001,
    explanation: "σx̄ = 15/5 = 3; z = (103 − 100)/3 = 1. Entonces P(x̄ < 103) = Φ(1) = 0,8413.",
    formula: "σx̄ = 3, z = 1"
  },
  {
    id: "s11", topic: "sumas", level: 2, type: "mc",
    prompt: "Al aumentar el tamaño de la muestra n, el error estándar de la media:",
    options: [
      "Disminuye.",
      "Aumenta.",
      "Permanece constante.",
      "Se vuelve igual a σ."
    ],
    answer: 0,
    explanation: "σx̄ = σ/√n. Como el denominador crece, el error estándar disminuye: las medias muestrales se concentran más alrededor de μ.",
    formula: "σx̄ = σ/√n"
  },
  {
    id: "s12", topic: "sumas", level: 3, type: "num",
    prompt: "Se suman 25 observaciones independientes con μ = 10 y σ = 4. Calcula P(suma > 270).",
    answer: 0.1587, tol: 0.001,
    explanation: "La suma tiene media 25 × 10 = 250 y desviación estándar √25 × 4 = 20. z = (270 − 250)/20 = 1; P(Z > 1) = 0,1587.",
    formula: "E(Σ) = nμ, σ(Σ) = √n·σ"
  },
  {
    id: "s13", topic: "sumas", level: 3, type: "mc",
    prompt: "Si X e Y no son independientes, Var(X + Y) es igual a:",
    options: [
      "Var(X) + Var(Y) + 2Cov(X,Y)",
      "Var(X) + Var(Y)",
      "Var(X) + Var(Y) − 2Cov(X,Y)",
      "Var(X) · Var(Y)"
    ],
    answer: 0,
    explanation: "La fórmula general incluye dos veces la covarianza. Si la covarianza es positiva, la suma tiene más variabilidad que la que tendría con independencia.",
    formula: "Var(X + Y) = σₓ² + σᵧ² + 2Cov(X,Y)"
  },
  {
    id: "s14", topic: "sumas", level: 2, type: "num",
    prompt: "Si E(X) = 5 y E(Y) = 4, calcula E(3X − 2Y).",
    answer: 7, tol: 0.01,
    explanation: "Por linealidad: E(3X − 2Y) = 3E(X) − 2E(Y) = 15 − 8 = 7.",
    formula: "E(aX + bY) = aE(X) + bE(Y)"
  },
  {
    id: "s15", topic: "sumas", level: 2, type: "mc",
    prompt: "La distribución de la media muestral x̄ tiene media igual a:",
    options: ["μ", "μ/n", "σ/√n", "n·μ"],
    answer: 0,
    explanation: "La media de todas las medias muestrales posibles es la media poblacional μ. El error estándar es σ/√n.",
    formula: "E(x̄) = μ"
  },
  {
    id: "s16", topic: "sumas", level: 3, type: "num",
    prompt: "Con μ = 80, σ = 20 y n = 64, calcula P(75 < x̄ < 85).",
    answer: 0.9545, tol: 0.001,
    explanation: "σx̄ = 20/8 = 2,5. Los valores 75 y 85 están a ±2 errores estándar: P(−2 < Z < 2) = 0,9545.",
    formula: "z = ±2 → 0,9545"
  },

  /* ======================= 05 · MEDIA Y VARIANZA ================== */
  {
    id: "p01", topic: "propiedades", level: 1, type: "mc",
    prompt: "Si a y b son constantes, E(aX + b) es igual a:",
    options: [
      "a·E(X) + b",
      "a·E(X) + a·b",
      "a + E(X) + b",
      "a²·E(X) + b"
    ],
    answer: 0,
    explanation: "La esperanza es lineal: la constante multiplicativa sale y la constante aditiva se suma. E(aX + b) = aE(X) + b.",
    formula: "E(aX + b) = a·E(X) + b"
  },
  {
    id: "p02", topic: "propiedades", level: 1, type: "mc",
    prompt: "Si a y b son constantes, Var(aX + b) es igual a:",
    options: [
      "a²·Var(X)",
      "a·Var(X) + b",
      "a²·Var(X) + b",
      "a·Var(X)"
    ],
    answer: 0,
    explanation: "Sumar una constante no cambia la dispersión; multiplicar por a escala la desviación en |a| y la varianza en a².",
    formula: "Var(aX + b) = a²·Var(X)"
  },
  {
    id: "p03", topic: "propiedades", level: 1, type: "num",
    prompt: "Si E(X) = 10 y Var(X) = 9, calcula E(2X + 5).",
    answer: 25, tol: 0.01,
    explanation: "E(2X + 5) = 2E(X) + 5 = 2 × 10 + 5 = 25.",
    formula: "E(aX + b) = aE(X) + b"
  },
  {
    id: "p04", topic: "propiedades", level: 2, type: "num",
    prompt: "Si Var(X) = 9, calcula Var(2X + 5).",
    answer: 36, tol: 0.01,
    explanation: "Var(2X + 5) = 2² × Var(X) = 4 × 9 = 36. La constante +5 no afecta la varianza.",
    formula: "Var(aX + b) = a²·Var(X)"
  },
  {
    id: "p05", topic: "propiedades", level: 1, type: "num",
    prompt: "Si E(X) = 4 y E(Y) = 3, calcula E(X − Y).",
    answer: 1, tol: 0.01,
    explanation: "E(X − Y) = E(X) − E(Y) = 4 − 3 = 1.",
    formula: "E(X − Y) = E(X) − E(Y)"
  },
  {
    id: "p06", topic: "propiedades", level: 1, type: "mc",
    prompt: "La varianza también puede calcularse como:",
    options: [
      "E(X²) − [E(X)]²",
      "E(X²) + [E(X)]²",
      "[E(X)]² − E(X²)",
      "E(X²)/E(X)"
    ],
    answer: 0,
    explanation: "Desarrollando Var(X) = E[(X − μ)²] se obtiene la fórmula de cálculo E(X²) − μ².",
    formula: "Var(X) = E(X²) − μ²"
  },
  {
    id: "p07", topic: "propiedades", level: 2, type: "num",
    prompt: "Si E(X) = 2 y E(X²) = 6, calcula Var(X).",
    answer: 2, tol: 0.01,
    explanation: "Var(X) = E(X²) − [E(X)]² = 6 − 2² = 2.",
    formula: "Var(X) = E(X²) − μ²"
  },
  {
    id: "p08", topic: "propiedades", level: 1, type: "mc",
    prompt: "Si se suma una constante a una variable aleatoria:",
    options: [
      "La media cambia, pero la varianza no.",
      "La media y la varianza cambian.",
      "La media no cambia, pero la varianza sí.",
      "Ninguna de las dos cambia."
    ],
    answer: 0,
    explanation: "Sumar b traslada toda la distribución: la media pasa a μ + b, pero las distancias respecto de la media no cambian y la varianza queda igual.",
    formula: "E(X+b) = μ+b;  Var(X+b) = σ²"
  },
  {
    id: "p09", topic: "propiedades", level: 2, type: "num",
    prompt: "Una variable tiene μ = 50 y σ = 5. Calcula su coeficiente de variación, en porcentaje.",
    answer: 10, tol: 0.05, unit: "%",
    explanation: "CV = (σ/μ) × 100 = (5/50) × 100 = 10%. Expresa la dispersión como porcentaje de la media.",
    formula: "CV = (σ/μ) × 100"
  },
  {
    id: "p10", topic: "propiedades", level: 3, type: "num",
    prompt: "Una cartera invierte 60% en X (σ = 10) y 40% en Y (σ = 8), con X e Y independientes. Calcula la desviación estándar de la cartera.",
    answer: 6.8, tol: 0.02,
    explanation: "Var = 0,6² × 10² + 0,4² × 8² = 36 + 10,24 = 46,24. Entonces σ = √46,24 = 6,8.",
    formula: "σ² = wₓ²σₓ² + wᵧ²σᵧ²"
  },
  {
    id: "p11", topic: "propiedades", level: 3, type: "mc",
    prompt: "Si Cov(X,Y) > 0, entonces Var(X + Y):",
    options: [
      "Es mayor que Var(X) + Var(Y).",
      "Es menor que Var(X) + Var(Y).",
      "Es igual a Var(X) + Var(Y).",
      "Es igual a Var(X) · Var(Y)."
    ],
    answer: 0,
    explanation: "Var(X + Y) = Var(X) + Var(Y) + 2Cov(X,Y). Con covarianza positiva, el término adicional aumenta la varianza de la suma.",
    formula: "+2Cov(X,Y) > 0"
  },
  {
    id: "p12", topic: "propiedades", level: 2, type: "num",
    prompt: "Si E(X) = 8 y Y = 3X − 2, calcula E(Y).",
    answer: 22, tol: 0.01,
    explanation: "E(Y) = 3E(X) − 2 = 24 − 2 = 22.",
    formula: "E(3X − 2) = 3E(X) − 2"
  },
  {
    id: "p13", topic: "propiedades", level: 2, type: "num",
    prompt: "Si σ(X) = 2 y Y = 3X − 2, calcula σ(Y).",
    answer: 6, tol: 0.01,
    explanation: "σ(Y) = |3| × σ(X) = 3 × 2 = 6. La resta de 2 no modifica la dispersión.",
    formula: "σ(aX + b) = |a|·σ(X)"
  },
  {
    id: "p14", topic: "propiedades", level: 1, type: "mc",
    prompt: "La varianza de una constante es:",
    options: ["0", "1", "La constante", "Su cuadrado"],
    answer: 0,
    explanation: "Una constante no varía respecto de su propia media, por lo que su varianza es 0.",
    formula: "Var(c) = 0"
  },
  {
    id: "p15", topic: "propiedades", level: 3, type: "num",
    prompt: "X e Y son independientes, con σ(X) = 2 y σ(Y) = 5. Calcula σ(X + Y).",
    answer: 5.3852, tol: 0.02,
    explanation: "Var(X + Y) = 4 + 25 = 29; σ = √29 = 5,3852.",
    formula: "σ(X+Y) = √(σₓ² + σᵧ²)"
  },
  {
    id: "p16", topic: "propiedades", level: 2, type: "mc",
    prompt: "Si se multiplica X por −1, su varianza:",
    options: [
      "No cambia.",
      "Cambia de signo.",
      "Se reduce a la mitad.",
      "Se duplica."
    ],
    answer: 0,
    explanation: "Var(−X) = (−1)²Var(X) = Var(X). El signo invierte los valores, pero no la dispersión.",
    formula: "Var(−X) = Var(X)"
  },

  /* ========================= 06 · NÚMEROS ÍNDICES ================= */
  {
    id: "i01", topic: "indices", level: 1, type: "mc",
    prompt: "Un número índice sirve principalmente para:",
    options: [
      "Medir el cambio relativo de una variable respecto de un período base.",
      "Calcular la media de una variable.",
      "Estimar la probabilidad de un evento.",
      "Ordenar los datos de una muestra."
    ],
    answer: 0,
    explanation: "Un índice compara el valor de una magnitud (precio, cantidad, valor) con un nivel base, que habitualmente se fija en 100.",
    formula: "Iₜ = (Xₜ/X₀) × 100"
  },
  {
    id: "i02", topic: "indices", level: 1, type: "num",
    prompt: "El precio de un producto pasó de 20 a 25. Calcula el índice simple de precios con base 100.",
    answer: 125, tol: 0.01,
    explanation: "I = (25/20) × 100 = 125. El precio aumentó 25% respecto de la base.",
    formula: "I = (Xₜ/X₀) × 100"
  },
  {
    id: "i03", topic: "indices", level: 1, type: "num",
    prompt: "La cantidad producida pasó de 200 a 250 unidades. Calcula el índice simple de cantidad con base 100.",
    answer: 125, tol: 0.01,
    explanation: "I = (250/200) × 100 = 125. La producción aumentó 25%.",
    formula: "I = (Qₜ/Q₀) × 100"
  },
  {
    id: "i04", topic: "indices", level: 2, type: "mc",
    prompt: "El índice de precios de Laspeyres utiliza como ponderadores:",
    options: [
      "Las cantidades del período base.",
      "Las cantidades del período actual.",
      "Los precios del período actual.",
      "Los precios promedio de ambos períodos."
    ],
    answer: 0,
    explanation: "Laspeyres mantiene fija la canasta del período base (q₀), por eso se lo asocia con un índice de canasta fija.",
    formula: "L = (Σp₁q₀ / Σp₀q₀) × 100"
  },
  {
    id: "i05", topic: "indices", level: 2, type: "mc",
    prompt: "El índice de precios de Paasche utiliza como ponderadores:",
    options: [
      "Las cantidades del período actual.",
      "Las cantidades del período base.",
      "Los precios del período base.",
      "Pesos iguales para todos los bienes."
    ],
    answer: 0,
    explanation: "Paasche usa la canasta del período corriente (q₁). Refleja mejor los cambios de consumo, pero requiere actualizar las cantidades cada período.",
    formula: "P = (Σp₁q₁ / Σp₀q₁) × 100"
  },
  {
    id: "i06", topic: "indices", level: 2, type: "num",
    prompt: "Con la siguiente tabla, calcula el índice de precios de Laspeyres (base 100).<table class='q-table'><thead><tr><th>Producto</th><th>p₀</th><th>q₀</th><th>p₁</th><th>q₁</th></tr></thead><tbody><tr><td>A</td><td>2</td><td>10</td><td>3</td><td>8</td></tr><tr><td>B</td><td>5</td><td>4</td><td>6</td><td>5</td></tr></tbody></table>",
    answer: 135, tol: 0.02,
    explanation: "Σp₁q₀ = 3×10 + 6×4 = 54. Σp₀q₀ = 2×10 + 5×4 = 40. L = (54/40) × 100 = 135.",
    formula: "L = (Σp₁q₀ / Σp₀q₀) × 100"
  },
  {
    id: "i07", topic: "indices", level: 2, type: "num",
    prompt: "Con la siguiente tabla, calcula el índice de precios de Paasche (base 100).<table class='q-table'><thead><tr><th>Producto</th><th>p₀</th><th>q₀</th><th>p₁</th><th>q₁</th></tr></thead><tbody><tr><td>A</td><td>2</td><td>10</td><td>3</td><td>8</td></tr><tr><td>B</td><td>5</td><td>4</td><td>6</td><td>5</td></tr></tbody></table>",
    answer: 131.7073, tol: 0.05,
    explanation: "Σp₁q₁ = 3×8 + 6×5 = 54. Σp₀q₁ = 2×8 + 5×5 = 41. P = (54/41) × 100 = 131,7073.",
    formula: "P = (Σp₁q₁ / Σp₀q₁) × 100"
  },
  {
    id: "i08", topic: "indices", level: 2, type: "num",
    prompt: "Con la siguiente tabla, calcula el índice de cantidades de Laspeyres (base 100).<table class='q-table'><thead><tr><th>Producto</th><th>p₀</th><th>q₀</th><th>p₁</th><th>q₁</th></tr></thead><tbody><tr><td>A</td><td>2</td><td>10</td><td>3</td><td>8</td></tr><tr><td>B</td><td>5</td><td>4</td><td>6</td><td>5</td></tr></tbody></table>",
    answer: 102.5, tol: 0.02,
    explanation: "Σp₀q₁ = 2×8 + 5×5 = 41. Σp₀q₀ = 2×10 + 5×4 = 40. Q = (41/40) × 100 = 102,5.",
    formula: "Q_L = (Σp₀q₁ / Σp₀q₀) × 100"
  },
  {
    id: "i09", topic: "indices", level: 2, type: "mc",
    prompt: "El índice de valor se descompone como el producto de:",
    options: [
      "El índice de precios de Paasche por el índice de cantidades de Laspeyres.",
      "El índice de precios de Laspeyres por el índice de cantidades de Laspeyres.",
      "El índice de precios de Paasche por el índice de cantidades de Paasche.",
      "Dos índices de precios."
    ],
    answer: 0,
    explanation: "V = (Σp₁q₁/Σp₀q₀)×100. Se cumple V = P_Paasche × Q_Laspeyres, porque los términos Σp₀q₁ se cancelan.",
    formula: "V = P_P × Q_L"
  },
  {
    id: "i10", topic: "indices", level: 2, type: "mc",
    prompt: "El Índice de Precios al Consumidor (IPC) es un índice:",
    options: [
      "De precios con una canasta fija, de tipo Laspeyres.",
      "De cantidades con ponderadores actuales.",
      "De valor con canasta variable.",
      "De precios de tipo Paasche."
    ],
    answer: 0,
    explanation: "El IPC sigue el costo de una canasta fija de bienes y servicios representativa del consumo, por lo que responde al esquema de Laspeyres.",
    formula: "IPC = (costo canasta actual / costo canasta base) × 100"
  },
  {
    id: "i11", topic: "indices", level: 1, type: "num",
    prompt: "Una canasta representativa costaba 240 en el año base y hoy cuesta 300. Calcula el IPC con base 100.",
    answer: 125, tol: 0.01,
    explanation: "IPC = (300/240) × 100 = 125. El costo de la canasta aumentó 25%.",
    formula: "IPC = (Cₜ/C₀) × 100"
  },
  {
    id: "i12", topic: "indices", level: 2, type: "num",
    prompt: "El IPC pasó de 120 a 126. Calcula la tasa de inflación, en porcentaje.",
    answer: 5, tol: 0.05, unit: "%",
    explanation: "Inflación = (126/120 − 1) × 100 = 0,05 × 100 = 5%.",
    formula: "π = (IPCₜ/IPCₜ₋₁ − 1) × 100"
  },
  {
    id: "i13", topic: "indices", level: 3, type: "num",
    prompt: "El salario nominal aumentó 10% y el IPC aumentó 25%. ¿Cuál fue la variación porcentual del salario real?",
    answer: -12, tol: 0.5, unit: "%",
    explanation: "Salario real relativo = 1,10/1,25 = 0,88. Es decir, cayó 12%: el aumento nominal no alcanzó a compensar la inflación.",
    formula: "Var. real = (1 + var. nominal)/(1 + inflación) − 1"
  },
  {
    id: "i14", topic: "indices", level: 2, type: "mc",
    prompt: "Para deflactar una serie expresada en pesos corrientes se debe:",
    options: [
      "Dividir el valor nominal por el índice de precios y multiplicar por 100.",
      "Multiplicar el valor nominal por el índice de precios.",
      "Sumar el índice de precios al valor nominal.",
      "Dividir el valor nominal por la cantidad producida."
    ],
    answer: 0,
    explanation: "Deflactar elimina el efecto de los precios: valor real = (valor nominal / índice de precios) × 100.",
    formula: "Valor real = (Nominal / IPC) × 100"
  },
  {
    id: "i15", topic: "indices", level: 3, type: "num",
    prompt: "Un índice compuesto pondera relativos de precios: 120 (peso 0,5), 110 (peso 0,3) y 90 (peso 0,2). Calcula el índice ponderado.",
    answer: 111, tol: 0.02,
    explanation: "120×0,5 + 110×0,3 + 90×0,2 = 60 + 33 + 18 = 111.",
    formula: "I = Σ wᵢ·Iᵢ,  Σwᵢ = 1"
  },
  {
    id: "i16", topic: "indices", level: 3, type: "mc",
    prompt: "¿Qué sesgo se le atribuye habitualmente al índice de precios de Laspeyres?",
    options: [
      "Tiende a sobreestimar la inflación porque no incorpora la sustitución de bienes.",
      "Tiende a subestimar la inflación porque usa cantidades actuales.",
      "No tiene sesgo porque usa una canasta fija.",
      "Siempre coincide con Paasche."
    ],
    answer: 0,
    explanation: "Al mantener la canasta base, Laspeyres no capta que los consumidores sustituyen bienes que se encarecen. Eso suele producir un sesgo hacia arriba.",
    formula: "Laspeyres ↑ / Paasche ↓"
  },
  {
    id: "i17", topic: "indices", level: 2, type: "num",
    prompt: "Si Σp₁q₁ = 540 y Σp₀q₀ = 450, calcula el índice de valor (base 100).",
    answer: 120, tol: 0.02,
    explanation: "V = (540/450) × 100 = 120. El valor total creció 20%.",
    formula: "V = (Σp₁q₁ / Σp₀q₀) × 100"
  },
  {
    id: "i18", topic: "indices", level: 2, type: "mc",
    prompt: "Si se cambia el año base de un índice y se recalculan todos los valores, ¿qué ocurre?",
    options: [
      "Cambian los niveles del índice, pero no las variaciones porcentuales entre años.",
      "Cambian las variaciones porcentuales, pero no los niveles.",
      "Desaparece la serie histórica.",
      "El índice deja de ser comparable."
    ],
    answer: 0,
    explanation: "El año base solo fija el nivel 100. Las tasas de variación entre dos períodos son independientes del año elegido como base.",
    formula: "La base cambia niveles, no tasas"
  }
];

/* ------------------------------------------------------------------ */
/* Formulario                                                          */
/* ------------------------------------------------------------------ */

const FORMULAS = [
  {
    topic: "discretas",
    title: "Variables aleatorias discretas",
    items: [
      { name: "Función de probabilidad", formula: "f(x) = P(X = x)", note: "f(x) ≥ 0 y Σ f(x) = 1." },
      { name: "Función de distribución", formula: "F(x) = P(X ≤ x) = Σ f(t), t ≤ x", note: "Es no decreciente y F(x) → 1." },
      { name: "Esperanza", formula: "μ = E(X) = Σ x·f(x)", note: "Promedio ponderado por probabilidades." },
      { name: "Varianza", formula: "σ² = Σ (x − μ)²·f(x) = E(X²) − μ²", note: "Mide la dispersión alrededor de la media." },
      { name: "Bernoulli", formula: "P(X = x) = pˣ(1−p)¹⁻ˣ, x = 0, 1", note: "μ = p; σ² = p(1−p)." },
      { name: "Binomial", formula: "P(X = x) = C(n,x)·pˣ·(1−p)ⁿ⁻ˣ", note: "μ = np; σ² = np(1−p)." }
    ]
  },
  {
    topic: "hiperpoisson",
    title: "Hipergeométrica y Poisson",
    items: [
      { name: "Hipergeométrica", formula: "P(X = x) = C(K,x)·C(N−K,n−x) / C(N,n)", note: "Muestreo sin reemplazo. μ = nK/N." },
      { name: "Varianza hipergeométrica", formula: "σ² = n·(K/N)·(1−K/N)·(N−n)/(N−1)", note: "El factor (N−n)/(N−1) corrige por población finita." },
      { name: "Poisson", formula: "P(X = x) = e⁻λ·λˣ / x!", note: "Eventos por intervalo. μ = σ² = λ." },
      { name: "Aproximación binomial → Poisson", formula: "Bin(n,p) ≈ Poisson(λ = np)", note: "Cuando n es grande y p pequeño." },
      { name: "Aproximación hipergeométrica → binomial", formula: "Hipergeométrica(N,K,n) ≈ Bin(n, K/N)", note: "Cuando N es mucho mayor que n." }
    ]
  },
  {
    topic: "continuas",
    title: "Variables continuas y normal",
    items: [
      { name: "Densidad", formula: "f(x) ≥ 0,  ∫ f(x)dx = 1", note: "P(a ≤ X ≤ b) = área bajo f entre a y b." },
      { name: "Uniforme", formula: "f(x) = 1/(b−a),  a ≤ x ≤ b", note: "μ = (a+b)/2; σ² = (b−a)²/12." },
      { name: "Normal", formula: "X ~ N(μ, σ)", note: "Simétrica, unimodal; media = mediana = moda." },
      { name: "Estandarización", formula: "z = (x − μ)/σ", note: "Transforma cualquier normal en N(0,1)." },
      { name: "Simetría", formula: "Φ(−z) = 1 − Φ(z)", note: "P(Z < 0) = 0,5." },
      { name: "Regla empírica", formula: "μ ± σ ≈ 68%;  μ ± 2σ ≈ 95%;  μ ± 3σ ≈ 99,7%", note: "Aproximaciones útiles para describir datos." }
    ]
  },
  {
    topic: "sumas",
    title: "Sumas y Teorema Central del Límite",
    items: [
      { name: "Esperanza de la suma", formula: "E(X + Y) = E(X) + E(Y)", note: "Vale siempre, con o sin independencia." },
      { name: "Varianza de la suma", formula: "Var(X + Y) = Var(X) + Var(Y) + 2Cov(X,Y)", note: "Si son independientes, Cov = 0." },
      { name: "Suma de normales", formula: "X + Y ~ N(μₓ + μᵧ, √(σₓ² + σᵧ²))", note: "Válido si X e Y son independientes." },
      { name: "Media muestral", formula: "E(x̄) = μ;  σx̄ = σ/√n", note: "El error estándar baja al aumentar n." },
      { name: "Teorema Central del Límite", formula: "z = (x̄ − μ)/(σ/√n) ≈ N(0,1)", note: "Para n grande, sin importar la forma de la población." },
      { name: "Suma de n observaciones", formula: "E(ΣXᵢ) = nμ;  σ(ΣXᵢ) = √n·σ", note: "Útil para probabilidades de totales." }
    ]
  },
  {
    topic: "propiedades",
    title: "Media, varianza y covarianza",
    items: [
      { name: "Linealidad de la esperanza", formula: "E(aX + b) = a·E(X) + b", note: "También E(X ± Y) = E(X) ± E(Y)." },
      { name: "Varianza de una transformación", formula: "Var(aX + b) = a²·Var(X)", note: "La constante aditiva no afecta la dispersión." },
      { name: "Desviación estándar", formula: "σ(aX + b) = |a|·σ(X)", note: "Siempre es no negativa." },
      { name: "Fórmula de cálculo", formula: "Var(X) = E(X²) − [E(X)]²", note: "Atajo habitual para calcular la varianza." },
      { name: "Covarianza", formula: "Cov(X,Y) = E(XY) − E(X)E(Y)", note: "Positiva: las variables tienden a moverse juntas." },
      { name: "Coeficiente de variación", formula: "CV = (σ/μ) × 100", note: "Compara dispersión entre variables con distintas escalas." }
    ]
  },
  {
    topic: "indices",
    title: "Números índices",
    items: [
      { name: "Índice simple", formula: "Iₜ = (Xₜ / X₀) × 100", note: "Base 100 en el período 0." },
      { name: "Laspeyres de precios", formula: "L = (Σp₁q₀ / Σp₀q₀) × 100", note: "Canasta del período base." },
      { name: "Paasche de precios", formula: "P = (Σp₁q₁ / Σp₀q₁) × 100", note: "Canasta del período actual." },
      { name: "Laspeyres de cantidades", formula: "Q_L = (Σp₀q₁ / Σp₀q₀) × 100", note: "Precios del período base." },
      { name: "Índice de valor", formula: "V = (Σp₁q₁ / Σp₀q₀) × 100", note: "V = P_Paasche × Q_Laspeyres." },
      { name: "Inflación", formula: "π = (IPCₜ / IPCₜ₋₁ − 1) × 100", note: "Variación porcentual del nivel de precios." },
      { name: "Salario real", formula: "Salario real = (nominal / IPC) × 100", note: "Mide poder de compra." },
      { name: "Deflactar", formula: "Valor real = (nominal / IPC) × 100", note: "Elimina el efecto de la inflación." }
    ]
  }
];

const Z_VALUES = [
  { z: "0,00", p: "0,5000" },
  { z: "0,50", p: "0,6915" },
  { z: "1,00", p: "0,8413" },
  { z: "1,28", p: "0,8997" },
  { z: "1,50", p: "0,9332" },
  { z: "1,645", p: "0,9500" },
  { z: "1,96", p: "0,9750" },
  { z: "2,00", p: "0,9772" },
  { z: "2,33", p: "0,9901" },
  { z: "2,58", p: "0,9951" }
];
