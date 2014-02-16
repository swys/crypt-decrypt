var tape = require('tape'),
    source = require('stream').PassThrough(),
    cryptDecrypt = require('../index.js'),
    encrypt = new cryptDecrypt.Encrypt({
      pass : 'secret',
      ine : 'ascii',
      enc : 'hex'
    }),
    decrypt = new cryptDecrypt.Decrypt({
      pass : 'secret',
      ine : 'hex',
      enc : 'ascii'
    })

tape('in goes buffer...encrypt and decrypt...out goes string', function (t) {

  var input = new Buffer(
      ['this is a very quick test ',
        'for this file so I can see some hex dumps']
      .reduce(function(a,b) {
        return a + b
      }), 'ascii'),
      file = ''

  decrypt.on('readable', function(chunk) {
    file += this.read()
  })

  decrypt.on('finish', function() {
    t.equal(file, input.toString(), "collected data should be same as original file")
    t.end()
  })
  
  source
    .pipe(encrypt)
    .pipe(decrypt)

  source.push(input)
  source.push(null)
})


