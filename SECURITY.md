# Security Policy

## Sensitive material

Never commit API keys, OAuth secrets, private repository tokens, raw customer data, or unredacted
prompt archives containing secrets. Use `.env.local` for local secrets and a deployment secret
manager in hosted environments.

## AI boundaries

Provider output is untrusted input. Every response must be parsed through a bounded Zod schema.
AI-generated principles, patterns, lineages, and creator-profile claims remain review candidates
until a human promotion receipt exists.

## Source vault

Original evidence is immutable. Redaction creates a separate projection and never rewrites the
source record.

## Reporting

Report vulnerabilities privately to the repository owner. Do not open a public issue containing
secrets, private source material, or exploit details.
