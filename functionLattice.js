lat = require('./powerSetLattice.js');

//Must improve tha point
var l = new lat.PowerSetLattice([]);

//x is the declared variable
function variableDeclaration() {
    var j = this.joinParentsMap();
    var t = this.addKeyValue(this.inst.x, []);
    return j && t;
};


//x is the readen variable. v is the new created variable that contains the value of x
function readVariable() {
    var j= this.joinParentsMap();
    var t = this.updateKeyValue(this.inst.v, this.getParentsValue(this.inst.x))
    return j && t;
};

//x is the written variable, v is the value, jstype is the type of the value (Literal or Identifier)
function writeVariable() {
    var j= this.joinParentsMap();
    if (this.inst.jstype == 'Literal') {
        return j && this.updateKeyValue(this.inst.x, []);
    } else { //'Identifier'
        var v_id = this.getParentsValue(this.inst.v);
        return j && this.updateKeyValue(this.inst.x, v_id);
    };
};


function functionDeclaration() {
    var j= this.joinParentsMap();
    var t = this.addKeyValue(this.inst.id, [this.inst.id]);
    return j && t;
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
    if (state.type == 'functionDeclaration') {
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
module.exports.callEntry = defaultState;
module.exports.callExit = defaultState;
module.exports.defaultState = defaultState;
module.exports.pre = pre;