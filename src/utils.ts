import { JsonWebKeyWithKid } from "./"

const supportedAlgorithms = {
  ES384: {
    name: 'ECDSA',
    namedCurve: 'P-384',
    hash: { name: 'SHA-384' }
  }
}

type AlgorithmProperties = typeof supportedAlgorithms['ES384']

const arrayBufferToBase64Url = (buffer: ArrayBuffer) => btoa(
  String.fromCharCode(...new Uint8Array(buffer))
)
  .replace(/=/g, '')
  .replace(/\+/g, '-')
  .replace(/\//g, '_')

const arrayBufferFromBase64Url = (str: string): ArrayBuffer => {
  const stringFromBase64 = atob(
    str.replace(/-/g, '+')
      .replace(/_/g, '/')
      .replace(/\s/g, '')
  )
  
  const byteArray = new Uint8Array(stringFromBase64.length);
  for(var i=0; i < stringFromBase64.length; i++) {
    byteArray[i] = stringFromBase64.charCodeAt(i)
  }
  return byteArray
}

const base64ToObject = <R = object>(str: string): R => JSON.parse(atob(str))

const checkKeyObject = (key: JsonWebKeyWithKid, algorithm: string, algorithmProperties: AlgorithmProperties, isPrivateKey: boolean = true) => {
  if (key.alg !== algorithm) throw new Error('Algorithm not found in key')
  if (isPrivateKey && (key.crv !== algorithmProperties.namedCurve)) throw new Error('Curve not found in private key')
  if (key.kid !== algorithmProperties.hash.name) throw new Error('Hash not found in private key')
  if (key.use !== 'sig') throw new Error('Key use is not for signing')

  return true
}

const objectToBase64Url = (payloadObject: object) => arrayBufferToBase64Url(
  new TextEncoder().encode(JSON.stringify(payloadObject))
)

export {
  arrayBufferFromBase64Url,
  arrayBufferToBase64Url,
  base64ToObject,
  checkKeyObject,
  objectToBase64Url,
  supportedAlgorithms
}


