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

    return {'success':true, 'all':states,'last':last_state , 'first':states[0]};
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
        return sil.readVariable.apply(this, [inst]);
    };
    if (last_state) ns.parents.push(last_state);
    states.push(ns);
    return ns;
};

function generateWriteVariable(inst, states, last_state) {
    var ns = new state.State('write'+state_id, sil.l);
    state_id++;
    ns.f = function() {
        return sil.writeVariable.apply(this, [inst]);
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
        return sil.ifstart.apply(this, [inst]);
    };
    state_id++;
    if (last_state) s_start_if.parents.push(last_state);
    states.push(s_start_if);

    //if end
    var s_end_if = new state.State('end_if'+state_id, sil.l);
    s_end_if.f = function() {
        return sil.ifend.apply(this, [inst]);
    };
    state_id++;
    states.push(s_end_if);

    //consequente
    if (inst.consequent) {
    	var consequent = generateStates(inst.consequent);
        for (var i = 0; i < consequent.all.length; i++) {
            states.push(consequent.all[i])
        };
        if (consequent && consequent.all.length > 0) {
        	consequent.all[0].parents.push(s_start_if);
            s_end_if.parents.push(consequent.last);
        };
    };

    //alternate
    if (inst.alternate) {
    	var alternate = generateStates(inst.alternate);
        for (var i = 0; i < alternate.all.length; i++) {
            states.push(alternate.all[i])
        };
        if (alternate && alternate.all.length > 0) {
        	alternate.all[0].parents.push(s_start_if);
            s_end_if.parents.push(alternate.last);
        };

    } else s_end_if.parents.push(s_start_if);

    return s_end_if;

};


function generateWhile(inst, states, last_state) {
    //if start
    var s_while = new state.State('while'+state_id, sil.l);
    s_while.f = function() {
        return sil.whilebody.apply(this, [inst]);
    };
    state_id++;
    if (last_state) s_while.parents.push(last_state);
    states.push(s_while);

    //body
    if (inst.body) {
        var body = generateStates(inst.body);
        for (var i = 0; i < body.all.length; i++) {
            states.push(body.all[i])
        };
        if (body && body.all.length > 0) {
        	body.all[0].parents.push(s_while);
            s_while.parents.push(body.last);
        };
    };

    return s_while;

};

function generateFor(inst, states, last_state) {
    //if start
    var s_for = new state.State('for'+state_id, sil.l);
    s_for.f = function() {
        return sil.forbody.apply(this, [inst]);
    };
    state_id++;
    if (last_state) s_for.parents.push(last_state);
    states.push(s_for);

    //body
    if (inst.body) {
        var body = generateStates(inst.body);
        for (var i = 0; i < body.all.length; i++) {
            states.push(body.all[i])
        };
        if (body && body.all.length > 0) {
        	body.all[0].parents.push(s_for);
            s_for.parents.push(body.last);
        };
    };

    return s_for;

};


module.exports.generateStates = generateStates;
