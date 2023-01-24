# 🔑 totp
Lightweight rfc-compliant TOTP authentication library for nodejs based on `crypto`

[![npm version](https://img.shields.io/npm/v/@stevent-team/totp)](https://www.npmjs.com/package/@stevent-team/totp)
[![minzip size](https://img.shields.io/bundlephobia/minzip/@stevent-team/totp)](https://bundlephobia.com/package/@stevent-team/totp)

> **Warning**
> This package is unstable and still in active development. You are more than welcome to contribute and make use of it but please note that there may be breaking changes

Conforms to the [IETF RFC 6238 specification](https://www.rfc-editor.org/rfc/rfc6238) including all interoperability test vectors.

## Installation

```bash
yarn add @stevent-team/totp
```

## Examples

```ts
import { generateTotp, validateTotp, type TotpOptions } from '@stevent-team/totp'

// Configure
const config: TotpOptions = {
  secret: process.env['MY_SECRET_KEY'], // REQUIRED
  timestamp: Date.now(),
  period: 30, // seconds
  periodOffset: 0,
  algorithm: 'sha512',
  outputDigits: 6,
}

// Generate a one time password (on a client)
const pass = generateTotp(config)
console.log(pass) // 568231

// Validate the one time password (on a server)
const isValid = validateTotp(pass, config)
console.log(isValid) // true
```

## Contributing

Issue and PR contributions are greatly welcomed and appreciated!

## License

`totp` is licensed under MIT

*Created with love by the [Stevent Team](https://stevent.club)* 💙
