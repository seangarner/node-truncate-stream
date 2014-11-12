# truncate-stream

A Transform stream which truncates input after N bytes.  **Warning** since it truncates at a byte
marker it could corrupt the last char of a text stream with doublebyte chars.


```
npm install truncate-stream
```

When the threshold has been reached it forcibly ends the stream rather than just ignoring any
further bytes.  That works for the use case I had but could potentially cause socket hangup errors
with http streams.


## Usage
Get 1KB of randomness from randstream which otherwise would continue indefinitely.
```
var RandStream = require('randstream');
var concat = require('concat-stream');
var TruncateStream = require('truncate-stream');

var random = new RandStream();
var truncate = new TruncateStream({maxBytes: 1024});

random.pipe(truncate).pipe(concat(function(data) {
  // data.length === 1024
});
```


## Licence
MIT