# Sistema de Autenticación con AWS Amplify y shadcn/ui

Este proyecto implementa un sistema de autenticación completo utilizando AWS Amplify para la autenticación con Cognito y shadcn/ui para los componentes de la interfaz de usuario.

## Características

- Registro de usuarios
- Inicio de sesión
- Protección de rutas
- Interfaz de usuario moderna con shadcn/ui
- Validación de formularios con Zod
- Notificaciones con Sonner

## Requisitos previos

- Node.js 18 o superior
- Una cuenta de AWS
- AWS CLI configurado

## Configuración

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd <nombre-del-repositorio>
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar AWS Amplify

Para que la autenticación funcione correctamente, necesitas configurar un User Pool en AWS Cognito:

#### Requisitos de contraseña

El sistema está configurado para validar que las contraseñas cumplan con los siguientes requisitos:
- Al menos 8 caracteres
- Al menos una letra mayúscula
- Al menos una letra minúscula
- Al menos un número
- Al menos un carácter especial

Estos requisitos coinciden con la política de contraseñas predeterminada de AWS Cognito.

1. Inicia sesión en la consola de AWS
2. Ve a Amazon Cognito
3. Crea un nuevo User Pool
4. Configura las opciones según tus necesidades (autenticación por email, políticas de contraseñas, etc.)
5. Anota el ID del User Pool y el ID del cliente web

Luego, actualiza el archivo `src/amplifyconfiguration.json` con tus propios valores:

```json
{
  "Auth": {
    "Cognito": {
      "userPoolId": "tu-user-pool-id",
      "userPoolClientId": "tu-client-id",
      "identityPoolId": "",
      "allowGuestAccess": false,
      "loginWith": {
        "email": true,
        "phone": false,
        "username": true,
        "oauth": {
          "domain": "tu-dominio.auth.tu-region.amazoncognito.com",
          "scopes": ["email", "openid", "profile"],
          "redirectSignIn": ["http://localhost:3000/"],
          "redirectSignOut": ["http://localhost:3000/"],
          "responseType": "code"
        }
      }
    }
  }
}
```

### 4. Ejecutar el proyecto

```bash
npm run dev
```

La aplicación estará disponible en http://localhost:3000.

## Estructura del proyecto

- `src/app`: Páginas de la aplicación (login, signup, dashboard)
- `src/components/ui`: Componentes de shadcn/ui
- `src/components/providers`: Proveedores de contexto (tema, autenticación)
- `src/lib`: Utilidades y configuración de Amplify
- `src/middleware.ts`: Middleware para protección de rutas

## Flujo de autenticación

1. El usuario accede a la página principal
2. Puede elegir registrarse o iniciar sesión
3. Al registrarse, se crea una cuenta en Cognito
4. Al iniciar sesión, se obtiene un token de autenticación
5. Las rutas protegidas verifican la autenticación a través del middleware
6. El usuario puede cerrar sesión desde el dashboard

## Personalización

### Componentes de UI

Puedes añadir más componentes de shadcn/ui con:

```bash
npx shadcn add <nombre-del-componente>
```

### Estilos

Los estilos se gestionan con Tailwind CSS. Puedes personalizar los colores y otros aspectos en:

- `src/app/globals.css`: Variables CSS globales
- `tailwind.config.js`: Configuración de Tailwind

### Autenticación

Puedes modificar las opciones de autenticación en:

- `src/components/providers/auth-provider.tsx`: Lógica de autenticación
- `amplify/auth/resource.ts`: Configuración de Amplify
