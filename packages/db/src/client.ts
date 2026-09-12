import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/client/client';

const globalForPrisma = globalThis as unknown as { limitlessPrisma?: PrismaClient };

export const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error('DATABASE_URL is required for DATA_MODE=prisma.');
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
};

export const db = globalForPrisma.limitlessPrisma ?? createPrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.limitlessPrisma = db;
