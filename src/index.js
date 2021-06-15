'use strict'

const decode = require('./decode')
const sign = require('./sign')
const verify = require('./verify')

module.exports = {
  sign,
  verify,
  decode
}
