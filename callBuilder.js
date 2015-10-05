var sb = require('./statesBuilder.js');
var lattice = require('./functionLattice.js');
var eng = require('./fixPointEngine.js');

function linkCall(states, state_caller, state_callee) {

    if (state_callee.states_body.all.length > 0) {
        state_callee.states_body.first.parents.push(state_caller);
        state_caller.exit.parents.push(state_callee.states_body.last);
    };
};

function removeEmptyBody(states) { //when non linked, start and end call are coupled, remove that links
    for (var i = 0; i < states.length; i++) {
        if (states[i].type == 'callEntry') {
        	//console.log(states[i].linked.length);
            if (states[i].linked.length > 0) {
            	var index = states[i].exit.parents.indexOf(states[i]);
                if (index != -1) {
                	//console.log('remove');
                    states[i].exit.parents.splice(0 , 1);
                };
            };
        };
    };

};

function linkCalls(states, lattice) {
    //console.log('linkCalls');
    //console.log(lattice.l.values);
    var linked = false;
    for (var i = 0; i < states.length; i++) {
        if (states[i].type == 'callEntry') {
            var callee = states[i].inst.callee; //id of the callee function

            if (states[i].map[callee]) { //if the state has a value for callee
                if (states[i].map[callee].length > 0) { //if that value is not empty
                    var callees = states[i].map[callee]; // the values for callee
                    for (var j = 0; j < callees.length; j++) {
                        var state_callee = lattice.l.values[callees[j]]; //inst of jth callees

                        if (states[i].linked.lastIndexOf(state_callee.sid) == -1) {
                            states[i].linked.push(state_callee.sid);
                            linkCall(states, states[i], state_callee);
                            linked = true;
                        };
                    };
                };
            };
        };
    };
    return linked;
};


function build(abst) {
    var genStates = sb.generateStates(abst);
    //console.log(genStates.all);
    eng.init(genStates.all, lattice);
    var linkAgain = true;
    while (linkAgain) {
        eng.run(genStates.all);
        linkAgain = linkCalls(genStates.all, lattice);
        removeEmptyBody(genStates.all);
    };
    eng.clean(genStates.all);
    return genStates;
};

module.exports.build = build;
