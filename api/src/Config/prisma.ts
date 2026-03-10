import { PrismaClient } from '@prisma/client';

//Iniciando cliente prisma para conexão com o banco de dados
const prisma = new PrismaClient({});

export default prisma;
