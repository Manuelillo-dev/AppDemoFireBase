# Firebase E-commerce App

## Descripción del Proyecto
Esta aplicación está diseñada para satisfacer las necesidades de puntos de venta y comercio electrónico. Está desarrollada con **React Native**, **Firebase** y una arquitectura limpia, enfocándose en la gestión de productos, carrito de compras y autenticación. El objetivo principal es proporcionar una solución eficiente para administrar inventarios, procesar compras y ofrecer roles diferenciados para usuarios administradores y clientes.

## **Características Principales**
1. **Autenticación Firebase**:
   - Inicio de sesión y registro de usuarios con correo y contraseña.
   - Roles diferenciados:
     - **Admin**: Gestión completa de productos (CRUD).
     - **Cliente**: Navegación de productos, carrito y compras.
   - Opción de cerrar sesión desde cualquier pantalla.

2. **Gestión de Productos (Admin)**:
   - Crear, leer, actualizar y eliminar productos.
   - Los cambios se reflejan directamente en Firebase Firestore.
   - Interfaz simple y responsiva.

3. **Carrito de Compras (Cliente)**:
   - Añadir, incrementar o decrementar productos en el carrito.
   - Cálculo dinámico del total del carrito.
   - Vaciar carrito completo con un solo clic.
   - Los datos se sincronizan automáticamente con Firestore.

4. **Base de Datos Firebase**:
   - **Productos**: Gestión centralizada de inventario.
   - **Carrito**: Personalizado para cada cliente.
   - **Usuarios**: Estructura que diferencia roles de usuarios.

5. **UI/UX Mejorada**:
   - Botones intuitivos y acciones claras.
   - Estilos consistentes entre pantallas.

---

## **Requisitos Previos**
- Node.js (versión LTS recomendada).
- Yarn o npm como gestor de paquetes.
- Expo CLI instalado globalmente.
- Cuenta de Firebase configurada.

---

## **Instalación**

1. **Clonar el Repositorio**
   ```bash
   git clone https://github.com/tu-usuario/tu-repo.git
   cd tu-repo
   ```

2. **Instalar Dependencias**
   ```bash
   yarn install
   ```

3. **Configurar Firebase**
   - Crea un proyecto en Firebase.
   - Habilita **Authentication** (correo y contraseña).
   - Configura **Firestore Database**:
     - Colección `users`:
       ```json
       {
         "name": "Nombre del usuario",
         "email": "Correo del usuario",
         "phone": "Teléfono del usuario",
         "role": "admin o client"
       }
       ```
     - Colección `products`:
       ```json
       {
         "name": "Nombre del producto",
         "price": "Precio del producto"
       }
       ```
     - Colección `cart`:
       ```json
       {
         "userId": "ID del usuario",
         "productId": "ID del producto",
         "name": "Nombre del producto",
         "price": "Precio del producto",
         "quantity": "Cantidad"
       }
       ```
   - Copia tu configuración de Firebase al archivo `firebaseConfig.js`.

4. **Ejecutar la Aplicación**
   ```bash
   expo start
   ```

---

## **Arquitectura**

### **Pantallas Principales**
1. **LoginScreen**:
   - Permite a los usuarios iniciar sesión según su rol.
   - Redirige a las pantallas específicas de `Admin` o `Client`.

2. **AdminScreen**:
   - Gestión de productos con acciones CRUD.
   - Sincronización automática con Firestore.

3. **ClientScreen**:
   - Navegación de productos.
   - Carrito de compras funcional (incrementar, decrementar, vaciar).
   - Reflejo de los datos en Firebase en tiempo real.

4. **HomeScreen**:
   - Redirige según el rol del usuario autenticado.

---

## **Lógica de Negocio**
1. **Roles de Usuario**:
   - **Admin**:
     - Gestiona productos para su venta.
     - Accede exclusivamente a las funciones de CRUD.
   - **Cliente**:
     - Visualiza los productos cargados por el administrador.
     - Administra su carrito personal.

2. **Sincronización con Firebase**:
   - Los datos de productos, carrito y usuarios se gestionan en tiempo real.
   - Firebase Firestore actúa como el backend centralizado.

3. **Autenticación y Sesión**:
   - Firebase Authentication asegura un inicio de sesión seguro.
   - Opción de cerrar sesión desde cualquier pantalla.

4. **Carrito Personalizado**:
   - Cada usuario tiene su propio carrito basado en su `userId`.
   - Los cambios en el carrito se sincronizan automáticamente con Firestore.

---

## **Tecnologías Utilizadas**
- **Frontend**:
  - React Native
  - Expo CLI
- **Backend**:
  - Firebase (Authentication y Firestore Database)

---

## **Próximas Mejoras**
- **Integración con Métodos de Pago**:
  - Implementar integración con plataformas como PayPal o Stripe.
- **Notificaciones Push**:
  - Notificar a los clientes sobre ofertas o cambios en productos.
- **Historial de Compras**:
  - Registrar las compras realizadas por los clientes.
- **Optimización de UI/UX**:
  - Mejorar la experiencia del usuario con animaciones y transiciones.

---

## **Contribuciones**
Si deseas contribuir, por favor sigue estos pasos:
1. Realiza un fork del repositorio.
2. Crea una nueva rama (`feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz un commit (`git commit -m "Añadida nueva funcionalidad"`).
4. Envía un pull request.

---

## **Licencia**
Este proyecto está bajo la Licencia MIT. Consulta el archivo `LICENSE` para más información.

---

¡Gracias por tu interés en nuestro proyecto! 🎉
