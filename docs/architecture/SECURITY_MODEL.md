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

## Repository observation

Decision Studio's repository scan runs only in the Node.js server process. The browser may request
that repository evidence be included, but it cannot submit a filesystem path. The server uses the
operator-controlled `REPOSITORY_SCAN_ROOT` when present; otherwise it searches upward from its
working directory for a root containing both `package.json` and `AGENTS.md`.

The scanner reduces exposure by:

- ignoring symbolic links;
- allowing only a fixed set of text-oriented extensions;
- skipping dependency, build, generated, cache, coverage, and version-control directories;
- skipping lockfiles, `.env*`, common credential/secret filenames, and private `var/evidence` and
  `var/exports` paths;
- limiting inspected file count, per-file bytes, and returned evidence records; and
- returning relative paths, metadata, hashes, and matched terms—not source excerpts, absolute
  paths, or file bodies.

These controls are a bounded-read policy, not a content-classification or publication guarantee.
Eligible source files can still contain sensitive material, and their contents are read into the
server process to compute matches and hashes. An operator must authorize the configured scan root
and must not expose this capability to untrusted tenants without stronger isolation, authorization,
auditing, and abuse controls.

A scan failure is fail-soft: the analysis continues without a repository snapshot. This preserves
availability but must remain visible to the operator; it is not evidence that the repository was
inspected successfully.
