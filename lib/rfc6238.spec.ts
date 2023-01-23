/**
 * Test the TOTP implementation against the test vectors from RFC 6238
 * @link https://www.rfc-editor.org/rfc/rfc6238
 */

import { it, expect } from 'vitest'
import testVectors from './vectors.json'

import { generateTotp, HmacAlgorithm } from './main'

const TEST_VECTOR_SECRET = '12345678901234567890'
const TEST_OUTPUT_DIGITS = 8

it('is compatible with every RFC test vector', () => {
  testVectors.forEach(({ timestamp, algorithm, totp }) => {
    // Generate pass
    const pass = generateTotp({
      secret: TEST_VECTOR_SECRET,
      algorithm: algorithm as HmacAlgorithm,
      timestamp: new Date(timestamp).getTime(),
      outputDigits: TEST_OUTPUT_DIGITS,
    })

    // Compare to vector
    expect(pass).toEqual(totp)
  })
})
