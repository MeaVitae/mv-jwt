'use strict'

const supportedAlgorithms = {
  ES384: {
    name: 'ECDSA',
    namedCurve: 'P-384',
    hash: { name: 'SHA-384' }
  }
}

const arrayBufferToBase64Url = buffer => btoa(
  String.fromCharCode(...new Uint8Array(buffer))
)
  .replace(/=/g, '')
  .replace(/\+/g, '-')
  .replace(/\//g, '_')

const arrayBufferFromBase64Url = str => new Uint8Array(
  Array.prototype.map.call(atob(
    str.replace(/-/g, '+')
      .replace(/_/g, '/')
      .replace(/\s/g, '')
  ), c => c.charCodeAt(0))
)

const base64ToObject = str => JSON.parse(atob(str))

const createKey = async (jwkObject, algorithm, mode = 'verify') => crypto
  .subtle.importKey('jwk', jwkObject, algorithm, false, [mode])

const checkKeyObject = (key, algorithm, algorithmProperties) => {
  if (key.alg !== algorithm) throw new Error('Algorithm not found in private key')
  if (key.crv !== algorithmProperties.namedCurve) throw new Error('Curve not found in private key')
  if (key.kid !== algorithmProperties.hash.name) throw new Error('Hash not found in private key')
  if (key.use !== 'sig') throw new Error('Private key use is not for signing')

  return true
}

const objectToBase64Url = payloadObject => arrayBufferToBase64Url(
  new TextEncoder().encode(JSON.stringify(payloadObject))
)

module.exports = {
  arrayBufferFromBase64Url,
  arrayBufferToBase64Url,
  base64ToObject,
  checkKeyObject,
  createKey,
  objectToBase64Url,
  supportedAlgorithms
}
