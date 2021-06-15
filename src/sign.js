'use strict'

const {
  arrayBufferToBase64Url,
  base64ToObject,
  checkKeyObject,
  createKey,
  objectToBase64Url,
  supportedAlgorithms
} = require('./utils')

module.exports = async (tokenDataObject, privateJwkAsBase64, options) => {
  try {
    if (!tokenDataObject) throw new Error('Token data is required')
    if (!privateJwkAsBase64) throw new Error('Private key is required')
    if (!options) throw new Error('Token signing options are required')

    const algorithm = supportedAlgorithms[options.algorithm]
    if (!algorithm) throw new Error('Algorithm not supported')

    const privateJwkAsObject = base64ToObject(privateJwkAsBase64)
    checkKeyObject(privateJwkAsObject, options.algorithm, algorithm)

    const signingKey = await createKey(privateJwkAsObject, algorithm, 'sign')
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
  } catch (error) {
    console.log(error)

    throw error
  }
}
