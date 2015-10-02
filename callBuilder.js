var sb = require('./statesBuilder.js');
var lattice = require('./functionLattice.js');
var eng = require('./fixPointEngine.js');

function linkCall(states, state, finst) {
    var fstates = sb.generateStates(finst.body);
    if (fstates.all.length > 0) {
        fstates.first.parents.push(state);
        state.exit.parents.push(fstates.last);
        for (var i = 0; i < fstates.all.length; i++) {
            states.push(fstates.all[i]);
        };
        return true;
    } else return false;
};

function linkCalls(states, lattice) {
    console.log('linkCalls');
    console.log(lattice.l.values);
    for (var i = 0; i < states.length; i++) {
        if (states[i].type == 'callEntry') {
            if (states[i].map[states[i].inst.callee].length > 0) {
                var linked = false;
                for (var j = 0; j < states[i].map[states[i].inst.callee].length; j++) {
                    var finst = lattice.l.values[states[i].map[states[i].inst.callee][j]];
                    console.log(finst);
                    if (linkCall(states, states[i], finst)) linked = true;;
                };
                if (linked) {
                    var p = states[i].exit.parents.indexOf(states[i]);
                    states[i].exit.parents.splice(p, 1);
                };
            };
        };
    };
};


function build(abst) {
    var genStates = sb.generateStates(abst);
    eng.init(genStates.all, lattice);
    eng.run(genStates.all);
    linkCalls(genStates.all, lattice);
    eng.clean(genStates.all);
    return genStates;
};

module.exports.build = build;
