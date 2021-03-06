var fs = require('fs');

// Cat together all the web files together to make deployment easier.
// This should probably only be called once at initialization since it does
// synchronous reads.
exports.source = function () {
    var socketIO = fs.readFileSync(
        __dirname + '/vendor/web/Socket.IO/socket.io.js'
    ).toString();
    var dnode = fs.readFileSync(__dirname + '/web/dnode.js').toString();
    var compat = fs.readFileSync(__dirname + '/web/compat.js').toString();
    var traverse = require('traverse/web').source();
    var scrubber = fs.readFileSync(__dirname + '/scrubber.js')
    
    function scrub (src) {
        return src
            .toString()
            .replace(/^module\..*/mg, '')
            .replace(/^var \S+\s*=\s*require\(.*\);/mg, '')
        ;
    }
    return [scrub(compat),socketIO,traverse,scrub(scrubber),dnode].join('\n');
};

exports.route = function (path) {
    var source = exports.source();
    return function (req, res) {
        if (path === undefined || req.url == path) {
            res.writeHead(200, { 'Content-Type' : 'text/javascript' });
            res.end(source);
        }
    };
};
