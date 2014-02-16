var tape = require('tape'),
    source = require('stream').PassThrough(),
    cryptDecrypt = require('../index.js'),
    encrypt = new cryptDecrypt.Encrypt({
      pass : 'secret',
      ine : 'ascii',
    }),
    decrypt = new cryptDecrypt.Decrypt({
      pass : 'secret'
    }),
    msgs = []

tape('in goes string...encrypt and decrypt...out goes buffer', function(t) {

  var input = 'in goes some strings of text and out comes buffers!!!!'

  decrypt.on('readable', function(chunk) {
    var data = this.read()
    
    if (data !== null) msgs.push(data)
    t.equal(Buffer.isBuffer(data), true, "each chunck of decrypted data should be a buffer")
  })

  decrypt.on('finish', function() {
    t.equal(new Buffer(Buffer.concat(msgs), 'ascii').toString(), input, 'decrypted message should match original message.')
    t.end()
  })

  source
    .pipe(encrypt)
    .pipe(decrypt)

  source.push(input)
  source.push(null)
})
