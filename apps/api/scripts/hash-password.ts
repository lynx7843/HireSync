import 'dotenv/config';
import crypto from 'node:crypto';

// Prints an AUTH_PASSWORD_HASH value. Usage: npm run auth:hash -- "<password>"
// Kept self-contained (rather than importing ../src/auth.js) so it runs without
// the auth env vars already being configured.
const password = process.argv[2];
if (!password) {
  console.error('Usage: npm run auth:hash -- "<password>"');
  process.exit(1);
}

const salt = crypto.randomBytes(16);
const key = crypto.scryptSync(password, salt, 64);
console.log(`AUTH_PASSWORD_HASH=scrypt:${salt.toString('hex')}:${key.toString('hex')}`);
