# Secure Properties Generator

A privacy-first browser utility for encrypting and decrypting sensitive application/configuration values locally.

## 🔐 Security

The generator uses the browser Web Crypto API with:

- **AES-256-GCM** authenticated encryption
- **PBKDF2-SHA-256** passphrase derivation
- Random **16-byte salt** for every encryption
- Random **12-byte IV** for every encryption
- Configurable 600,000–1,000,000 PBKDF2 iterations
- Versioned **SPG1** encrypted envelope
- No backend, database, account, analytics, or API key
- Plaintext and passphrases stay in the browser

> The previous implementation used Base64 concatenation, which is encoding rather than encryption. It has been replaced with real authenticated encryption.

## ✨ Features

- Encrypt / decrypt tabs
- Compact or readable JSON encrypted envelopes
- Copy result to clipboard
- Masked passphrase input
- Clear local workspace
- Responsive security-focused UI
- Static-site deployment
- No external runtime dependencies

## How to use

1. Open the application.
2. Select **Encrypt**.
3. Enter a strong, unique passphrase.
4. Enter the property/configuration value.
5. Select the KDF work factor.
6. Click **Encrypt securely**.
7. Store the generated `SPG1` envelope.
8. To recover the value, select **Decrypt**, paste the envelope, and provide the same passphrase.

## Important security notes

This is a client-side utility, not a replacement for a production secret manager. Never publish your passphrase alongside the encrypted value. If the passphrase is lost, the encrypted value cannot be recovered.

Use HTTPS when hosting the application publicly. Avoid entering secrets into copies of the application you do not trust.

## Browser support

Requires a modern browser with Web Crypto API support, including current Chrome, Edge, Firefox and Safari.

## Tech stack

HTML5 · CSS3 · JavaScript · Web Crypto API

## License

MIT


## Algorithm profiles

The UI now exposes two browser-native authenticated encryption profiles:

- **AES-256-GCM** — recommended default.
- **AES-128-GCM** — available for environments that specifically require a 128-bit AES key.

Earlier versions of this project listed legacy choices such as **Blowfish, DES, 3DES/DESede and RC2**. Those are intentionally not restored. They are not appropriate defaults for a new security utility, and the browser Web Crypto API does not provide native support for those legacy ciphers. OWASP guidance recommends authenticated modes such as GCM/CCM and specifically flags DES and Blowfish among weak/unsuitable primitives. citeturn0search12turn0search13

NIST documents AES-GCM as an authenticated-encryption mode; current NIST guidance also lists AES-256-GCM with a random IV as a suggested authenticated-encryption choice. citeturn0search0turn0search7

This means the project deliberately favors a smaller, safer algorithm surface rather than providing insecure legacy options merely for compatibility.
