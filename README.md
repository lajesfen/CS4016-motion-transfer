# CS4016 Motion Transfer

Una aplicación de captura y transferencia de movimiento en tiempo real que utiliza visión por computadora para detectar poses humanas desde la entrada de webcam y aplica esos movimientos a modelos de personajes 3D. Construido con Next.js, MediaPipe y Three.js.

## ✨ Características

- **Detección de Poses en Tiempo Real**: Utiliza la estimación de poses de MediaPipe para rastrear 33 puntos corporales
- **Animación de Personajes 3D**: Transfiere las poses detectadas a modelos de personajes 3D en tiempo real
- **Múltiples Modelos de Personajes**: Viene con 3 modelos de personajes precargados (Luchador, Ninja, Amy)
- **Soporte para Modelos Personalizados**: Sube tus propios modelos 3D en formato GLB/GLTF
- **Entorno 3D Interactivo**: Controles de órbita, iluminación y ayudas de cuadrícula para mejor visualización
- **Diseño Responsivo**: Funciona en diferentes tamaños de pantalla

## 🚀 Comenzando

### Prerrequisitos

- Node.js 18+ 
- npm o yarn
- Una webcam para la detección de poses

### Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/lajesfen/CS4016-motion-transfer.git
cd CS4016-motion-transfer
```

2. Instala las dependencias:
```bash
npm install
# o
yarn install
```

3. Ejecuta el servidor de desarrollo:
```bash
npm run dev
# o
yarn dev
```

4. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

## 🎮 Cómo Usar

1. **Otorga Permisos de Cámara**: Permite que la aplicación acceda a tu webcam cuando se solicite
2. **Haz una Pose**: Párate frente a tu cámara y muévete - el personaje 3D reflejará tus movimientos
3. **Cambia de Personajes**: Usa el menú desplegable para seleccionar diferentes modelos de personajes precargados
4. **Sube Modelos Personalizados**: Haz clic en "Upload Model" para usar tus propios archivos de personajes 3D GLB/GLTF
5. **Navega la Escena 3D**: Usa los controles del mouse para orbitar, hacer zoom y desplazar la vista 3D

## 🏗️ Estructura del Proyecto

```
src/
├── app/
│   ├── globals.css          # Estilos globales
│   ├── layout.tsx           # Componente de layout raíz
│   └── page.tsx             # Página principal de la aplicación
├── components/
│   ├── CharacterModel.tsx   # Componente del modelo de personaje 3D
│   ├── ThreeView.tsx        # Wrapper del canvas de Three.js
│   └── WebcamView.tsx       # Webcam y detección de poses
├── constants/
│   └── PoseLandmarks.ts     # Índices de puntos de referencia de MediaPipe
├── hooks/
│   └── usePoseLandmarker.ts # Hook de detección de poses de MediaPipe
├── types/
│   └── Landmark.ts          # Definiciones de tipos de TypeScript
└── utils/
    └── mathUtils.ts         # Utilidades matemáticas personalizadas para transformaciones 3D
```

## 🔧 Detalles Técnicos

### Tecnologías Utilizadas

- **Next.js 15**: Framework de React con App Router
- **TypeScript**: JavaScript con tipado seguro
- **MediaPipe**: Librería de detección de poses de Google
- **Three.js**: Librería de gráficos 3D
- **React Three Fiber**: Renderizador de React para Three.js
- **React Three Drei**: Ayudantes útiles para React Three Fiber
- **Tailwind CSS**: Framework CSS utility-first

### Detección de Poses

La aplicación utiliza el modelo Pose Landmarker de MediaPipe para detectar 33 puntos corporales clave en tiempo real:
- Puntos faciales (nariz, ojos, orejas, boca)
- Parte superior del cuerpo (hombros, codos, muñecas, manos)
- Parte inferior del cuerpo (caderas, rodillas, tobillos, pies)

### Algoritmo de Transferencia de Movimiento

1. **Extracción de Puntos de Referencia**: Extrae coordenadas 3D del mundo desde MediaPipe
2. **Cálculo de Direcciones**: Calcula vectores direccionales entre puntos corporales clave
3. **Mapeo de Huesos**: Mapea las direcciones del cuerpo humano a rotaciones de huesos del modelo 3D
4. **Aplicación de Cuaterniones**: Aplica rotaciones usando utilidades matemáticas de cuaterniones personalizadas
5. **Suavizado**: Usa interpolación lineal esférica (slerp) para animaciones suaves

### Utilidades Matemáticas Personalizadas

El proyecto incluye implementaciones personalizadas para:
- Operaciones de cuaterniones (creación, inversión, multiplicación)
- Transformaciones y rotaciones de vectores
- Cálculos de dirección entre puntos de referencia
- Conversión de ángulos de Euler a cuaterniones

## 🎨 Modelos 3D Soportados

La aplicación funciona mejor con modelos de personajes con rigging que siguen la convención de nomenclatura de Mixamo:
- `mixamorigHips` - Hueso raíz
- `mixamorigSpine`, `mixamorigSpine1`, `mixamorigSpine2` - Huesos de la columna
- `mixamorigNeck`, `mixamorigHead` - Cabeza y cuello
- `mixamorigLeftArm`, `mixamorigRightArm` - Brazos superiores
- `mixamorigLeftForeArm`, `mixamorigRightForeArm` - Antebrazos
- `mixamorigLeftUpLeg`, `mixamorigRightUpLeg` - Muslos
- `mixamorigLeftLeg`, `mixamorigRightLeg` - Piernas inferiores

---

**Crafted @ UTEC** 🎓