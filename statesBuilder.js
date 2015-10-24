var state = require('./State.js');
var map = require('./ScopeMap.js');


//input an abstraction and return an array of states with established links (not a real CFG)
function generateStates(abst, original_map) {
    //the array that contains the states
    var states = [];
    var last_state;
    if (!original_map) original_map = new map.ScopeMap();

    for (var i = 0; i < abst.instructions.length; i++) {
        var gen = generateDeclarationState(abst.instructions[i], states, last_state, original_map);
        if (typeof gen !== 'undefined') last_state = gen;
    };
    if (states.length > 0) states[0].parents.push(last_state);

    for (var i = 0; i < abst.instructions.length; i++) {
        var gen = generateInstructionState(abst.instructions[i], states, last_state, original_map);
        if (typeof gen !== 'undefined') last_state = gen;
    };

    return {
        'success': true,
        'all': states,
        'last': last_state,
        'first': states[0]
    };
};


function generateDeclarationState(inst, states, last_state, original_map) {
    switch (inst.type) {
        case 'declare-variable':
            return generateDeclareVariable(inst, states, last_state, original_map);
        case 'function-declaration':
            return generateFunctionDeclaration(inst, states, last_state, original_map);
    };
};


function generateInstructionState(inst, states, last_state, original_map) {
    switch (inst.type) {
        case 'read-variable':
            return generateReadVariable(inst, states, last_state, original_map);
        case 'write-variable':
            return generateWriteVariable(inst, states, last_state, original_map);
        case 'operation':
            return generateOperation(inst, states, last_state, original_map);
        case 'if':
            return generateIf(inst, states, last_state, original_map);
        case 'while':
            return generateWhile(inst, states, last_state, original_map);
        case 'for':
            return generateFor(inst, states, last_state, original_map);
        case 'function-expression':
            return generateFunctionExpression(inst, states, last_state, original_map);
        case 'call-expression':
            return generateCallExpression(inst, states, last_state, original_map);
            //default: return [];
    };
};

function generateDeclareVariable(inst, states, last_state, original_map) {
    var ns = new state.State('var_' + inst.x, 'variableDeclaration', inst, original_map.clone());
    if (last_state) ns.parents.push(last_state);
    states.push(ns);
    return ns;
};


function generateReadVariable(inst, states, last_state, original_map) {
    var ns = new state.State('read_' + inst.x + '_to_' + inst.v, 'readVariable', inst, original_map.clone());
    if (last_state) ns.parents.push(last_state);
    states.push(ns);
    return ns;
};

function generateWriteVariable(inst, states, last_state, original_map) {
    var ns = new state.State('write_' + inst.v + '_in_' + inst.x, 'writeVariable', inst, original_map.clone());
    if (last_state) ns.parents.push(last_state);
    states.push(ns);
    return ns;
};


function generateOperation(inst, states, last_state, original_map) {
    var name;
    if (inst.arity == 'unary') name = inst.x + 'op';
    else name = inst.x + 'op' + inst.y;
    var ns = new state.State(name, 'operation', inst, original_map.clone());
    if (last_state) ns.parents.push(last_state);
    states.push(ns);
    return ns;
};

