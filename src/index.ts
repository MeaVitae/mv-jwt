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

export type DecodeReturn<B = unknown> = {
  body: B
  header: DecodedJwtHeader
}

const jwt = {
  sign,
  verify,
  decode
}

export default jwt
