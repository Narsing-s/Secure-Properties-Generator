const assert = require("node:assert/strict");
const { webcrypto } = require("node:crypto");

const crypto = webcrypto;
const enc = new TextEncoder();
const dec = new TextDecoder();
const MIN_ITER = 600000;
const MAX_ITER = 1000000;

function b64(bytes) {
  return Buffer.from(bytes).toString("base64url");
}

function unb64(value) {
  return new Uint8Array(Buffer.from(value, "base64url"));
}

async function derive(pass, salt, iterations) {
  const base = await crypto.subtle.importKey(
    "raw",
    enc.encode(pass),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encrypt(value, pass) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const iterations = 600000;
  const key = await derive(pass, salt, iterations);
  const ciphertext = new Uint8Array(
    await crypto.subtle.encrypt(
      { name: "AES-GCM", iv, tagLength: 128 },
      key,
      enc.encode(value)
    )
  );

  return {
    v: 1,
    alg: "AES-256-GCM",
    kdf: "PBKDF2-SHA256",
    iterations,
    salt: b64(salt),
    iv: b64(iv),
    ciphertext: b64(ciphertext)
  };
}

async function decrypt(envelope, pass) {
  assert.equal(envelope.v, 1);
  assert.equal(envelope.alg, "AES-256-GCM");
  assert.equal(envelope.kdf, "PBKDF2-SHA256");
  assert.ok(Number.isInteger(envelope.iterations));
  assert.ok(envelope.iterations >= MIN_ITER && envelope.iterations <= MAX_ITER);

  const salt = unb64(envelope.salt);
  const iv = unb64(envelope.iv);
  const ciphertext = unb64(envelope.ciphertext);

  assert.equal(salt.length, 16);
  assert.equal(iv.length, 12);
  assert.ok(ciphertext.length >= 16);

  const key = await derive(pass, salt, envelope.iterations);
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv, tagLength: 128 },
    key,
    ciphertext
  );
  return dec.decode(plaintext);
}

(async () => {
  const plaintext = "database.password=Secret-123!\nこんにちは";
  const passphrase = "correct horse battery staple";

  const first = await encrypt(plaintext, passphrase);
  const second = await encrypt(plaintext, passphrase);

  assert.notEqual(first.salt, second.salt, "salt must be randomized");
  assert.notEqual(first.iv, second.iv, "IV must be randomized");
  assert.notEqual(first.ciphertext, second.ciphertext, "ciphertext must differ");

  assert.equal(await decrypt(first, passphrase), plaintext);

  await assert.rejects(
    () => decrypt(first, "wrong passphrase"),
    "wrong passphrase must fail"
  );

  const tampered = { ...first, ciphertext: first.ciphertext.slice(0, -1) + (first.ciphertext.endsWith("A") ? "B" : "A") };
  await assert.rejects(
    () => decrypt(tampered, passphrase),
    "tampered ciphertext must fail authentication"
  );

  await assert.rejects(
    () => decrypt({ ...first, iterations: 599999 }, passphrase),
    "iterations below minimum must be rejected"
  );

  await assert.rejects(
    () => decrypt({ ...first, iterations: 1000001 }, passphrase),
    "iterations above maximum must be rejected"
  );

  await assert.rejects(
    () => decrypt({ ...first, iv: b64(new Uint8Array(11)) }, passphrase),
    "invalid IV length must be rejected"
  );

  console.log("Secure Properties Generator crypto tests passed.");
})();
