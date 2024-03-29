import { OptionsObject } from './';
import { arrayBufferToBase64Url, base64ToObject, checkKeyObject, objectToBase64Url, supportedAlgorithms } from './utils'

export default async <D>(tokenDataObject: D, privateJwkAsBase64: string, options: OptionsObject) => {
  if (!tokenDataObject) throw new Error('Token data is required')
  if (!privateJwkAsBase64) throw new Error('Private key is required')
  if (!options) throw new Error('Token signing options are required')

  const algorithm = supportedAlgorithms[options.algorithm]
  if (!algorithm) throw new Error('Algorithm not supported')

  const privateJwkAsObject = base64ToObject<JsonWebKeyWithKid>(privateJwkAsBase64)
  checkKeyObject(privateJwkAsObject, options.algorithm, algorithm)

  const signingKey = await crypto.subtle.importKey('jwk', privateJwkAsObject, algorithm, false, ['sign'])
  if (!signingKey) throw new Error('Could not create a signing key')

  const tokenHeaderObject = {
    alg: options.algorithm,
    typ: 'JWT',
    ...options.kid && { kid: options.keyId }
  }

  const issuedAt = Math.floor(Date.now() / 1000)
  const expires = (typeof options.expiresIn === 'number')
    ? (issuedAt + options.expiresIn)
    : (issuedAt + 7200)

  const tokenBodyObject = {
    ...tokenDataObject,
    iat: issuedAt,
    exp: expires,
    iss: options.issuer
  }

  const headerAndBody = `${objectToBase64Url(tokenHeaderObject)}.${objectToBase64Url(tokenBodyObject)}`

  const encoder = new TextEncoder()
  const headerAndBodyAsTextEncoded = encoder.encode(headerAndBody)

  const signature = await crypto.subtle.sign(algorithm, signingKey, headerAndBodyAsTextEncoded)

  return `${headerAndBody}.${arrayBufferToBase64Url(signature)}`
}
