# Arquitectura — Simulador de Trabajo Mecánico

Documento técnico que describe cómo está construida la app: navegación, pantallas, componentes, estado global (Redux), utilidades de física y los flujos principales.

> Los diagramas usan **Mermaid**. Se ven renderizados en GitHub, GitLab y en VS Code (con la extensión *Markdown Preview Mermaid Support*).

---

## 1. Resumen

App educativa de **Física 1** que simula el **trabajo mecánico**:

$$W = |F| \cdot d \cdot \cos(\theta)$$

El usuario ingresa **fuerza (N)**, **ángulo (°)**, **distancia (m)** y **masa (kg)**. La app calcula las componentes de la fuerza, el trabajo, la aceleración y la cinemática del cuerpo, y lo muestra en tarjetas de resultados, un gráfico vectorial SVG y una animación del desplazamiento con leyenda en tiempo real. Una segunda pestaña ofrece una **wiki** de conceptos en forma de tarjetas.

Funciona en **Android, iOS (Expo Go)** y **Web**.

---

## 2. Stack tecnológico

| Capa | Tecnología | Uso en la app |
|---|---|---|
| Plataforma | Expo SDK 55 · React Native 0.83 · React 19.2 | Base multiplataforma |
| Navegación | Expo Router (rutas por archivos) | `Stack` raíz + `Tabs` inferiores |
| Estado | Redux Toolkit + React-Redux | Slices `theme`, `simulator`, `wiki` |
| UI | React Native Paper (Material Design 3) | Tarjetas, inputs, botones, Appbar, tema |
| Gráficos | react-native-svg | Gráfico vectorial de fuerza |
| Animación | API `Animated` de React Native | Bienvenida y desplazamiento del bloque |
| Íconos | `@expo/vector-icons` (MaterialCommunityIcons) | Tabs, tarjetas, flechas |
| Web | react-native-web | Versión navegador |
| Build | EAS Build (`eas.json`) | APK / AAB en la nube |

---

## 3. Estructura de carpetas

```text
simulador-proyectoFisica/
├── app/                        # RUTAS (Expo Router): solo archivos delgados
│   ├── _layout.jsx             # Layout raíz: Redux + Paper + Stack
│   ├── index.jsx               # "/"  → WelcomeScreen
│   └── (tabs)/
│       ├── _layout.jsx         # Barra de pestañas flotante
│       ├── simulator.jsx       # "/simulator" → SimulatorScreen
│       └── wiki.jsx            # "/wiki"      → WikiScreen
│
├── modules/                    # FUNCIONALIDADES (feature modules)
│   ├── home/
│   │   ├── screens/            # WelcomeScreen, SimulatorScreen
│   │   ├── components/         # WelcomeCard, ResultCard, ForceVectorChart, PhysicsAnimation
│   │   └── stores/             # simulatorSlice.js
│   └── wiki/
│       ├── screens/            # WikiScreen
│       ├── components/         # WikiCard, ProgressBar
│       └── stores/             # wikiSlice.js
│
├── src/                        # CÓDIGO COMPARTIDO
│   ├── components/Header.jsx   # Appbar con botón de modo oscuro
│   ├── stores/index.js         # configureStore (combina los slices)
│   ├── stores/themeSlice.js    # Modo claro / oscuro
│   ├── styles/theme.js         # Temas MD3 verdes (light / dark)
│   └── utils/physicsCalculations.js   # Funciones puras de física
│
├── data/wikiData.json          # Contenido de la wiki
├── assets/                     # Íconos y splash
├── app.json                    # Configuración Expo (nombre, scheme, íconos…)
└── eas.json                    # Perfiles de build en la nube
```

> `App.js` e `index.js` son restos de la plantilla inicial y **no se usan**: el punto de entrada es `expo-router/entry` (`"main"` en `package.json`).

**Regla de capas:** `app/` solo enruta → `modules/` contiene pantallas y lógica de cada funcionalidad → `src/` contiene lo reutilizable por todas.