function generateIf(inst, states, last_state, original_map) {
    //if start
    var s_start_if = new state.State('if_start', 'ifstart', inst, original_map.clone());
    if (last_state) s_start_if.parents.push(last_state);
    states.push(s_start_if);

    //if end
    var s_end_if = new state.State('if_end', 'ifend', inst, original_map.clone());
    states.push(s_end_if);

    //consequente
    if (inst.consequent) {
        var consequent = generateStates(inst.consequent, original_map);
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
        var alternate = generateStates(inst.alternate, original_map);
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


function generateWhile(inst, states, last_state, original_map) {
    //if start
    var s_while = new state.State('while', 'while', inst, original_map.clone());
    if (last_state) s_while.parents.push(last_state);
    states.push(s_while);

    //body
    if (inst.body) {
        var body = generateStates(inst.body, original_map);
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

function generateFor(inst, states, last_state, original_map) {
    //if start
    var s_for = new state.State('for', 'for', inst, original_map.clone());
    if (last_state) s_for.parents.push(last_state);
    states.push(s_for);

    //init
    if (inst.init) {
        var init = generateStates(inst.init, original_map);
        for (var i = 0; i < init.all.length; i++) {
            states.push(init.all[i])
        };
        if (init && init.all.length > 0) {
            init.all[0].parents.push(s_for);
            //s_for.parents.push(body.last);
        };
    };

    //test

    //update
    if (inst.update) {
        var update = generateStates(inst.update, original_map);
        for (var i = 0; i < update.all.length; i++) {
            states.push(update.all[i])
        };
        if (update && update.all.length > 0) {
            update.all[0].parents.push(init.last);
            //s_for.parents.push(body.last);
        };
    };

    //body
    if (inst.body) {
        var body = generateStates(inst.body, original_map);
        for (var i = 0; i < body.all.length; i++) {
            states.push(body.all[i])
        };
        if (body && body.all.length > 0) {
            if (update) {
                body.all[0].parents.push(update.last);
                update.all[0].parents.push(body.last);
            } else {
                body.all[0].parents.push(s_for);
                s_for.parents.push(body.last);
            };
            return body.last;
        };
    };
    return s_for;

};


function generateFunctionDeclaration(inst, states, last_state, original_map) {
    //console.log('generateFunctionDeclaration');
    //call declaration
    var s_fun_decl = new state.State('function_decl_' + inst.id, 'functionDeclaration', inst, original_map.clone());
    states.push(s_fun_decl);
    if (last_state) s_fun_decl.parents.push(last_state);


    //generate body
    var scope_map = new map.ScopeMap(original_map.clone());
    var fstates = generateStates(inst.body, scope_map);
    if (fstates.all.length > 0) {
        for (var i = 0; i < fstates.all.length; i++) {
            states.push(fstates.all[i]);
        };
    };

    //generate parameters
    for (var i = 0; i < inst.params.length; i++) {
        var s_param_decl = new state.State('param_decl_' + inst.params[i], 'parameterDeclaration', {name:inst.params[i], id:i}, scope_map.clone());
        s_param_decl.values=[];
        if (i > 0) s_param_decl.parents.push(s_param_decl_par);
        else var s_param_decl_first = s_param_decl;
        var s_param_decl_par = s_param_decl;
        states.push(s_param_decl);
        fstates.all.push(s_param_decl);
    };
    if (s_param_decl) fstates.first.parents.push(s_param_decl);
    if (s_param_decl_first) fstates.first = s_param_decl_first;
    s_fun_decl.states_body = fstates;

    return s_fun_decl;
};

function generateFunctionExpression(inst, states, last_state, original_map) {
    //console.log('generateFunctionDeclaration');
    //call declaration
    var s_fun_decl = new state.State('function_exp_' + inst.id, 'functionExpression', inst, original_map.clone());
    states.push(s_fun_decl);
    if (last_state) s_fun_decl.parents.push(last_state);


    //generate body but do not link it to the other state
    var scope_map = new map.ScopeMap(original_map.clone());
    var fstates = generateStates(inst.body, scope_map);
    if (fstates.all.length > 0) {
        for (var i = 0; i < fstates.all.length; i++) {
            states.push(fstates.all[i]);
        };
    };
    s_fun_decl.states_body = fstates;

    return s_fun_decl;
};

function generateCallExpression(inst, states, last_state, original_map) {
    //entry
    var s_call_entry = new state.State('call_' + inst.callee, 'callEntry', inst, original_map.clone());
    s_call_entry.linked = [];

    states.push(s_call_entry);
    if (last_state) s_call_entry.parents.push(last_state);

    //exit
    var s_call_exit = new state.State('end_call_' + inst.callee, 'callExit', inst, original_map.clone());
    states.push(s_call_exit);
    s_call_exit.parents.push(s_call_entry);

    //link
    s_call_entry.exit = s_call_exit;

    return s_call_exit;
};


module.exports.generateStates = generateStates;
