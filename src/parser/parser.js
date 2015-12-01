//load all required modules
var fs = require('fs');
var esprima = require('esprima');

//read the input file
var fileName = process.argv[2];
var data = fs.readFileSync(fileName, 'utf-8');

//parse
var ast = esprima.parse(data, {
    loc: true
});

console.log(ast);