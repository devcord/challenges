'use strict';

const crypto = require('crypto')

const encrypt = (string, key) => {
    const iv = crypto.randomBytes(16)

    const cipher = crypto.createCipheriv(
        'aes-256-cbc', 
        new Buffer.from(key),
        iv
    )
    
    const encrypted = Buffer.concat([
        cipher.update(string), 
        cipher.final()
    ])

    return `${iv.toString('hex')}:${encrypted.toString('hex')}`
}

const decrypt = (string, key) => {
    string = string.split(':')

    const decipher = crypto.createDecipheriv(
        'aes-256-cbc', 
        new Buffer.from(key), 
        new Buffer.from(
            string.shift(), 
            'hex'
        )
    )

    return Buffer.concat([
        decipher.update(new Buffer.from(
            string.join(':'), 
            'hex'
        )), 
        decipher.final()
    ]).toString()
}

module.exports = {
    decrypt, 
    encrypt
}