var stream = require('stream');
var util = require('util');

function TruncateStream(opts) {
  if (!opts || !opts.maxBytes) throw new Error('maxBytes option is required');

  stream.Transform.call(this, opts);

  this._truncateState = {
    bytes: 0,
    maxBytes: opts.maxBytes
  };
}

util.inherits(TruncateStream, stream.Transform);
module.exports = TruncateStream;

TruncateStream.prototype._transform = function _transform(chunk, enc, callback) {
  var state = this._truncateState;
  state.bytes += chunk.length;

  // are we there yet?
  if (state.bytes < state.maxBytes) return this.push(chunk);

  this.push(chunk.slice(0, chunk.length - (state.bytes - state.maxBytes)));
  this.push(null);
};