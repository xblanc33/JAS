lat = require('./lattice.js');

//Must improve tha point
var l = new lat.Lattice(['+', '-']);
l.lift('B');
l.down('?');
l.enforceAll();

//x is the declared variable
function variableDeclaration(inst) {
    return this.join(inst.x, 'B');
};


//x is the readen variable. v is the new created variable that contains the value of x
function readVariable(inst) {
    return (this.join(inst.v, this.getParentValue(inst.x)));
};

//x is the written variable, v is the value, jstype is the type of the value (Literal or Identifier)
function writeVariable(inst) {
    if (inst.jstype == 'Literal') {
        var val = signOfLiteral(inst.v);
        return this.join(inst.x, val);
    } else { //'Identifier'
        var v_id = this.getParentValue(inst.v);
        return this.join(inst.x, v_id);
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
function operation(op) {
    if (op.arity == 'unary') {
        if (op.xjstype == 'Literal') {
            var val = signOfLiteral(op.x);
            return this.join(op.r, elementUnaryExpression(val, op.operator));
        } else { //'Identifier'
            var v_id = this.getParentValue(op.x);
            return this.join(op.r, v_id);
        }
    } else { //'binary'
        var l, r;
        if (op.xjstype == 'Literal') {
            l = signOfLiteral(op.x);
        } else l = this.getParentValue(op.x);
        if (op.yjstype == 'Literal') {
            r = signOfLiteral(op.y);
        } else r = this.getParentValue(op.y);
        return this.join(op.r, elementBinaryExpression(l, r, op.operator));
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
    if (l === '-' && r === '-') return '-';
    else return '?';
};


function ifstart(inst) {
	return this.join();
};

function ifend(inst) {
	return this.join();
};


module.exports.l = l;
module.exports.variableDeclaration = variableDeclaration;
module.exports.readVariable = readVariable;
module.exports.writeVariable = writeVariable;
module.exports.operation = operation;
module.exports.ifstart = ifstart;
module.exports.ifend = ifend;
