var r;
var i;
var o;
o = require(78249);
require(75109);
i = (r = o.lib.BlockCipherMode.extend()).Encryptor = r.extend({
  processBlock: function (e, t) {
    var n = this._cipher;
    var r = n.blockSize;
    var i = this._iv;
    var o = this._counter;
    if (i) {
      o = this._counter = i.slice(0);
      this._iv = void 0;
    }
    var s = o.slice(0);
    n.encryptBlock(s, 0);
    o[r - 1] = o[r - 1] + 1 | 0;
    for (var a = 0; a < r; a++) e[t + a] ^= s[a];
  }
});
r.Decryptor = i;
o.mode.CTR = r;
module.exports = o.mode.CTR;