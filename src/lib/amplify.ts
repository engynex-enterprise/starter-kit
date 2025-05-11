import { Amplify } from 'aws-amplify';
import { fetchAuthSession, signIn, signOut, signUp, confirmSignUp, getCurrentUser } from 'aws-amplify/auth';

/**
 * Configura Amplify con los ajustes de autenticación de Cognito
 */
export function configureAmplify() {
  if (typeof window !== 'undefined') {
    try {
      // Configuración manual con los valores específicos que necesitamos
      const amplifyConfig = {
        Auth: {
          Cognito: {
            userPoolId: 'us-east-1_0DpfLTIEs',
            userPoolClientId: '2ka09ri6tt6o7hajram9p95fan',
            loginWith: {
              email: true,
              username: true
            }
          }
        }
      };
      
      // Usar 'as any' para evitar problemas de tipo
      Amplify.configure(amplifyConfig as any);
      console.log('Amplify configurado con Cognito');
    } catch (error) {
      console.error('Error al configurar Amplify:', error);
    }
  }
}

/**
 * Verifica si el usuario está autenticado con Cognito
 * @returns {Promise<boolean>} - true si el usuario está autenticado
 */
export async function isAuthenticated() {
  try {
    const session = await fetchAuthSession();
    return !!session.tokens;
  } catch {
    return false;
  }
}

/**
 * Inicia sesión con Cognito
 * @param {string} username - Nombre de usuario o email
 * @param {string} password - Contraseña
 * @returns {Promise<boolean>} - true si el inicio de sesión fue exitoso
 */
export async function cognitoSignIn(username: string, password: string): Promise<boolean> {
  try {
    // En Amplify v6, signIn devuelve el resultado de la autenticación
    await signIn({ username, password });
    // Si llegamos aquí sin errores, la autenticación fue exitosa
    return true;
  } catch (error) {
    console.error("Error en cognitoSignIn:", error);
    throw error; // Propagar el error para manejarlo en el componente
  }
}

/**
 * Registra un nuevo usuario en Cognito
 * @param {string} username - Nombre de usuario
 * @param {string} password - Contraseña
 * @param {string} email - Correo electrónico
 * @returns {Promise<any>} - Resultado del registro
 */
export async function cognitoSignUp(username: string, password: string, email: string) {
  try {
    const result = await signUp({
      username,
      password,
      options: {
        userAttributes: {
          email
        }
      }
    });
    return result;
  } catch (error) {
    console.error("Error en cognitoSignUp:", error);
    throw error; // Propagar el error para manejarlo en el componente
  }
}

/**
 * Confirma el registro de un usuario
 * @param {string} username - Nombre de usuario
 * @param {string} code - Código de confirmación
 * @returns {Promise<any>} - Resultado de la confirmación
 */
export async function cognitoConfirmSignUp(username: string, code: string) {
  try {
    const result = await confirmSignUp({ username, confirmationCode: code });
    return result;
  } catch (error) {
    console.error("Error en cognitoConfirmSignUp:", error);
    throw error; // Propagar el error para manejarlo en el componente
  }
}

/**
 * Cierra la sesión del usuario
 * @returns {Promise<void>} - Resultado del cierre de sesión
 */
export async function cognitoSignOut() {
  try {
    await signOut();
  } catch (error) {
    console.error("Error en cognitoSignOut:", error);
    throw error; // Propagar el error para manejarlo en el componente
  }
}

/**
 * Obtiene el usuario actual
 * @returns {Promise<any>} - Usuario actual
 */
export async function cognitoGetCurrentUser() {
  try {
    const user = await getCurrentUser();
    return user;
  } catch (error) {
    console.error("Error en cognitoGetCurrentUser:", error);
    throw error; // Propagar el error para manejarlo en el componente
  }
}