---

## 4. Vista general por capas

```mermaid
flowchart TB
    subgraph RUTAS["app/ — Rutas (Expo Router)"]
        R0["_layout.jsx"]
        R1["index.jsx"]
        R2["(tabs)/_layout.jsx"]
        R3["(tabs)/simulator.jsx"]
        R4["(tabs)/wiki.jsx"]
    end

    subgraph MODULOS["modules/ — Funcionalidades"]
        subgraph HOME["home"]
            S1["WelcomeScreen"]
            S2["SimulatorScreen"]
            C1["WelcomeCard"]
            C2["ResultCard"]
            C3["ForceVectorChart"]
            C4["PhysicsAnimation"]
            ST1[("simulatorSlice")]
        end
        subgraph WIKI["wiki"]
            S3["WikiScreen"]
            C5["WikiCard"]
            C6["ProgressBar"]
            ST2[("wikiSlice")]
        end
    end

    subgraph SHARED["src/ — Compartido"]
        H["Header"]
        STORE[("store (index.js)")]
        ST3[("themeSlice")]
        TH["theme.js"]
        U["physicsCalculations.js"]
    end

    DATA[("data/wikiData.json")]

    R1 --> S1
    R3 --> S2
    R4 --> S3
    R0 --> STORE
    R0 --> TH

    S1 --> C1
    S2 --> H & C2 & C3 & C4
    S3 --> H & C5 & C6

    STORE --> ST1 & ST2 & ST3
    ST1 --> U
    C2 --> U
    ST2 --> DATA
    S3 --> DATA
```

---

## 5. Navegación

La navegación se define **por archivos** dentro de `app/`. Hay un `Stack` raíz (sin encabezados) que contiene la pantalla de bienvenida y el grupo de pestañas `(tabs)`. Los paréntesis indican un **grupo**: no aparece en la URL.

```mermaid
flowchart LR
    START(["Abrir app"]) --> IDX

    subgraph STACK["Stack raíz — app/_layout.jsx"]
        IDX["/ <br/> index.jsx <br/> WelcomeScreen"]
        subgraph TABS["Tabs — app/(tabs)/_layout.jsx"]
            SIM["/simulator <br/> Simular"]
            WK["/wiki <br/> Wiki"]
        end
    end

    IDX -- "Botón 'Iniciar Experimentación' <br/> router.replace('/(tabs)/simulator')" --> SIM
    SIM <-- "Tocar pestaña" --> WK
```

- `router.replace` **reemplaza** la bienvenida en el historial: al presionar "atrás" desde las pestañas no se regresa a ella.
- La barra de pestañas es **flotante** (`position: 'absolute'`, bordes redondeados), por lo que cada pantalla deja un `paddingBottom` (~90–110 px) para que el contenido no quede oculto.

| Ruta | Archivo | Pantalla | Ícono pestaña |
|---|---|---|---|
| `/` | `app/index.jsx` | `WelcomeScreen` | — |
| `/simulator` | `app/(tabs)/simulator.jsx` | `SimulatorScreen` | `calculator` |
| `/wiki` | `app/(tabs)/wiki.jsx` | `WikiScreen` | `book-open-variant` |

---

## 6. Árbol de proveedores (layout raíz)

```mermaid
flowchart TB
    A["RootLayout"] --> B["ReduxProvider store={store}"]
    B --> C["MainLayout <br/> lee state.theme.isDarkMode"]
    C --> D["PaperProvider theme={lightTheme | darkTheme}"]
    D --> E["Stack (headerShown: false)"]
    E --> F["index → WelcomeScreen"]
    E --> G["(tabs) → TabsLayout"]
    G --> H["simulator → SimulatorScreen"]
    G --> I["wiki → WikiScreen"]
```

`MainLayout` está separado de `RootLayout` porque necesita `useSelector`, y ese hook solo funciona **dentro** del `ReduxProvider`.

---

## 7. Pantallas y componentes

