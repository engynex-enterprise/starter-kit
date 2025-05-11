"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  configureAmplify,
  cognitoSignIn,
  cognitoSignUp,
  cognitoSignOut,
  cognitoGetCurrentUser,
  isAuthenticated
} from "@/lib/amplify";

// Definir el tipo para el usuario autenticado
type AuthUser = {
  username: string;
  userId: string;
  email?: string;
};

// Definir el tipo para el contexto de autenticación
type AuthContextType = {
  user: AuthUser | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    password: string,
    email: string
  ) => Promise<void>;
  logout: () => Promise<void>;
};

// Crear el contexto de autenticación
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook personalizado para usar el contexto de autenticación
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
}

// Proveedor de autenticación con Cognito
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Configurar Amplify al cargar
  useEffect(() => {
    configureAmplify();
  }, []);

  // Verificar si hay un usuario autenticado al cargar
  useEffect(() => {
    const checkUser = async () => {
      try {
        // Verificar si hay un usuario autenticado con Cognito
        const isUserAuthenticated = await isAuthenticated();
        
        if (isUserAuthenticated) {
          const currentUser = await cognitoGetCurrentUser();
          
          // Crear objeto de usuario con la información de Cognito
          const authUser: AuthUser = {
            username: currentUser.username,
            userId: currentUser.userId,
            email: currentUser.signInDetails?.loginId
          };
          
          setUser(authUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error al verificar usuario:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Solo ejecutar en el cliente
    if (typeof window !== "undefined") {
      checkUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  // Función para iniciar sesión con Cognito
  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);

      // Iniciar sesión con Cognito
      // cognitoSignIn ahora devuelve true si es exitoso o lanza un error si falla
      const signInSuccess = await cognitoSignIn(username, password);
      
      // Si llegamos aquí, la autenticación fue exitosa
      try {
        // Obtener información del usuario actual
        const currentUser = await cognitoGetCurrentUser();
        
        // Crear objeto de usuario con la información de Cognito
        const authUser: AuthUser = {
          username: currentUser.username || username,
          userId: currentUser.userId || `user-${Date.now()}`,
          email: currentUser.signInDetails?.loginId || username
        };
        
        setUser(authUser);
        toast.success("Inicio de sesión exitoso");
        router.push("/dashboard");
      } catch (userError) {
        console.error("Error al obtener información del usuario:", userError);
        
        // Si no podemos obtener la información del usuario pero la autenticación fue exitosa,
        // creamos un objeto de usuario básico
        const basicUser: AuthUser = {
          username,
          userId: `user-${Date.now()}`,
          email: username.includes('@') ? username : undefined
        };
        
        setUser(basicUser);
        toast.success("Inicio de sesión exitoso");
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error);
      
      // Mostrar mensaje de error específico si está disponible
      if (error.message) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("Error al iniciar sesión. Verifica tus credenciales.");
      }
      
      // No propagamos el error para evitar que se muestre en la consola
      // pero mantenemos el estado de error
    } finally {
      setIsLoading(false);
    }
  };

  // Función para registrarse con Cognito
  const register = async (
    username: string,
    password: string,
    email: string
  ) => {
    try {
      setIsLoading(true);

      // Validar la contraseña según los requisitos de Cognito
      if (
        password.length < 8 ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password) ||
        !/[0-9]/.test(password) ||
        !/[^A-Za-z0-9]/.test(password)
      ) {
        throw new Error("La contraseña no cumple con los requisitos de seguridad");
      }

      // Registrar usuario en Cognito
      const signUpResult = await cognitoSignUp(username, password, email);
      
      if (signUpResult) {
        toast.success(`Registro exitoso para ${email}. Verifica tu correo para confirmar tu cuenta.`);
        router.push("/login");
      } else {
        throw new Error("No se pudo completar el registro");
      }
    } catch (error: any) {
      console.error("Error al registrarse:", error);
      
      // Mostrar mensaje de error específico si está disponible
      if (error.message) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("Error al registrarse. Inténtalo de nuevo.");
      }
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cerrar sesión con Cognito
  const logout = async () => {
    try {
      setIsLoading(true);

      // Cerrar sesión en Cognito
      await cognitoSignOut();
      
      // Actualizar estado
      setUser(null);
      toast.success("Sesión cerrada");
      router.push("/login");
    } catch (error: any) {
      console.error("Error al cerrar sesión:", error);
      
      // Mostrar mensaje de error específico si está disponible
      if (error.message) {
        toast.error(`Error: ${error.message}`);
      } else {
        toast.error("Error al cerrar sesión");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Valor del contexto
  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
