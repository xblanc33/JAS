lat = require('./lattice.js');

//Must improve tha point
var l = new lat.Lattice(['+', '-']);
l.lift('B');
l.down('?');
l.enforceAll();

//x is the declared variable
function variableDeclaration() {
    var j = this.joinParentsMap();
    var t = this.addKeyValue(this.inst.x, 'B');
    return j && t;
};


//x is the readen variable. v is the new created variable that contains the value of x
function readVariable() {
    var j = this.joinParentsMap();
    var t = this.addKeyValue(this.inst.v, this.getParentsValue(this.inst.x));
    return j && t;
};

//x is the written variable, v is the value, jstype is the type of the value (Literal or Identifier)
function writeVariable() {
    var j = this.joinParentsMap();
    if (this.inst.jstype == 'Literal') {
        var val = signOfLiteral(this.inst.v);
        return j && this.updateKeyValue(this.inst.x, val);
    } else { //'Identifier'
        var v_id = this.getParentsValue(this.inst.v);
        return j && this.updateKeyValue(this.inst.x, v_id);
    }
};


//returns the sign of a literal
function signOfLiteral(lit) {
    var num = parseInt(lit);
    if (!isNaN(num)) {
        if (num >= 0) {
            return '+'
        } else return '-';
    } else return 'B';
}

//returns the sign of a literal
function operation() {
    var j = this.joinParentsMap();
    if (this.inst.arity == 'unary') {
        if (this.inst.xjstype == 'Literal') {
            var val = signOfLiteral(this.inst.x);
            return j && this.updateKeyValue(this.inst.r, elementUnaryExpression(val, this.inst.operator));
        } else { //'Identifier'
            var v_id = this.getParentsValue(this.inst.x);
            return j && this.updateKeyValue(this.inst.r, v_id);
        }
    } else { //'binary'
        var l, r;
        if (this.inst.xjstype == 'Literal') {
            l = signOfLiteral(this.inst.x);
        } else l = this.getParentsValue(this.inst.x);
        if (this.inst.yjstype == 'Literal') {
            r = signOfLiteral(this.inst.y);
        } else r = this.getParentsValue(this.inst.y);
        return j && this.updateKeyValue(this.inst.r, elementBinaryExpression(l, r, this.inst.operator));
    };
};

function elementUnaryExpression(v, op) {
	//console.log('unary'+v+op);
	if (v=== '+' && op === '+') return '+';
    if (v === '-' && op === '-') return '+';
    if (v === '-' && op === '+') return '-';
    if (v === '+' && op === '-') return '-';
    else return '?';
}


function elementBinaryExpression(l, r, op) {
    switch (op) {
        case ('+'):
            return signPlus(l, r);
            break;
        case ('-'):
            return signMinus(l, r);
            break;
        case ('*'):
            return signPower(l, r);
            break;
        default:
            return 'B';
    };
};

function signPlus(l, r) {
    if (l === '+' && r === '+') return '+';
    if (l === '-' && r === '-') return '-';
    else return '?';
};

function signMinus(l, r) {
    if (l === '-' && r === '+') return '-';
    else if (l === '+' && r === '-') return '+';
    else return '?';
};

function signPower(l, r) {
    if (l === '+' && r === '+') return '+';
    if (l === '-' && r === '-') return '+';
    else return '-';
};




function defaultState() {
    return this.joinParentsMap();
};

module.exports.l = l;
module.exports.variableDeclaration = variableDeclaration;
module.exports.readVariable = readVariable;
module.exports.writeVariable = writeVariable;
module.exports.operation = operation;
module.exports.ifstart = defaultState;
module.exports.ifend = defaultState;
module.exports.whilebody = defaultState;
module.exports.forbody = defaultState;
module.exports.callEntry = defaultState;
module.exports.callExit = defaultState;
module.exports.defaultState = defaultState;
module.exports.functionDeclaration = defaultState;
