import decode from './decode'
import sign from './sign'
import verify from './verify'

export type Algorithms = 'ES384'

export type OptionsObject = {
  algorithm: Algorithms
  kid?: string
  keyId?: string
  expiresIn: number
  issuer: string
}

export type DecodedJwtHeader = {
  alg: Algorithms
  typ: 'JWT'
}

export type JwtBody<B = object> = B & {
  iat: number
  exp: number
  iss: string
}

export type DecodeReturn<B = object> = {
  body: JwtBody<B>
  header: DecodedJwtHeader
}

export type JsonWebKeyWithKid = JsonWebKey & {
  kid: string
}

const jwt = {
  sign,
  verify,
  decode
}

export default jwt
