var rJS = require('./rewriteJS.js');

var abst = rJS.rewriteJS('simpleCode.js')

console.log(abst);


var sg = require('./statesGenerator.js');

var genStates = sg.generateStates(abst);
//console.log(genStates);

fixedPoint(genStates);



function fixedPoint(states) {
    console.log('Fixed point');
    var fixed = false;
    var start = 0;
    var next_start = 0;
    while (!fixed) {
        fixed = true;
        for (var i = 0; i < states.length; i++) {
            var j = (i + start) % states.length;
            if (states[j].applyF()) {
                next_start = i;
                fixed = false;
            };
        };
        start = next_start + 1;
    };
}
