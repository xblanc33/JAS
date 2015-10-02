var rJS = require('./rewriteJS.js');

var abst = rJS.rewriteJS('simpleCode.js')

console.log(abst);


var sg = require('./statesBuilder.js');
var genStates = sg.generateStates(abst);
console.log(genStates);
console.log(genStates.all.length);

//var lattice = require('./functionLattice.js');
var lattice = require('./simpleIntegerLattice.js');

var eng = require('./fixPointEngine.js');
eng.init(genStates.all, lattice);
eng.run(genStates.all);
eng.printAllVariablesAtTheEnd(genStates.last);




