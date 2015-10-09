var rJS = require('./rewriteJS.js');
var cfgb = require('./callBuilder.js');


var abst = rJS.rewriteJS('simpleCode.js')
var genStates = cfgb.build(abst);
//console.log(genStates.all);

var pr = require('./printGraph.js');
pr.print(genStates.all, './graph.gv');


var lattice = require('./simpleIntegerLattice.js');

var eng = require('./fixPointEngine.js');
eng.init(genStates.all, lattice);
eng.run(genStates.all);
eng.printAllVariablesAtTheEnd(genStates.last);