```mermaid
flowchart TB
    subgraph W["WelcomeScreen"]
        W1["Animated.View (fade-in 800 ms)"] --> W2["WelcomeCard <br/> ícono átomo + título + descripción"]
        W1 --> W3["Button 'Iniciar Experimentación'"]
    end

    subgraph S["SimulatorScreen"]
        S0["Header"]
        S1["Card 'Parámetros de Entrada' <br/> F, θ, d, m + Restablecer"]
        S2["ResultCard <br/> W, interpretación, Fx, Fy"]
        S3["ForceVectorChart <br/> SVG: ejes, F, Fx, Fy, θ"]
        S4["PhysicsAnimation <br/> riel + bloque + leyenda en tiempo real"]
        S4 --> S5["LiveLegend"] --> S6["DataItem ×4"]
    end

    subgraph K["WikiScreen"]
        K0["Header"]
        K1["ProgressBar <br/> 'n de total'"]
        K2["WikiCard <br/> título, fórmula, puntos clave, aplicación"]
        K3["Botones Anterior / Siguiente"]
    end
```

### Responsabilidad de cada componente

| Componente | Ubicación | Props | Responsabilidad |
|---|---|---|---|
| `Header` | `src/components` | `title` | Appbar con título y botón sol/luna que despacha `toggleTheme()` |
| `WelcomeCard` | `home/components` | — | Presentación visual de la app |
| `ResultCard` | `home/components` | `work, fx, fy, angle` | Muestra W, Fx, Fy y la interpretación (positivo / nulo / negativo) con su color |
| `ForceVectorChart` | `home/components` | `force, angle, fx, fy` | Dibuja en SVG (300×200) el vector F y sus componentes. La longitud se limita entre 40 y 180 px |
| `PhysicsAnimation` | `home/components` | `distance, mass, angle, acceleration, kinematics` | Anima el bloque sobre un riel a escala y controla la leyenda en tiempo real |
| `LiveLegend` | dentro de `PhysicsAnimation` | `progress, isRunning, acceleration, kinematics, distance` | Muestra a, t, x(t), v(t) y el estado del movimiento |
| `WikiCard` | `wiki/components` | `item` | Renderiza un concepto de `wikiData.json` |
| `ProgressBar` | `wiki/components` | `currentIndex, total` | Barra de progreso de lectura |

**Patrón:** las **pantallas** se conectan a Redux (`useSelector` / `useDispatch`); los **componentes** son presentacionales y reciben todo por props (excepto `Header`, que maneja el tema).

---

## 8. Estado global (Redux Toolkit)

```mermaid
flowchart LR
    subgraph STORE["store = configureStore (src/stores/index.js)"]
        T["theme <br/> { isDarkMode: false }"]
        SM["simulator <br/> { force: 50, angle: 30, <br/> distance: 10, mass: 5 }"]
        WI["wiki <br/> { currentIndex: 0, <br/> totalItems: 5 }"]
    end

    HDR["Header"] -- "toggleTheme()" --> T
    T -- "isDarkMode" --> ROOT["MainLayout → PaperProvider"]

    SIMS["SimulatorScreen"] -- "setForce · setAngle <br/> setDistance · setMass <br/> resetValues" --> SM
    SM -- "selectPhysicsResults <br/> (memoizado)" --> SIMS

    WIKS["WikiScreen"] -- "nextCard · previousCard" --> WI
    WI -- "currentIndex" --> WIKS
```

### Slices

| Slice | Archivo | Estado | Acciones |
|---|---|---|---|
| `theme` | `src/stores/themeSlice.js` | `isDarkMode` | `toggleTheme`, `setDarkMode` |
| `simulator` | `modules/home/stores/simulatorSlice.js` | `force`, `angle`, `distance`, `mass` | `setForce`, `setAngle`, `setDistance`, `setMass`, `resetValues` |
| `wiki` | `modules/wiki/stores/wikiSlice.js` | `currentIndex`, `totalItems` | `nextCard`, `previousCard`, `setCardIndex` (validan los límites) |

