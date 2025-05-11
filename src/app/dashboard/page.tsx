"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/providers/auth-provider";

export default function DashboardPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  // Redirigir al usuario a la página de inicio de sesión si no está autenticado
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // Mostrar un mensaje de carga mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Cargando...</p>
      </div>
    );
  }

  // Si el usuario no está autenticado, no mostrar nada (la redirección se maneja en el useEffect)
  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl">Bienvenido al Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            Has iniciado sesión correctamente. Esta es una página protegida que
            solo pueden ver los usuarios autenticados.
          </p>
          <div className="bg-muted p-4 rounded-md mb-6">
            <h3 className="font-medium mb-2">Información del usuario:</h3>
            <p>
              <strong>Usuario:</strong> {user.username}
            </p>
            <p>
              <strong>ID:</strong> {user.userId}
            </p>
          </div>
          <Button onClick={logout} variant="outline">
            Cerrar sesión
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
