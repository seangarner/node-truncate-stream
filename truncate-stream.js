var stream = require('stream');
var util = require('util');

function TruncateStream(opts) {
  if (!opts || !opts.maxBytes) throw new Error('maxBytes option is required');

  stream.Transform.call(this, opts);

  this._truncateState = {
    bytes: 0,
    maxBytes: opts.maxBytes,
    truncated: false,
    src: []
  };

  this.on('pipe', function (source) {
    this._truncateState.src.push(source);
  });
}

util.inherits(TruncateStream, stream.Transform);
module.exports = TruncateStream;

TruncateStream.prototype._transform = function _transform(chunk, enc, callback) {
  var state = this._truncateState;
  if (state.truncated) return callback();

  state.bytes += chunk.length;

  // are we there yet?
  if (state.bytes < state.maxBytes) {
    // nope
    this.push(chunk);
    return callback();
  }

  state.truncated = true;

  // push exactly what's left to make up maxBytes
  this.push(chunk.slice(0, chunk.length - (state.bytes - state.maxBytes)));

  // unpipe ourselves and redirect their output to /dev/null
  for (var i = 0; i < state.src.length; i++) {
    state.src[i].unpipe(this);
    state.src[i].on('data', devnull);
  }
  
  state.src = null;
  this.end();
  callback();
};

function devnull() {}