### Principio clave: el store guarda solo **entradas**

El slice `simulator` almacena únicamente los 4 valores que escribe el usuario. Todo lo derivado se calcula en el selector **`selectPhysicsResults`**, creado con `createSelector` (memoización): solo recalcula cuando cambia `state.simulator`, y devuelve el **mismo objeto** si nada cambió, evitando renders innecesarios.

```mermaid
flowchart LR
    IN[("state.simulator <br/> force, angle, distance, mass")] --> SEL{{"selectPhysicsResults <br/> createSelector"}}
    SEL --> OUT["{ force, angle, distance, mass, <br/> fx, fy, work, <br/> acceleration, kinematics }"]
    U["physicsCalculations.js"] -.-> SEL
```

---

## 9. Utilidades de física (`src/utils/physicsCalculations.js`)

Funciones **puras** (sin React ni Redux), fáciles de probar y reutilizar.

| Función | Fórmula | Devuelve |
|---|---|---|
| `degToRad(deg)` | `deg · π / 180` | radianes |
| `calculateFx(F, θ)` | `Fx = F · cos θ` | componente paralela (N) |
| `calculateFy(F, θ)` | `Fy = F · sin θ` | componente perpendicular (N) |
| `calculateWork(F, d, θ)` | `W = Fx · d` | trabajo (J) |
| `getWorkInterpretation(θ, W)` | clasifica el signo de W | `{ type, description, color }` |
| `calculateAcceleration(F, θ, m)` | `a = Fx / m` (2.ª ley de Newton) | m/s² (0 si m ≤ 0) |
| `calculateKinematics(W, m, d)` | `v = √(2·|W| / m)`, `t = 2d / v` | `{ mode, initialVelocity, finalVelocity, time }` |

### Clasificación del trabajo y modo de movimiento

```mermaid
flowchart TD
    A["Calcular W = F · d · cos θ"] --> B{"¿m > 0 y d > 0?"}
    B -- No --> N["mode: 'nulo' <br/> sin movimiento"]
    B -- Sí --> C{"|W| < 0.001 ?"}
    C -- Sí --> N2["W = 0 · Trabajo nulo (naranja) <br/> mode: 'nulo' · el cuerpo no se mueve"]
    C -- No --> D{"W > 0 ?"}
    D -- Sí --> P["Trabajo positivo / motor (verde) <br/> mode: 'acelera' <br/> v₀ = 0 → v = √(2W/m)"]
    D -- No --> Q["Trabajo negativo / resistente (rojo) <br/> mode: 'frena' <br/> v₀ = √(2|W|/m) → v = 0"]
```

Base física — **teorema trabajo-energía** con aceleración constante:

- `W = ΔEc = ½·m·v² − ½·m·v₀²`
- `x(t) = v₀·t + ½·a·t²`
- `v(t) = v₀ + a·t`

---

## 10. Flujo de datos del simulador

Qué ocurre cuando el usuario cambia un valor (por ejemplo, la fuerza):

```mermaid
sequenceDiagram
    actor U as Usuario
    participant SS as SimulatorScreen
    participant ST as Redux store
    participant R as simulatorSlice
    participant SEL as selectPhysicsResults
    participant PC as physicsCalculations
    participant UI as ResultCard / ForceVectorChart / PhysicsAnimation

    U->>SS: escribe "80" en "Magnitud de Fuerza"
    SS->>ST: dispatch(setForce(80))
    ST->>R: reducer actualiza state.simulator.force
    ST-->>SS: notifica cambio (useSelector)
    SS->>SEL: selectPhysicsResults(state)
    SEL->>PC: calculateFx, calculateFy, calculateWork,<br/>calculateAcceleration, calculateKinematics
    PC-->>SEL: valores derivados
    SEL-->>SS: nuevo objeto results
    SS->>UI: props actualizadas
    UI-->>U: tarjetas, gráfico y riel re-renderizados
    Note over UI: PhysicsAnimation regresa el bloque a x = 0<br/>y reinicia la leyenda
```

