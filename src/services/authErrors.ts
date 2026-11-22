export function getAuthErrorMessage(errorCode: string): string {
  switch (errorCode) {
    case "auth/invalid-credential":
    case "auth/user-not-found":
    case "auth/wrong-password":
      return "Correo o contraseña incorrectos.";
    case "auth/email-already-in-use":
      return "Ya existe una cuenta registrada con este correo.";
    case "auth/weak-password":
      return "La contraseña debe tener al menos 6 caracteres.";
    case "auth/invalid-email":
      return "El formato de correo no es válido.";
    case "auth/network-request-failed":
      return "Error de conexión. Verificá tu acceso a internet.";
    case "auth/too-many-requests":
      return "Demasiados intentos fallidos. Intentá nuevamente más tarde.";
    default:
      return "Ocurrió un error inesperado. Por favor, intentá de nuevo.";
  }
}
