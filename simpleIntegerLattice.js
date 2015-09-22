lat = require('./lattice.js');

//Must improve tha point
var l = new lat.Lattice(['+', '-']);
l.lift('B');
l.down('?');
l.enforceAll();


function variableDeclaration(x) {
    return this.join(x, '?');
};


function readVariable(x, v) {
    return (this.join(v, this.getParentValue(x)));
};

function writeVariable(x, v, jstype) {
    if (jstype == 'Literal') {
        var val = signOfLiteral(v);
        return this.join(x, val);
    } else { //'Identifier'
        var v_id = this.getParentValue(v);
        return this.join(x, v_id);
    }
};


function signOfLiteral(lit) {
    var num = parseInt(lit);
    if (!isNaN(num)) {
        if (num >= 0) {
            return '+'
        } else return '-';
    } else return 'B';
}

function operation(op) {
    if (op.arity == 'unary') {
        if (op.xjstype == 'Literal') {
            var val = signOfLiteral(op.x);
            return this.join(v, val);
        } else { //'Identifier'
            var v_id = this.getParentValue(op.x);
            return this.join(v, v_id);
        }
    } else { //'binary'
        var l, r;
        if (op.xjstype == 'Literal') {
            l = signOfLiteral(op.x);
        } else l = this.getParentValue(op.x);
        if (op.yjstype == 'Literal') {
            r = signOfLiteral(op.y);
        } else r = this.getParentValue(op.y);
        return this.join(op.r, elementExpression(l, r, op.operator));
    };
};


function elementExpression(l, r, op) {
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
    return '?';
};



module.exports.l = l;
module.exports.variableDeclaration = variableDeclaration;
module.exports.readVariable = readVariable;
module.exports.writeVariable = writeVariable;
module.exports.operation = operation;
