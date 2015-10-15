function attachLatticeFunctions(states, lattice) {
    for (var i = 0; i < states.length; i++) {
        states[i].lattice = lattice.l;
        if (lattice.pre) lattice.pre(states[i]);
        switch (states[i].type) {
            case 'variableDeclaration':
                states[i].f = lattice.variableDeclaration;
                break;
            case 'readVariable':
                states[i].f = lattice.readVariable;
                break;
            case 'writeVariable':
                states[i].f = lattice.writeVariable;
                break;
            case 'operation':
                states[i].f = lattice.operation;
                break;
            case 'ifstart':
                states[i].f = lattice.ifstart;
                break;
            case 'ifend':
                states[i].f = lattice.ifend;
                break;
            case 'while':
                states[i].f = lattice.whilebody;
                break;
            case 'for':
                states[i].f = lattice.forbody;
                break;
            case 'functionDeclaration':
                states[i].f = lattice.functionDeclaration;
                break;
            case 'functionExpression':
                states[i].f = lattice.functionExpression;
                break;
            case 'callEntry':
                states[i].f = lattice.callEntry;
                break;
            case 'callExit':
                states[i].f = lattice.callExit;
                break;
            default:
                states[i].f = lattice.defaultState;
                break;
        };
    };
};

function clean(states) {
    for (var i = 0; i < states.length; i++) {
        states[i].smap.clean();
        states[i].f = undefined;
    };
};

function init(states, lattice) {
    attachLatticeFunctions(states, lattice);
};

function run(states) {
    var fixed = false;
    //var start = 0;
    //var next_start = 0;
    while (!fixed) {
        fixed = true;
        //console.log('new round');

        for (var i = 0; i < states.length; i++) {
            //var j = (i + start) % states.length;
            //console.log('state: '+states[i].id);
            var ch = states[i].f.apply(states[i], []);;
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

    for (v in lastState.getVariables()) {
        if (v.lastIndexOf('__v_') == -1) {
            console.log('Variable ' + v + ' = ' + lastState.getValue(v));
        };
    };
};


function printAllVariablesAtTheEnd(lastState) {

    //console.log(lastState.id);
    var variables = lastState.getVariables();

    for (var i = 0; i < variables.length; i++) {
        console.log('Variable ' + variables[i] + ' = ' + lastState.getValue(variables[i]));
    };
};


module.exports.clean = clean;
module.exports.init = init;
module.exports.run = run;
module.exports.printVariablesAtTheEnd = printVariablesAtTheEnd;
module.exports.printAllVariablesAtTheEnd = printAllVariablesAtTheEnd;