---

## 11. Workflow de la animación de desplazamiento

### Escalas

- **Espacial:** el riel completo representa **50 m**. `travelPx = min(d, 50) / 50 × (anchoRiel − 50 px)`. El ancho del riel se mide con `onLayout`.
- **Temporal:** la duración es el **tiempo físico real** `t`, limitada a **0.5 s – 6 s** para que sea visible. Si se ajusta, se avisa ("acelerada" / "en cámara lenta").
- **Curva (easing):** representa aceleración constante:
  - `acelera` → `Easing.in(Easing.quad)` (x ∝ t²)
  - `frena` → `Easing.out(Easing.quad)` (desacelera hasta detenerse)

### Secuencia al presionar "Ejecutar Animación"

```mermaid
sequenceDiagram
    actor U as Usuario
    participant PA as PhysicsAnimation
    participant AN as Animated (hilo nativo)
    participant RAF as requestAnimationFrame
    participant LL as LiveLegend

    U->>PA: presiona "Ejecutar Animación"
    PA->>AN: translateX = 0 → travelPx<br/>(duration, easing, useNativeDriver)
    PA->>RAF: inicia ciclo tick()
    loop cada cuadro (~60 fps)
        RAF->>PA: fracción = transcurrido / duración
        PA->>LL: progress
        LL->>LL: t = fracción · tiempo real<br/>x = v₀t + ½at²<br/>v = v₀ + at
        LL-->>U: muestra a, t, x, v
    end
    RAF->>PA: fracción = 1 → isRunning = false
    LL-->>U: "Movimiento completado"
```

### Estados de la animación

```mermaid
stateDiagram-v2
    [*] --> Deshabilitada: m ≤ 0 · W = 0 · d = 0
    [*] --> EnReposo: parámetros válidos
    Deshabilitada --> EnReposo: el usuario corrige los parámetros
    EnReposo --> Animando: Ejecutar Animación
    Animando --> Completada: progress = 1
    Completada --> Animando: Ejecutar de nuevo
    Animando --> EnReposo: cambia un parámetro (reinicio)
    Completada --> EnReposo: cambia un parámetro (reinicio)
    EnReposo --> Deshabilitada: parámetros inválidos
```

> El bloque se mueve con el **driver nativo** (fluido aunque el hilo de JS esté ocupado); la leyenda se actualiza en JS con `requestAnimationFrame`, sincronizada por tiempo transcurrido. Al desmontar o cambiar parámetros, el ciclo se cancela con `cancelAnimationFrame`.

---

## 12. Tema claro / oscuro

```mermaid
sequenceDiagram
    actor U as Usuario
    participant H as Header
    participant ST as themeSlice
    participant ML as MainLayout
    participant P as PaperProvider
    participant C as Todos los componentes

    U->>H: toca ícono 🌙 / ☀️
    H->>ST: dispatch(toggleTheme())
    ST-->>ML: isDarkMode cambia
    ML->>P: theme = darkTheme | lightTheme
    P-->>C: useTheme() devuelve nuevos colores
```

Los temas (`src/styles/theme.js`) extienden `MD3LightTheme` / `MD3DarkTheme` con una paleta **verde**. Por eso los componentes leen los colores con `useTheme()` en lugar de escribirlos fijos. Las únicas excepciones son los colores semánticos de la interpretación del trabajo (verde / naranja / rojo) y algunos trazos grises del SVG.

---

## 13. Flujo de la wiki

```mermaid
flowchart LR
    J[("data/wikiData.json <br/> 5 conceptos")] --> SL["wikiSlice <br/> totalItems = length"]
    J --> WS["WikiScreen <br/> item = wikiData[currentIndex]"]
    SL -- "currentIndex" --> WS
    WS --> PB["ProgressBar (n de total)"]
    WS --> WC["WikiCard (item)"]
    WS -- "Anterior / Siguiente" --> SL
```

