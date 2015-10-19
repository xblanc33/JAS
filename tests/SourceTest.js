var rJS = require('../rewriteJS.js');
var cfgb = require('../callBuilder.js');
var fs = require('fs');
var pr = require('../printGraph.js');

dirpath = './tests/source/';
graphpath = './tests/graph/';

//parameters
var args = process.argv.slice(2);

//Append all files
var files;
if (args.length > 0 ) files = args;
else files = fs.readdirSync(dirpath);

for (var i = 0; i < files.length; i++) {
    //var data = fs.readFileSync(dirpath + files[i]);



	console.log('-------------------------------');
    console.log(files[i]);

    debugger;
    var abst = undefined;
    abst = rJS.rewriteJS(dirpath+files[i])
    var genStates = undefined;
    genStates = cfgb.build(abst);
    //console.log(genStates.all);

    
    pr.print(genStates.all, graphpath+files[i]+'.gv');


    var lattice = require('../simpleIntegerLattice.js');

    var eng = require('../fixPointEngine.js');
    eng.init(genStates.all, lattice);
    eng.run(genStates.all);
    eng.printAllVariablesAtTheEnd(genStates.last);


};

