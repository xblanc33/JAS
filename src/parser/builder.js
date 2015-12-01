//load all required modules
var fs = require('fs');
var ib = require('./InstructionsBuilder.js');

//read the input file
var fileName = process.argv[2];
var data = fs.readFileSync(fileName, 'utf-8');

//build
var abst = ib.build(data);

//print
ib.prettyPrint(abst);

