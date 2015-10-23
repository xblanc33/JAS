lat = require('./powerSetLattice.js');

//Must improve tha point
var l = new lat.PowerSetLattice([]);

//x is the declared variable
function variableDeclaration() {
    var old = this.getVariableValue(this.inst.x);
    this.joinParentsMap();
    this.addVariableValueInLocalScope(this.inst.x, []);
    var ne = this.getVariableValue(this.inst.x);
    var changed = l.equality(old, ne);
    return !changed;
};


//x is the readen variable. v is the new created variable that contains the value of x
function readVariable() {
    var old = this.getVariableValue(this.inst.v);
    this.joinParentsMap();
    this.addVariableValueInLocalScope(this.inst.v, this.getParentsVariableValue(this.inst.x))
    var ne = this.getVariableValue(this.inst.v);
    return !l.equality(old, ne);
};

//x is the written variable, v is the value, jstype is the type of the value (Literal or Identifier)
function writeVariable() {
    var old = this.getVariableValue(this.inst.x);
    this.joinParentsMap();
    if (this.inst.jstype == 'Literal') {
        this.updateVariableValue(this.inst.x, []);
    } else { //'Identifier'
        var v_id = this.getParentsVariableValue(this.inst.v);
        this.updateVariableValue(this.inst.x, v_id);
    };
    var ne = this.getVariableValue(this.inst.x);
    return !l.equality(old, ne);
};


function functionDeclaration() {
    var old = this.getVariableValue(this.inst.id);
    this.joinParentsMap();
    this.addVariableValueInLocalScope(this.inst.id, [this.inst.id]);
    var ne = this.getVariableValue(this.inst.id);
    return !l.equality(old, ne);
};


function parameterDeclaration() {
    var old = this.getVariableValue(this.inst.name);
    this.joinParentsMap();
    this.addVariableValueInLocalScope(this.inst.name, this.values);
    var ne = this.getVariableValue(this.inst.name);
    var changed = l.equality(old, ne);
    return !changed;
};

function functionExpression() {
    var old = this.getVariableValue(this.inst.id);
    this.joinParentsMap();
    this.addVariableValueInLocalScope(this.inst.id, [this.inst.id]);
    var ne = this.getVariableValue(this.inst.id);
    return !l.equality(old, ne);
};

// function callEntry() {
//     //create a new map for the scope
//     //that new map should have all the parameters, the global variable
//     return this.joinMap();
// };

// function callExit() {
//     //delete the map for the scope
//     return this.joinMap();
// };

function defaultState() {
    return this.joinParentsMap();
};


function pre(state) {
    //console.log('pre');
    if (state.type == 'functionDeclaration' || state.type == 'functionExpression') {
        //console.log('functionDeclaration');
        if (state.inst.id) {
            //console.log('addElement');
            l.addElement(state.inst.id, state);
        };
    };
};



module.exports.l = l;
module.exports.variableDeclaration = variableDeclaration;
module.exports.readVariable = readVariable;
module.exports.writeVariable = writeVariable;
module.exports.operation = defaultState;
module.exports.ifstart = defaultState;
module.exports.ifend = defaultState;
module.exports.whilebody = defaultState;
module.exports.forbody = defaultState;
module.exports.functionDeclaration = functionDeclaration;
module.exports.parameterDeclaration = parameterDeclaration;
module.exports.functionExpression = functionExpression;
module.exports.callEntry = defaultState;
module.exports.callExit = defaultState;
module.exports.defaultState = defaultState;
module.exports.pre = pre;
