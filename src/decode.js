'use strict'

const decode = require('jwt-decode').default

module.exports = jwt => {
  if (typeof jwt !== 'string') throw new Error('JWT string is required')

  const jwtParts = jwt.split('.')
  if (jwtParts.length !== 3) throw new Error('JWT is malformed')

  const header = decode(jwt, { header: true })
  if (!header) throw new Error('JWT header did not decode')

  const body = decode(jwt)
  if (!body) throw new Error('JWT body did not decode')

  return {
    header,
    body
  }
}
