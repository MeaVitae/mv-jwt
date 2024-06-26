import decode from './decode'
import { JsonWebKeyWithKid, JwtBody, OptionsObject } from './'
import { arrayBufferFromBase64Url, base64ToObject, checkKeyObject, supportedAlgorithms } from './utils'

export default async <B>(jwt: string, publicJwkAsBase64: string, options: OptionsObject): Promise<JwtBody<B>> => {
  if (typeof jwt !== 'string') throw new Error('JWT string is required')
  if (!publicJwkAsBase64) throw new Error('Public key is required')
  if (!options) throw new Error('Token signing options are required')

  const algorithm = supportedAlgorithms[options.algorithm]
  if (!algorithm) throw new Error('Algorithm not supported')

  const publicJwkAsObject = base64ToObject<JsonWebKeyWithKid>(publicJwkAsBase64)
  checkKeyObject(publicJwkAsObject, options.algorithm, algorithm, false)

  const verifyKey = await crypto.subtle.importKey('jwk', publicJwkAsObject, algorithm, false, ['verify'])

  const jwtParts = jwt.split('.')
  if (jwtParts.length !== 3) throw new Error('JWT is malformed')

  const [headerAsBase64url, bodyAsBase64url, signatureAsBase64url] = jwtParts
  if (!headerAsBase64url) throw new Error('Header missing')
  if (!bodyAsBase64url) throw new Error('Body missing')
  if (!signatureAsBase64url) throw new Error('Signature missing')

  const signatureAsArrayBuffer = arrayBufferFromBase64Url(signatureAsBase64url)

  const encoder = new TextEncoder()
  const headerAndDataAsTextEncoded = encoder.encode(`${headerAsBase64url}.${bodyAsBase64url}`)

  const result = await crypto.subtle.verify(
    algorithm,
    verifyKey,
    signatureAsArrayBuffer,
    headerAndDataAsTextEncoded
  )
  if (!result) throw new Error('JWT signature is invalid')

  const { header: { alg, typ }, body } = decode<B>(jwt)

  if (alg !== options.algorithm) throw new Error('JWT algorithm is invalid')

  const clockTimestamp = Math.floor(Date.now() / 1000)

  if ((typeof body.iat !== 'number') || (clockTimestamp < body.iat)) throw new Error('JWT iat is invalid')
  if (clockTimestamp >= body.exp) throw new Error('JWT expired')
  if (typeof body.exp !== 'number') throw new Error('JWT exp is invalid')
  if (clockTimestamp >= body.exp) throw new Error('JWT expired')
  if (body.iss !== options.issuer) throw new Error('JWT issuer is invalid')

  return body
}
