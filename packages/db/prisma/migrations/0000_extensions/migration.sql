CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Prisma will generate the baseline tables from schema.prisma when the setup
-- prompt runs `npm run db:migrate`. Extensions are split into an explicit,
-- reviewable migration because they are infrastructure authority, not UI state.
