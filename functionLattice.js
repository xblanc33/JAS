lat = require('./powerSetLattice.js');

//Must improve tha point
var l = new lat.PowerSetLattice([]);

//x is the declared variable
function variableDeclaration() {
    return this.joinMap(this.inst.x, []);
};


//x is the readen variable. v is the new created variable that contains the value of x
function readVariable() {
    return (this.joinMap(this.inst.v, this.getParentValue(this.inst.x)));
};

//x is the written variable, v is the value, jstype is the type of the value (Literal or Identifier)
function writeVariable() {
    if (this.inst.jstype == 'Literal') {
        return this.joinMap(this.inst.x, []);
    } else { //'Identifier'
        var v_id = this.getParentValue(this.inst.v);
        return this.joinMap(this.inst.x, v_id);
    };
};

//returns the sign of a literal
function operation() {
    return this.joinMap();
};

function ifstart() {
    return this.joinMap();
};

function ifend() {
    return this.joinMap();
};

function whilebody() {
    return this.joinMap();
};

function forbody() {
    return this.joinMap();
};

function functionDeclaration() {
    return (this.joinMap(this.inst.id, [this.inst.id]));
};

function callEntry() {
    return this.joinMap();
};

function callExit() {
    return this.joinMap();
};

function defaultState() {
    return this.joinMap();
};



function pre(state) {
    //console.log('pre');
    if (state.type == 'functionDeclaration') {
        //console.log('functionDeclaration');
        if (state.inst.id) {
            //console.log('addElement');
            l.addElement(state.inst.id, state.inst);
        };
    };
};



module.exports.l = l;
module.exports.variableDeclaration = variableDeclaration;
module.exports.readVariable = readVariable;
module.exports.writeVariable = writeVariable;
module.exports.operation = operation;
module.exports.ifstart = ifstart;
module.exports.ifend = ifend;
module.exports.whilebody = whilebody;
module.exports.forbody = forbody;
module.exports.functionDeclaration = functionDeclaration;
module.exports.callEntry = callEntry;
module.exports.callExit = callExit;
module.exports.defaultState = defaultState;
module.exports.pre = pre;