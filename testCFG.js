var rJS = require('./rewriteJS.js');
var cfgb = require('./callBuilder.js');


var abst = rJS.rewriteJS('simpleCode.js')
var genStates = cfgb.build(abst);
//console.log(abst);


var lattice = require('./simpleIntegerLattice.js');

var eng = require('./fixPointEngine.js');
eng.init(genStates.all, lattice);
eng.run(genStates.all);
eng.printAllVariablesAtTheEnd(genStates.last);
