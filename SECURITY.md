# Security Policy

## Supported version

The `main` branch is the supported version of Secure Properties Generator.

## Reporting a vulnerability

Please do not disclose exploitable security issues in a public issue. Report them privately through GitHub's security reporting features when available, or contact the repository owner through their GitHub profile.

## Security design

Secure Properties Generator performs cryptographic operations locally using the Web Crypto API. It does not send plaintext, passphrases, salts, IVs, or ciphertext to a server.

The application uses AES-256-GCM with PBKDF2-SHA-256 key derivation and a fresh random salt and IV for each encryption operation.
