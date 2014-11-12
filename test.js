var expect = require('chai').expect;

var RandStream = require('randstream');
var concat = require('concat-stream');

var TruncateStream = require('./truncate-stream');

describe('truncate-stream', function(done) {
  it('should truncate the input', function (done) {
    var source = new RandStream();
    var truncate = new TruncateStream({maxBytes: 1024});

    source.pipe(truncate).pipe(concat(function(data) {
      expect(data.length).to.eql(1024);
      done();
    }));
  });
});