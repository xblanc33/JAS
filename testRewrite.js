var rJS = require('./rewriteJS.js');

var abst = rJS.rewriteJS('simpleCode.js')

//console.log(abst);


var sg = require('./statesGenerator.js');

var genStates = sg.generateStates(abst);
//console.log(genStates);


var eng = require('./engine.js');
eng.fixedPoint(genStates.all);

eng.printVariablesAtTheEnd(genStates.last);



