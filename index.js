var crypto = require('crypto'),
    Transform = require('stream').Transform

function CipherStream(cipher, opts) {

  if (!(this instanceof CipherStream)) {
    return new CipherStream(cipher, opts)
  }

  this.ciph = cipher
  this.ine = opts.ine
  this.enc = opts.enc
  this.pass = opts.pass
  this.alg = opts.alg

  Transform.call(this)
}


CipherStream.prototype = Object.create(Transform.prototype, {
  constructor : {
    value : CipherStream
  }
})

    
CipherStream.prototype._transform = function(chunk, encoding, next) {
  var data 
  if (this.enc !== 'buffer' && Buffer.isBuffer(chunk)) {
    data = this.ciph.update(chunk.toString(), this.ine, this.enc) 
    if (data.length > 0) this.push(data.toString(this.enc))
    next()
  } else if (this.enc === 'buffer' && !Buffer.isBuffer(chunk)) {
    data = this.ciph.update(chunk, this.ine, this.enc)
    if (data.length > 0) this.push(new Buffer(data, this.enc))
    next()
  } else {
    data = this.ciph.update(chunk, this.ine, this.enc)
    if (data.length > 0) this.push(data)
    next()
  }
}

CipherStream.prototype._flush = function(done) {
  var fin = this.ciph.final(this.enc)

  if (fin.length > 0) {
    if (this.enc !== 'buffer' && Buffer.isBuffer(fin)) {
      this.push(fin.toString(this.enc))
      done()
    } else if (this.enc === 'buffer' && !Buffer.isBuffer(fin)) {
      this.push(new Buffer(fin, this.enc))
      done()
    } else {
      this.push(fin)
      done()
    }
  }
}

var Encrypt = function Encrypt(opts) {
  
  if (!opts.pass) throw new Error("Must Supply Password")

  opts.alg = opts.alg || 'aes-256-cbc'
  opts.ine = opts.ine || 'buffer'
  opts.enc = opts.enc || 'buffer'
  
  var cipher  = crypto.createCipher(opts.alg, opts.pass)

  return new CipherStream(cipher, opts)

}



var Decrypt = function Decrypt(opts) {
  
  if (!opts.pass) throw new Error("Must Supply Password")

  opts.alg = opts.alg || 'aes-256-cbc'
  opts.ine = opts.ine || 'buffer'
  opts.enc = opts.enc || 'buffer'
  
  var cipher = crypto.createDecipher(opts.alg, opts.pass)

  return new CipherStream(cipher, opts)
}


exports.Encrypt = Encrypt
exports.Decrypt = Decrypt
