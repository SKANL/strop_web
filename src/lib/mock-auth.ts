/**
 * Mock de servicios de autenticación
 * Simula llamadas a API con delays realistas
 */

import type { LoginFormData, RegisterFormData } from "./auth-schemas";

// Simular latencia de red
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Usuarios mock para simular login
const mockUsers = [
  {
    id: "usr_001",
    email: "admin@constructora-xyz.com",
    password: "Admin123!",
    fullName: "Juan Pérez García",
    role: "OWNER",
    organization: {
      id: "org_001",
      name: "Constructora XYZ S.A. de C.V.",
      subdomain: "constructora-xyz",
    },
  },
  {
    id: "usr_002",
    email: "demo@strop.app",
    password: "Demo123!",
    fullName: "Usuario Demo",
    role: "OWNER",
    organization: {
      id: "org_002",
      name: "Demo Organization",
      subdomain: "demo",
    },
  },
];

// Subdominios ya registrados (para validación)
const registeredSubdomains = ["constructora-xyz", "demo", "strop", "admin", "app"];

// ============================================
// SERVICIOS MOCK
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

/**
 * Simula el proceso de login
 */
export async function mockLogin(data: LoginFormData): Promise<AuthResponse> {
  // Simular latencia de red (800-1500ms)
  await delay(800 + Math.random() * 700);

  const user = mockUsers.find(
    (u) => u.email.toLowerCase() === data.email.toLowerCase()
  );

  if (!user) {
    return {
      success: false,
      message: "No existe una cuenta con este correo electrónico",
      errors: { email: "Usuario no encontrado" },
    };
  }

  if (user.password !== data.password) {
    return {
      success: false,
      message: "La contraseña es incorrecta",
      errors: { password: "Contraseña incorrecta" },
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
      organization: user.organization,
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
  if (registeredSubdomains.includes(data.subdomain.toLowerCase())) {
    return {
      success: false,
      message: "El subdominio ya está en uso",
      errors: { subdomain: "Este subdominio no está disponible" },
    };
  }

  // Verificar si el email ya existe
  if (mockUsers.some((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
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

  if (registeredSubdomains.includes(subdomain.toLowerCase())) {
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

  const user = mockUsers.find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  );

  // Siempre devolvemos éxito por seguridad (no revelar si el email existe)
  return {
    success: true,
    message: user
      ? "Si el correo existe, recibirás instrucciones para restablecer tu contraseña"
      : "Si el correo existe, recibirás instrucciones para restablecer tu contraseña",
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
