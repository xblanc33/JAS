function fixedPoint(states) {
    //console.log('Fixed point');
    var fixed = false;
    //var start = 0;
    //var next_start = 0;
    while (!fixed) {
        fixed = true;
        //console.log('new round');

        for (var i = 0; i < states.length; i++) {
            //var j = (i + start) % states.length;
            //console.log('state: '+states[i].id);
            var ch = states[i].applyF();
            //console.log(ch);
            if (ch) {
                //next_start = i;
                //console.log('something has really changed');
                fixed = false;
            };
        };
        //start = next_start + 1;
    };
};

function printVariablesAtTheEnd(lastState) {

	//console.log(lastState.id);

	for (v in lastState.map) {
		if (v.lastIndexOf('__v_') == -1) {
			console.log('Variable '+v+ ' = '+lastState.map[v]);
		};
	};
};

module.exports.fixedPoint = fixedPoint;
module.exports.printVariablesAtTheEnd = printVariablesAtTheEnd;