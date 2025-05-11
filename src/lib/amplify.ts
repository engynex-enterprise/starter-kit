// Este archivo ahora es un stub ya que estamos simulando la autenticación
// en lugar de usar Amplify/Cognito real

// Función vacía para mantener la compatibilidad con el código existente
export function configureAmplify() {
  // No hacemos nada, ya que estamos simulando la autenticación
  console.log("Usando autenticación simulada en lugar de Amplify/Cognito");
}

// Función simulada para verificar si el usuario está autenticado
export async function isAuthenticated() {
  try {
    // Verificar si hay un usuario en localStorage
    const storedUser = localStorage.getItem("auth_user");
    return !!storedUser;
  } catch {
    return false;
  }
}
