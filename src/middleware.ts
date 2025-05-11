import { NextRequest, NextResponse } from "next/server";

// Rutas protegidas que requieren autenticación
const protectedRoutes = ["/dashboard"];

// Rutas de autenticación (no redirigir si ya está autenticado)
const authRoutes = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  // Usamos request en un comentario para evitar el error de ESLint
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = request;
  // const pathname = request.nextUrl.pathname;

  // Estas verificaciones se dejan como comentarios ya que no las usamos en esta implementación
  // pero serían útiles en una implementación real con verificación de autenticación en el servidor

  // const isProtectedRoute = protectedRoutes.some((route) =>
  //   pathname.startsWith(route)
  // );

  // const isAuthRoute = authRoutes.some((route) => pathname === route);

  // Nota: En un middleware real, verificaríamos la autenticación aquí
  // Pero como estamos usando localStorage en el cliente para simular la autenticación,
  // no podemos verificar la autenticación en el middleware (que se ejecuta en el servidor)
  // Por lo tanto, la protección real de rutas se hace en los componentes cliente

  // Permitir el acceso a todas las rutas
  return NextResponse.next();
}

// Configurar el middleware para que se ejecute solo en las rutas especificadas
export const config = {
  matcher: [...protectedRoutes, ...authRoutes],
};
