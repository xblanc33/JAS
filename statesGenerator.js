var state = require('./state.js');
var sil = require('./simpleIntegerLattice.js');

var state_id = 0;


//input an abstraction and return an array of states with established links (not a real CFG)
function generateStates(abst) {
    //the array that contains the states
    var states = [];
    var last_state;

    for (var i = 0; i < abst.instructions.length; i++) {
        var state_inst = generateState(abst.instructions[i]);
        if (state_inst) {
            if (last_state) state_inst.parents.push(last_state);
            last_state = state_inst;
            states.push(state_inst);
        };

    };

    return states;
};


function generateState(inst) {
    switch (inst.type) {
        case 'declare-variable':
            return generateDeclareVariable(inst);
        case 'read-variable':
            return generateReadVariable(inst);
        case 'write-variable':
            return generateWriteVariable(inst);
        case 'operation':
            return generateOperation(inst);
        case 'if':
            return generateIf(inst);
        case 'while':
            return generateWhile(inst);
        case 'for':
            return generateFor(inst);
            //default: return [];
    };
};

function generateDeclareVariable(inst) {
    var ns = new state.State(state_id, sil.l);
    state_id++;
    ns.f = function() {
        return sil.variableDeclaration.apply(this, [inst]);
    };
    return ns;
};


function generateReadVariable(inst) {
    var ns = new state.State(state_id, sil.l);
    state_id++;
    ns.f = function() {
        sil.readVariable.apply(this, [inst]);
    };
    return ns;
};

function generateWriteVariable(inst) {
    var ns = new state.State(state_id, sil.l);
    state_id++;
    ns.f = function() {
        sil.writeVariable.apply(this, [inst]);
    };
    return ns;
};


function generateOperation(inst) {
    var ns = new state.State(state_id, sil.l);
    state_id++;
    ns.f = function() {
        sil.operation.apply(this, [inst]);
    };
    return ns;
};


module.exports.generateStates = generateStates;
