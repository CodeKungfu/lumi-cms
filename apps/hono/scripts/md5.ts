import CryptoJS from 'crypto-js'

const password = '123456'
const hash = CryptoJS.MD5(password).toString()
console.log(`Password: ${password}`)
console.log(`MD5 Hash: ${hash}`)
