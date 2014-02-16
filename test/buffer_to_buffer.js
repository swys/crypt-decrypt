var tape = require('tape'),
    source = require('stream').PassThrough(),
    cryptDecrypt = require('../index.js'),
    encrypt = new cryptDecrypt.Encrypt({
      pass : 'secret'
    }),
    decrypt = new cryptDecrypt.Decrypt({
      pass : 'secret'
    })

tape('in goes buffer...encrypt and decrypt...out goes buffer', function (t) {
  var input = new Buffer(
    ['incoming is a buffer',
      ' then I will encrypt this buffer',
      ' then I will decrypt this buffer',
      ' then I will read the decrypted buffer,',
      ' and BEHOLD...it will be the same as the original buffer',
      ' that I originally sent!!!!'
    ].reduce(function(a,b) {
      return a + b
    }), 'ascii'),
    collect = []

  decrypt.on('readable', function(chunk) {
    var data = this.read()

    if (data !== null) collect.push(data) && t.equal(Buffer.isBuffer(data), true, 'decrypt should return a buffer')
  })

  decrypt.on('finish', function() {
    t.equal(new Buffer(Buffer.concat(collect), 'ascii').toString(), input.toString(), 'decrypted message should match original message')
    t.end()
  })

  source
    .pipe(encrypt)
    .pipe(decrypt)

  source.push(input)
  source.push(null)
})

