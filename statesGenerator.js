var state = require('./state.js');

//change here your module to customize the generator
var sil = require('./simpleIntegerLattice.js');

var state_id = 0;


//input an abstraction and return an array of states with established links (not a real CFG)
function generateStates(abst) {
    //the array that contains the states
    var states = [];
    var last_state;

    for (var i = 0; i < abst.instructions.length; i++) {
        last_state = generateState(abst.instructions[i], states, last_state);
    };

    return states;
};


function generateState(inst, states, last_state) {
    switch (inst.type) {
        case 'declare-variable':
            return generateDeclareVariable(inst, states, last_state);
        case 'read-variable':
            return generateReadVariable(inst, states, last_state);
        case 'write-variable':
            return generateWriteVariable(inst, states, last_state);
        case 'operation':
            return generateOperation(inst, states, last_state);
        case 'if':
            return generateIf(inst, states, last_state);
        case 'while':
            return generateWhile(inst, states, last_state);
        case 'for':
            return generateFor(inst, states, last_state);
            //default: return [];
    };
};

function generateDeclareVariable(inst, states, last_state) {
    var ns = new state.State('declare'+state_id, sil.l);
    state_id++;
    ns.f = function() {
        return sil.variableDeclaration.apply(this, [inst]);
    };
    if (last_state) ns.parents.push(last_state);
    states.push(ns);
    return ns;
};


function generateReadVariable(inst, states, last_state) {
    var ns = new state.State('read'+state_id, sil.l);
    state_id++;
    ns.f = function() {
        sil.readVariable.apply(this, [inst]);
    };
    if (last_state) ns.parents.push(last_state);
    states.push(ns);
    return ns;
};

function generateWriteVariable(inst, states, last_state) {
    var ns = new state.State('write'+state_id, sil.l);
    state_id++;
    ns.f = function() {
        sil.writeVariable.apply(this, [inst]);
    };
    if (last_state) ns.parents.push(last_state);
    states.push(ns);
    return ns;
};


function generateOperation(inst, states, last_state) {
    var ns = new state.State('operation'+state_id, sil.l);
    state_id++;
    ns.f = function() {
        sil.operation.apply(this, [inst]);
    };
    if (last_state) ns.parents.push(last_state);
    states.push(ns);
    return ns;
};

function generateIf(inst, states, last_state) {
    //if start
    var s_start_if = new state.State('start_if'+state_id, sil.l);
    s_start_if.f = function() {
        sil.ifstart.apply(this, [inst]);
    };
    state_id++;
    if (last_state) s_start_if.parents.push(last_state);
    states.push(s_start_if);

    //if end
    var s_end_if = new state.State('end_if'+state_id, sil.l);
    s_end_if.f = function() {
        sil.ifend.apply(this, [inst]);
    };
    state_id++;
    states.push(s_end_if);

    //consequente
    if (inst.consequent) {
        var consequent_states = generateStates(inst.consequent);
        for (var i = 0; i < consequent_states.length; i++) {
            states.push(consequent_states[i])
        };
        if (consequent_states && consequent_states.length > 0) {
        	consequent_states[0].parents.push(s_start_if);
            s_end_if.parents.push(consequent_states[consequent_states.length - 1]);
        };
    };

    //alternate
    if (inst.alternate) {
    	var alternate_states = generateStates(inst.alternate);
        for (var i = 0; i < alternate_states.length; i++) {
            states.push(alternate_states[i])
        };
        if (alternate_states && alternate_states.length > 0) {
        	alternate_states[0].parents.push(s_start_if);
            s_end_if.parents.push(alternate_states[alternate_states.length - 1]);
        };

    } else s_end_if.parents.push(s_start_if);

    return s_end_if;

};


function generateWhile(inst, states, last_state) {
    //if start
    var s_while = new state.State('while'+state_id, sil.l);
    s_while.f = function() {
        sil.whilebody.apply(this, [inst]);
    };
    state_id++;
    if (last_state) s_while.parents.push(last_state);
    states.push(s_while);

    //body
    if (inst.body) {
        var body_states = generateStates(inst.body);
        for (var i = 0; i < body_states.length; i++) {
            states.push(body_states[i])
        };
        if (body_states && body_states.length > 0) {
        	body_states[0].parents.push(s_while);
            s_while.parents.push(body_states[body_states.length - 1]);
        };
    };

    return s_while;

};


module.exports.generateStates = generateStates;
