/**
 * Servicios mock de autenticación
 * Simula llamadas a API con delays realistas
 * Usa usuarios de ./users.ts para consistencia
 */

import type { LoginFormData, RegisterFormData } from "@/lib/auth-schemas";
import { mockUsers, getUserByEmail } from "./users";
import { mockOrganizations, isSubdomainAvailable as checkSubdomain } from "./organizations";

// ============================================
// TIPOS
// ============================================

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      id: string;
      email: string;
      fullName: string;
      role: string;
    };
    organization: {
      id: string;
      name: string;
      subdomain: string;
    };
    token?: string;
  };
  errors?: Record<string, string>;
}

// ============================================
// HELPERS
// ============================================

/** Simular latencia de red */
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Credenciales de demo para login
 * En producción esto vendría de la BD con hashing
 */
const authCredentials: Record<string, string> = {
  "juan.perez@constructora-demo.com": "Admin123!",
  "carlos.mendoza@constructora-demo.com": "Super123!",
  "maria.garcia@constructora-demo.com": "Resident123!",
  "demo@strop.app": "Demo123!",
};

// ============================================
// SERVICIOS MOCK
// ============================================

/**
 * Simula el proceso de login
 */
export async function mockLogin(data: LoginFormData): Promise<AuthResponse> {
  // Simular latencia de red (800-1500ms)
  await delay(800 + Math.random() * 700);

  const user = getUserByEmail(data.email);
  const org = mockOrganizations.find((o) => o.id === user?.organizationId);

  if (!user) {
    return {
      success: false,
      message: "No existe una cuenta con este correo electrónico",
      errors: { email: "Usuario no encontrado" },
    };
  }

  const expectedPassword = authCredentials[data.email.toLowerCase()];
  if (!expectedPassword || expectedPassword !== data.password) {
    return {
      success: false,
      message: "La contraseña es incorrecta",
      errors: { password: "Contraseña incorrecta" },
    };
  }

  if (!user.isActive) {
    return {
      success: false,
      message: "Tu cuenta está desactivada. Contacta al administrador.",
      errors: { email: "Cuenta desactivada" },
    };
  }

  return {
    success: true,
    message: "Inicio de sesión exitoso",
    data: {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      organization: org
        ? {
            id: org.id,
            name: org.name,
            subdomain: org.subdomain,
          }
        : {
            id: "org-unknown",
            name: "Organización",
            subdomain: "app",
          },
      token: `mock_token_${Date.now()}`,
    },
  };
}

/**
 * Simula el proceso de registro
 */
export async function mockRegister(
  data: RegisterFormData
): Promise<AuthResponse> {
  // Simular latencia de red (1000-2000ms para registro)
  await delay(1000 + Math.random() * 1000);

  // Verificar si el subdominio ya existe
  if (!checkSubdomain(data.subdomain)) {
    return {
      success: false,
      message: "El subdominio ya está en uso",
      errors: { subdomain: "Este subdominio no está disponible" },
    };
  }

  // Verificar si el email ya existe
  if (getUserByEmail(data.email)) {
    return {
      success: false,
      message: "Ya existe una cuenta con este correo electrónico",
      errors: { email: "Este correo ya está registrado" },
    };
  }

  // Simular registro exitoso
  const newUserId = `usr_${Date.now()}`;
  const newOrgId = `org_${Date.now()}`;

  return {
    success: true,
    message: "¡Cuenta creada exitosamente! Revisa tu correo para confirmar.",
    data: {
      user: {
        id: newUserId,
        email: data.email,
        fullName: data.fullName,
        role: "OWNER",
      },
      organization: {
        id: newOrgId,
        name: data.organizationName,
        subdomain: data.subdomain,
      },
      token: `mock_token_${Date.now()}`,
    },
  };
}

/**
 * Verifica disponibilidad de subdominio
 */
export async function checkSubdomainAvailability(
  subdomain: string
): Promise<{ available: boolean; message: string }> {
  await delay(300 + Math.random() * 200);

  if (subdomain.length < 3) {
    return { available: false, message: "Mínimo 3 caracteres" };
  }

  if (!checkSubdomain(subdomain)) {
    return { available: false, message: "No disponible" };
  }

  return { available: true, message: "Disponible" };
}

/**
 * Simula el envío de email para recuperar contraseña
 */
export async function mockForgotPassword(
  email: string
): Promise<{ success: boolean; message: string }> {
  await delay(800 + Math.random() * 500);

  // Siempre devolvemos éxito por seguridad (no revelar si el email existe)
  return {
    success: true,
    message: "Si el correo existe, recibirás instrucciones para restablecer tu contraseña",
  };
}

/**
 * Simula login con OAuth (Google, Microsoft)
 */
export async function mockOAuthLogin(
  provider: "google" | "microsoft"
): Promise<AuthResponse> {
  await delay(1500 + Math.random() * 1000);

  // Simular que el usuario tiene cuenta asociada
  return {
    success: true,
    message: `Inicio de sesión con ${provider === "google" ? "Google" : "Microsoft"} exitoso`,
    data: {
      user: {
        id: `usr_oauth_${Date.now()}`,
        email: `usuario@${provider === "google" ? "gmail.com" : "outlook.com"}`,
        fullName: "Usuario OAuth",
        role: "OWNER",
      },
      organization: {
        id: "org_oauth_001",
        name: "OAuth Organization",
        subdomain: "oauth-demo",
      },
      token: `oauth_token_${Date.now()}`,
    },
  };
}

/**
 * Simula logout (limpia sesión)
 */
export async function mockLogout(): Promise<{ success: boolean }> {
  await delay(200);
  return { success: true };
}

/**
 * Simula verificación de token
 */
export async function mockVerifyToken(
  token: string
): Promise<AuthResponse> {
  await delay(300);

  if (!token || !token.startsWith("mock_token_")) {
    return {
      success: false,
      message: "Token inválido o expirado",
    };
  }

  // Devolver usuario actual por defecto
  const user = mockUsers[0];
  const org = mockOrganizations[0];

  return {
    success: true,
    message: "Token válido",
    data: {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
      organization: {
        id: org.id,
        name: org.name,
        subdomain: org.subdomain,
      },
    },
  };
}
