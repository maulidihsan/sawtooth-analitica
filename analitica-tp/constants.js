const crypto = require('crypto');
const TP_FAMILY = 'analitica';

let _hash = (x) => crypto.createHash('sha512').update(x).digest('hex').toLowerCase().substring(0, 62)

exports.TP_FAMILY = TP_FAMILY;
exports.TP_NAMESPACE = _hash(TP_FAMILY).substring(0, 6);
exports._hash = _hash;