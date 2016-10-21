var expect = require('chai').expect;

var stream = require('stream');
var RandStream = require('randstream');
var concat = require('concat-stream');

var TruncateStream = require('./truncate-stream');

describe('truncate-stream', function() {

  it('should truncate the input when enough is provided in the first chunk', function (done) {
    var source = new RandStream();
    var truncate = new TruncateStream({maxBytes: 1024});

    source.pipe(truncate).pipe(concat(function(data) {
      expect(data).to.have.lengthOf(1024);
      done();
    }));
  });

  it('should truncate the input with multi-chunk streams', function (done) {
    var source = new RandStream();
    var truncate = new TruncateStream({maxBytes: 100000});

    source.pipe(truncate).pipe(concat(function(data) {
      expect(data).to.have.lengthOf(100000);
      done();
    }));
  });

  it('should not truncate a stream that was smaller than the maxBytes', function (done) {
    var source = new stream.Readable();
    source._read = function () {
      this.push(typeof(Buffer.alloc) == 'function' ? Buffer.alloc(100) : new Buffer(100)); // support for node 6 Buffer.alloc method
      this.push(null);
    };
    var truncate = new TruncateStream({maxBytes: 1024});

    source.pipe(truncate).pipe(concat(function (data) {
      expect(data).to.have.lengthOf(100);
      done();
    }));
  });
});
