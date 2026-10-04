# Security Policy

## Supported version

The `main` branch is the supported version of Secure Properties Generator.

## Security design

Secure Properties Generator performs cryptographic operations locally using the Web Crypto API. It does not send plaintext, passphrases, salts, IVs, or ciphertext to a server.

The application uses AES-256-GCM with PBKDF2-SHA-256 key derivation and a fresh random salt and IV for each encryption operation.

## User safety

- Prefer HTTPS or localhost so the browser can provide Web Crypto securely.
- Never publish the passphrase alongside an encrypted value.
- Do not paste production master keys into an untrusted copy of the application.
- This utility is not a replacement for a production secret manager.
- If the passphrase is lost, encrypted values cannot be recovered.

## Reporting a vulnerability

Please do not disclose exploitable security issues in a public issue. Report them privately through GitHub's security reporting features when available, or contact the repository owner through their GitHub profile.

Include reproduction steps, affected files, impact, and mitigation details when possible.
