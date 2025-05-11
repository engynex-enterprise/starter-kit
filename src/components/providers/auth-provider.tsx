"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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

// Proveedor de autenticación simulado
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Verificar si hay un usuario en localStorage al cargar
  useEffect(() => {
    const checkUser = async () => {
      try {
        const storedUser = localStorage.getItem("auth_user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch {
        // Si hay un error, no hay usuario autenticado
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

  // Función para iniciar sesión (simulada)
  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);

      // Simulamos una verificación de credenciales
      // En un entorno real, esto se haría con Cognito
      if (password.length < 8) {
        throw new Error("Contraseña incorrecta");
      }

      // Crear un usuario simulado
      const mockUser: AuthUser = {
        username,
        userId: `user-${Date.now()}`,
        email: `${username}@ejemplo.com`,
      };

      // Guardar en localStorage para persistencia
      localStorage.setItem("auth_user", JSON.stringify(mockUser));

      // Actualizar el estado
      setUser(mockUser);
      toast.success("Inicio de sesión exitoso");
      router.push("/dashboard");
    } catch (error: unknown) {
      console.error("Error al iniciar sesión:", error);
      toast.error("Error al iniciar sesión. Verifica tus credenciales.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para registrarse (simulada)
  const register = async (
    username: string,
    password: string,
    email: string
  ) => {
    try {
      setIsLoading(true);

      // Validar la contraseña
      if (
        password.length < 8 ||
        !/[A-Z]/.test(password) ||
        !/[a-z]/.test(password) ||
        !/[0-9]/.test(password) ||
        !/[^A-Za-z0-9]/.test(password)
      ) {
        throw new Error("La contraseña no cumple con los requisitos");
      }

      // Simular registro exitoso
      toast.success(`Registro exitoso para ${email}`);
      
      // Redirigir a la página de inicio de sesión
      router.push("/login");
    } catch (error: unknown) {
      console.error("Error al registrarse:", error);
      toast.error("Error al registrarse. Inténtalo de nuevo.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Función para cerrar sesión
  const logout = async () => {
    try {
      setIsLoading(true);

      // Eliminar usuario de localStorage
      localStorage.removeItem("auth_user");

      // Actualizar estado
      setUser(null);
      toast.success("Sesión cerrada");
      router.push("/login");
    } catch (error: unknown) {
      console.error("Error al cerrar sesión:", error);
      toast.error("Error al cerrar sesión");
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
