crypt-decrypt
=============

a node streams wrapper around node's crypto `createCipher` (Encrypt) and `createDecipher` (Decrypt) methods

###install

```
npm install crypt-decrypt
```

###usage

```
var source = require('stream').PassThrough(),
    cryptDecrypt = require('crypt-decrypt'),
    encrypt = new cryptDecrypt.Encrypt({
      pass : 'secret'
    }),
    decrypt = new cryptDecrypt.Decrypt({
      pass : 'secret'
    })

var input = new Buffer(
  ['this is a test',
    ' of the emergency broadcast system',
    ' if this had been a real emergency',
    ' you would have been instructed to...'
  ].reduce(function(a,b) {
    return a + b
  }), 'ascii')

source
  .pipe(encrypt)
  .pipe(decrypt)
  .pipe(process.stdout)

source.push(input)
source.push(null)
```

###defaults

By default if you are only required to pass in `options.pass`. The rest of the values will be defaulted if not supplied.

Below are the defaults of every option :


* algorithm (alg) : `aes-256-cbc`
* inputEncoding (ine) : `buffer`
* encoding (enc) : `buffer`
* password (pass) : `NO DEFAULT` __will throw if not supplied__
* 

###encoding

See node's [crypto](http://nodejs.org/api/crypto.html#crypto_class_cipher) module for more details on encoding.

###test

```
npm test
```

###License

MIT


