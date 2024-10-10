var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync("dellaa", salt);

console.log(hash)

console.log(bcrypt.compareSync("dellaa", hash)); // true

console.log(bcrypt.compareSync("del", hash))