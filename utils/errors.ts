export const translateError = (msg: string) => {
  if (!msg) return "E-mail ou senha incorretos.";
  const lowerMsg = msg.toLowerCase();
  if (lowerMsg.includes("invalid credentials") || lowerMsg.includes("invalid email or password") || lowerMsg.includes("mismatch")) {
    return "E-mail ou senha incorretos.";
  }
  if (lowerMsg.includes("user not found")) {
    return "Usuário não cadastrado.";
  }
  if (lowerMsg.includes("password") && (lowerMsg.includes("invalid") || lowerMsg.includes("incorrect"))) {
    return "Senha incorreta.";
  }
  if (lowerMsg.includes("required")) {
    return "Todos os campos são obrigatórios.";
  }
  if (lowerMsg.includes("unauthorized") || lowerMsg.includes("not authorized")) {
    return "Acesso não autorizado.";
  }
  if (lowerMsg.includes("fetch") || lowerMsg.includes("failed to fetch") || lowerMsg.includes("network")) {
    return "Não foi possível conectar ao servidor de autenticação.";
  }
  return msg;
};