Estructura de cada concepto:

```json
{
  "id": "concept_1",
  "title": "Trabajo Mecánico (W)",
  "subtitle": "Definición y Producto Escalar",
  "formula": "W = |F| · |d| · cos(θ)",
  "description": "…",
  "keyPoints": ["…", "…"],
  "application": "…"
}
```

Conceptos actuales: Trabajo Mecánico · Componentes de la Fuerza · Leyes de Newton · Fuerza Normal y Rozamiento · Teorema del Trabajo y la Energía.

---

## 14. Diseño responsivo

`SimulatorScreen` decide el layout con `useWindowDimensions`:

```mermaid
flowchart TD
    A{"Platform.OS === 'web' <br/> y ancho ≥ 768 px ?"}
    A -- Sí --> G["Cuadrícula 2 × 2 <br/> tarjetas al 48.5 % <br/> la tarjeta de parámetros usa height: 100 % para igualar alturas"]
    A -- No --> L["Columna (móvil) <br/> tarjetas al 100 % dentro del ScrollView"]
```

> En móvil **no** se aplica `height: '100%'` a la tarjeta de parámetros: dentro de un `ScrollView` se resolvía contra la altura visible y empujaba las demás tarjetas fuera de la pantalla.

---

## 15. Ejecución y build

```mermaid
flowchart LR
    DEV["Código fuente"] --> A["npx expo start"]
    A --> B["Expo Go (Android / iOS) <br/> escanear QR"]
    A --> C["Navegador <br/> npx expo start --web"]
    DEV --> D["npx eas-cli@latest build -p android"]
    D --> E["EAS Build (nube) <br/> perfiles en eas.json"]
    E --> F["APK / AAB descargable"]
    DEV --> G["npx expo run:android <br/> (build nativo local)"]
```

| Comando | Para qué |
|---|---|
| `npx expo start` | Servidor de desarrollo (Expo Go o web) |
| `npx expo start --web` | Abrir en el navegador |
| `npx expo run:android` | Build nativo local (genera `android/`) |
| `npx eas-cli@latest build -p android --profile preview` | Build en la nube |
| `npx expo-doctor` | Diagnóstico de dependencias y configuración |

Notas:
- `android/` e `ios/` se **generan** automáticamente (Continuous Native Generation) y están en `.gitignore`. La configuración nativa va en `app.json`.
- En Windows, los builds locales pueden fallar si la ruta del proyecto es muy larga (límite de 260 caracteres de `ninja`). Usa una ruta corta o EAS Build.
- Perfiles en `eas.json`: `development` (dev client), `preview` (distribución interna), `production` (versión autoincremental).

---

## 16. Cómo extender la app

| Quiero… | Pasos |
|---|---|
| **Agregar un concepto a la wiki** | Añadir un objeto a `data/wikiData.json`. `totalItems` y la barra de progreso se actualizan solos. |
| **Agregar un parámetro al simulador** | 1) Estado inicial + acción en `simulatorSlice` · 2) Cálculo puro en `physicsCalculations.js` · 3) Incluirlo en `selectPhysicsResults` · 4) `TextInput` en `SimulatorScreen` · 5) Pasarlo por props al componente que lo use. |
| **Agregar una pestaña** | Crear `app/(tabs)/nueva.jsx` (ruta delgada) + `<Tabs.Screen name="nueva">` en `app/(tabs)/_layout.jsx` + la pantalla en `modules/<feature>/screens/`. |
| **Agregar un slice** | Crearlo en `modules/<feature>/stores/` y registrarlo en `src/stores/index.js`. |
| **Cambiar colores** | Editar `src/styles/theme.js` (ambos temas). |

**Convenciones:** textos de la interfaz y comentarios en **español**; componentes de **react-native-paper**; colores desde `useTheme()`; íconos de `@expo/vector-icons`; importaciones con rutas relativas.
