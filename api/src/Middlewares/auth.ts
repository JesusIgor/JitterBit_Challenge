import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Chave secreta para assinar tokens
const SECRET = process.env.JWT_SECRET || 'secret-key-jwt';

// Middleware para validar token JWT
export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: 'Token não fornecido' });
    return;
  }

  // Remove "Bearer " do token
  const token = authHeader.replace('Bearer ', '');

  try {
    // Verifica se o token é válido
    jwt.verify(token, SECRET);
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido ou expirado' });
  }
}

// Função para gerar um novo token
export function generateToken(username: string = 'api-user'): string {
  return jwt.sign({ username }, SECRET, { expiresIn: '24h' });
}
