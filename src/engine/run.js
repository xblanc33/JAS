//load all required modules
var fs = require('fs');
var ib = require('../parser/InstructionsBuilder.js');
var sb = require('./StatesBuilder.js');

//read the input file
var fileName = process.argv[2];
var data = fs.readFileSync(fileName, 'utf-8');

//build abst
var abst = ib.build(data);

//build graph
var graph = sb.build(abst);

//print graph
var pp = require('./GraphPrinter.js');
pp.print(graph,'./graph.gv');
