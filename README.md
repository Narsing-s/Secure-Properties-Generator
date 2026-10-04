# Secure Properties Generator

A privacy-first browser utility for encrypting and decrypting sensitive application/configuration values locally.

## 🔐 Security

The original user interface is intentionally preserved. The security improvements are implemented behind that UI.

The current encryption engine uses:

- **AES-256-GCM** authenticated encryption
- **PBKDF2-SHA-256** passphrase derivation
- Random **16-byte salt** for every encryption
- Random **12-byte IV** for every encryption
- **600,000 PBKDF2 iterations**
- Versioned **SPG1** encrypted envelope
- Browser **Web Crypto API**
- No backend, database, account, analytics, or API key
- No localStorage/sessionStorage use for secrets
- Maximum plaintext input of 1 MiB
- Validation of envelope version, algorithm, KDF, iteration count, salt, IV, and authentication tag

OWASP recommends AES with at least a 128-bit key, preferably 256-bit, and recommends authenticated encryption modes such as GCM or CCM where available. citeturn0search0

The previous implementation used Base64 concatenation. Base64 is encoding, not encryption. It has been replaced with authenticated encryption.

## Original UI

The visual interface is deliberately kept the same as the original version:

- Secure Properties Generator heading
- Light gray page background
- White centered container
- String tab
- Encrypt / Decrypt operation
- Original Algorithm dropdown
- Original State dropdown
- Use random IVs checkbox
- Key field
- Value field
- Generate button
- Result textarea
- Original footer

The legacy algorithm and mode choices remain visible because preserving the original UI was an explicit requirement. They are **not used as cryptographic implementations**. Secure encryption is performed with AES-256-GCM.

## How it works

### Encrypt

1. Enter the key/passphrase.
2. Enter the value.
3. Keep the original default **AES** and **CBC** selections.
4. Click **Generate**.
5. The browser derives an AES-256 key with PBKDF2-SHA-256.
6. A fresh random salt and IV are generated.
7. The value is encrypted with AES-256-GCM.
8. The result is returned as an `SPG1.` envelope.

### Decrypt

1. Select **Decrypt**.
2. Enter the same key/passphrase.
3. Paste the `SPG1.` encrypted value into the Value field.
4. Click **Generate**.
5. The envelope is validated.
6. AES-GCM authentication is verified.
7. The original plaintext is returned only when authentication succeeds.

A wrong key or modified ciphertext produces `Invalid encrypted value`.

## Important security notes

This is a client-side utility, not a replacement for an enterprise secret manager or KMS.

- Never publish the passphrase alongside the encrypted value.
- Never commit plaintext secrets or passphrases to Git.
- Use HTTPS when hosting publicly.
- Keep the generated encrypted value protected even though it is encrypted.
- If the passphrase is lost, the encrypted value cannot be recovered.
- Do not rely on the legacy dropdown names as evidence that those legacy ciphers are implemented.

OWASP also recommends that cryptographic keys and secrets are not committed to source repositories and that cryptographic operations use reputable, maintained cryptographic implementations. citeturn0search2turn0search3

## Browser support

Requires a modern browser with Web Crypto API support and a secure context such as HTTPS or localhost.

## Testing

The repository includes automated checks for:

- JavaScript syntax
- AES-256-GCM encryption/decryption round trips
- Randomized ciphertext generation
- Wrong-passphrase rejection
- Tamper detection
- Envelope validation
- Iteration-bound validation
- Oversized input rejection

## Tech stack

HTML5 · CSS3 · JavaScript · Web Crypto API

## License

MIT
