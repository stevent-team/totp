import { createHmac } from 'crypto'

/**
 * Generate a TOTP using an opinionated configuration
 * 
 * @note use `generateTotp` instead if you need a custom configuration
 */
export default function totp(secret: string) {
  return generateTotp({
    secret,
  })
}

/** 
 * Validate a provided TOTP
 * @see {TotpValidationOptions}
 */
export const validateTotp = (totp: string, options: TotpValidationOptions) => {
  // Process options
  const genOptions = resolveGenerationOptions(options)
  
  // Resolve validation options 
  const validWindowSize = options.validWindowSize ?? 1

  // Check this and previous periods (if applicable)
  return Array.from({ length: validWindowSize + 1 })
    .map((_, periodOffset) => generateTotp({ ...genOptions, periodOffset }))
    .some(generatedTotp => generatedTotp === totp)
}

/**
 * Generate a TOTP
 * @see {TotpGenerationOptions}
 */
export const generateTotp = (options: TotpGenerationOptions) => {
  // Process options
  const { timestamp, period, algorithm, secret, periodOffset, outputDigits } = resolveGenerationOptions(options)
  
  // Create truncated timestamp
  const time = Math.floor(timestamp / (period * 1000)) - periodOffset
  
  // Generate padded string from timestamp
  const hexTime = time.toString(16).padStart(16, '0')
  
  // Create buffers
  const timeBuffer = Buffer.from(hexTime, 'hex')
  const keyBuffer = hmacKeyFromSecret(secret, algorithm)

  // Create HMAC
  const hmac = createHmac(algorithm, keyBuffer)
    .update(timeBuffer)
    .digest()
  
  // If not truncating, return hex encoding
  if (outputDigits === null)
    return hmac.toString('hex')

  // Compute HOTP offset
  const offset = hmac[hmac.length - 1] & 0xf

  // Binary code
  const code =
    ((hmac[offset]     & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8)  |
    ((hmac[offset + 3] & 0xff))

  // Left pad code
  const codeString = new Array(outputDigits + 1).join('0') + code.toString(10);
  return codeString.substring(codeString.length - outputDigits)
}

const resolveGenerationOptions = (options: TotpGenerationOptions): Required<TotpGenerationOptions> => {
  // Check required
  if (!options.secret) throw new TotpError('`secret` option is required for totp processing')
  
  // Resolve defeaults
  return {
    timestamp: Date.now(),
    period: 30,
    periodOffset: 0,
    algorithm: 'sha512',
    outputDigits: 6,
    ...options,
  }
}

/**
 * Pad a secret by repetition to ensure it is the correct length
 * for the hmac encoding using a given algorithm
 */
const hmacKeyFromSecret = (secret: string, algorithm: HmacAlgorithm) => {
  const hexSecret = Buffer.from(secret, 'ascii').toString('hex')
  const secretBuffer = Buffer.from(hexSecret, 'hex')
  const desiredKeySize = HMAC_KEY_SIZES[algorithm]

  return hexSecret.length === desiredKeySize
    ? secretBuffer
    : Buffer.from(
      new Array(Math.ceil(desiredKeySize / secretBuffer.length))
        .fill(hexSecret)
        .join(''),
      'hex'
    ).subarray(0, desiredKeySize)
}

export interface TotpValidationOptions extends TotpGenerationOptions {
  /** The number of periods that a valid totp may be in
   *
   *  the transmission delay when sending a totp across a network means a totp
   *  may be generated at the very end of a period. Thus we should allow for totps
   *  to be accepted from previous periods. This option controls how many previous
   *  periods to check.
   * 
   *  @note defaults to 1 period
   *  @note set to 0 to disallow TOTPS generated in previous periods
  */
  validWindowSize: number
}

export interface TotpGenerationOptions {
  /** The secret used to encode TOTP */
  secret: string

  /** Timestamp to encode as the totp
   *  @note defaults to current timestamp using `Date.now()`
  */
  timestamp?: number

  /** Period for the totp in seconds
   *  any passes generated within this period will be the same
   *  @note defaults to 30s */
  period?: number

  /** Algorithm used to generate TOTP HMAC
   *  the possible values are platform-dependent
   *  run `openssl list -digest-algorithms` to list available algorithms on platform
   *  @note defaults to 'sha512' */
  algorithm?: HmacAlgorithm

  /** Generate a totp from this many periods prior
   * @note defaults to 0 */
  periodOffset?: number

  /** Number of decimal digits in the generated TOTP
   * @note defaults to 6
   * @note set to `null` for no truncation */
  outputDigits?: number
}

export type HmacAlgorithm = 'sha512' | 'sha256' | 'sha1'

/**
 * Size of keys in bytes for each hmac algorithm
 */
const HMAC_KEY_SIZES = {
  'sha512': 64,
  'sha256': 32,
  'sha1': 20,
} as const

class TotpError extends Error {}
