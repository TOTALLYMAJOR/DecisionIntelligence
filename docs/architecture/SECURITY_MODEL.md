# Security Model

## Local starter

`AUTH_MODE=local` enables an owner-only local development identity. It is not a production identity
claim.

## Production target

- GitHub OAuth through Auth.js.
- Explicit login allowlist or workspace memberships.
- Server-side authorization on every Route Handler and Server Action.
- Provider keys and source connector credentials only in secret managers.
- Encrypted source-connector credential bindings.
- Private object storage with short-lived signed URLs.
- Append-only audit events for canonical promotion, evidence access, export, and deletion requests.

## Redaction

The redactor handles common API-key, bearer-token, email, local-path, and connection-string forms.
It is a defense layer, not proof that a file is publication-safe. Human review remains required.
