var tape = require('tape'),
    source = require('stream').PassThrough(),
    cryptDecrypt = require('../index.js'),
    encrypt = cryptDecrypt.Encrypt({
      pass : 'secret',
      ine : 'ascii',
      enc : 'hex'
    }),
    decrypt = cryptDecrypt.Decrypt({
      pass : 'secret',
      ine : 'hex',
      enc : 'ascii'
    }),
    collect = ''

tape('in goes ascii string...encrypt as hex string and decrypt...out goes ascii string', function (t) {
  var input = ['in will be a ascii string',
      ' that will be encrypted as a hex string',
      ' then it will be decrypted',
      ' and returned as a ascii string'
    ].join(''),
    collect = ''

  console.dir(input)

  decrypt.on('readable', function() {
    var data = this.read()

    if (data.toString() !== null) {
      collect += data.toString()
      t.equal(Buffer.isBuffer(data.toString()), false, 'data should be a string')
    }
  })

  decrypt.on('finish', function() {
    t.equal(collect, input, 'concatinated results of decrypting should be equal to original input message')
    t.end()
  })

  source
    .pipe(encrypt)
    .pipe(decrypt)

  source.push(input)
  source.push(null)
})
