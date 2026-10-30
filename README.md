# Estadística · Laboratorio de práctica

**Sitio publicado:** https://ezeorue.github.io/estadistica-lab/

Aplicación web interactiva para practicar los temas centrales de un curso de estadística para negocios y economía. Funciona enteramente en el navegador: no necesita backend, registro ni instalación.

**Contenidos:** variables aleatorias discretas y continuas, funciones de probabilidad y densidad, Bernoulli, binomial, hipergeométrica, Poisson, uniforme, normal y normal estándar, sumas de variables aleatorias, Teorema Central del Límite, propiedades de media y varianza, covarianza y números índices (Laspeyres, Paasche, IPC e inflación).

Basado en Anderson, *Estadística para negocios y economía*, capítulos V, VI, VII y XX.

## Características

- **108 preguntas** curadas, con respuesta múltiple y respuesta numérica (acepta coma decimal y fracciones).
- **Modo práctica** con corrección inmediata, pistas con costo en puntos y rachas.
- **Modo examen** con corrección diferida al finalizar.
- **Repaso de fallos** para volver a intentar las preguntas erradas.
- **Progreso local** por tema, historial de sesiones y dominio estimado, guardado en `localStorage`.
- **Formulario de referencia** y **calculadoras** de binomial, Poisson, normal y números índices.
- Tema claro/oscuro, diseño responsive y atajos de teclado.

## Estructura

```
index.html   Estructura de la aplicación y vistas
styles.css   Sistema de diseño, temas y responsive
data.js      Temas, 108 preguntas, formulario y tabla normal
app.js       Lógica del juego, persistencia y calculadoras
```

Sin dependencias externas, frameworks ni paso de compilación.

## Uso local

Abrí `index.html` directamente o serví la carpeta con cualquier servidor estático:

```bash
python -m http.server 8000
```

Luego visitá `http://localhost:8000`.

## Publicación en GitHub Pages

El sitio se publica desde la rama `main`, carpeta raíz (`/`).

```bash
git init
git add .
git commit -m "Estadística · laboratorio de práctica"
git branch -M main
git remote add origin git@github.com:USUARIO/estadistica-lab.git
git push -u origin main
```

En GitHub: **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `/ (root)`**.

## Privacidad

Todo el progreso se guarda únicamente en el navegador del usuario mediante `localStorage`. No se envía información a ningún servidor.
