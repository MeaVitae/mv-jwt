import decode from 'jwt-decode'
import { DecodedJwtHeader, DecodeReturn, JwtBody } from '.'

export default <B = object>(jwt: string): DecodeReturn<B> => {
  if (typeof jwt !== 'string') throw new Error('JWT string is required')

  const jwtParts = jwt.split('.')
  if (jwtParts.length !== 3) throw new Error('JWT is malformed')

  const header = decode<DecodedJwtHeader>(jwt, { header: true })
  if (!header) throw new Error('JWT header did not decode')

  const body = decode<JwtBody<B>>(jwt)
  if (!body) throw new Error('JWT body did not decode')

  return {
    header,
    body
  }
}
