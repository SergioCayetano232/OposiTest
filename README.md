# OposiTest 🎯

App de tests para preparar la oposición de Auxiliar de Producción de la FNMT.
La empecé a hacer al ponerme a estudiar la mía: quería poder hacer tests infinitos de cada tema y simulacros que puntúen
exactamente como el examen real, sin depender de apps de pago.

**Pruébala aquí:** https://oposi-test.vercel.app

## Qué hace

- Tests de 25 preguntas por tema: convenio colectivo, prevención de riesgos
  laborales, lengua y matemáticas.
- Las preguntas salen barajadas del banco, así que cada test es distinto.
- Se puede dejar una pregunta en blanco, igual que en el examen.
- Simulacro de examen: 50 preguntas de todos los temas con 60 minutos de
  reloj. Si se acaba el tiempo, se corrige solo.
- Corrección con la puntuación real de la convocatoria: los aciertos suman 1,
  los fallos restan 1/3 y las blancas no puntúan.
- Repaso de falladas: cada error con la respuesta correcta marcada y una
  explicación con su artículo o norma de referencia.
- Guarda tus intentos y tu mejor nota por tema en el navegador.

## El banco de preguntas

Las preguntas son propias, redactadas a partir del temario oficial que publica
la FNMT (el XI Convenio Colectivo y el manual de PRL) más contenido general de
lengua y matemáticas de nivel de examen. Cada explicación cita el artículo o
la norma de donde sale la respuesta. El banco está en un archivo de datos con
un formato sencillo, pensado para poder ir añadiendo tandas nuevas según
avanzo con el temario.

## Con qué está hecha

- **Angular** (componentes, servicios, rutas con parámetros)
- **TypeScript**
- **CSS** sin librerías
- **localStorage** para las estadísticas


## Ejecutarla en local

```bash
git clone https://github.com/SergioCayetano232/OposiTest.git
cd OposiTest
npm install
ng serve
```

Y abrir http://localhost:4200

## Pendiente para próximas versiones

- Ampliar el banco de preguntas (el objetivo es pasar de varios cientos).
- Estadísticas más completas: evolución de la nota, preguntas más falladas.
- Un modo de repaso solo con las preguntas que has fallado alguna vez.

