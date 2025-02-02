# 📦 Proyecto Final

PoliJuego es un juego desarrollado con libGDX, utilizando el generador de proyectos gdx-liftoff.

Este proyecto tiene como objetivo proporcionar una experiencia de juego interactiva, permitiendo a los jugadores explorar un entorno en 2D mientras enfrentan enemigos, resuelven obstáculos y utilizan mecánicas de juego como saltos y colisiones.

## 🚀 Autores

- Silvia Chaluisa
- Marcelo Pinzón
- Erick Caiza


## 🛠️ Requisitos para el proyecto

### 1.	Configuración de los Contenedores de la Aplicación Web
Crear tres nodos que ejecuten la misma aplicación web. La aplicación debe contener al menos:
- Una página con contenido propio.
- Un formulario para el ingreso de información.
- Una base de datos para almacenar la información ingresada a través del formulario.
### 2.	Configuración del Balanceador de Carga con NGINX
- Configurar NGINX como balanceador de carga para distribuir el tráfico entre los contenedores de la aplicación web de manera proporcional utilizando balanceo por pesos.
-	Asignar un peso a cada nodo según su capacidad o criterio específico para garantizar que el tráfico se distribuya en función de los recursos disponibles de cada servidor.
- 	Verificar que la configuración respete las proporciones establecidas en los pesos asignados.
### 3.	 Implementación de la Replicación de la Base de Datos
-	Crear un contenedor para la base de datos que actúe como el servidor principal utilizada por la aplicación web.
-	Crear un contenedor adicional que funcione como servidor esclavo del servidor principal.
-	Usar una herramienta para gestionar y verificar la replicación de la base de datos.
### 4.	Orquestación de Contenedores
-	Utilizar Docker Compose, para gestionar y definir la configuración y las relaciones entre los diferentes contenedores de la infraestructura.
### 5.	Pruebas
Realizar pruebas de rendimiento para evaluar el desempeño del sistema.
