//read the variable v, and put the read value in val
module.exports.createDeclareVariable = function(v) {
    var inst = {};
    inst.type = "declare-variable";
    inst.v = v;
    inst.getType = getType;
    inst.getVariable = getVariable;

    inst.prettyPrint = function() {
        return this.type + " " + this.v;
    };
    return inst;

};

//read the variable v, and put the read value in val
module.exports.createReadVariable = function(v, val) {

};

//write the value val, in the variable v
module.exports.createWriteVariable = function(v, val, valtype) {
    var inst = {};
    inst.type = "write-variable";
    inst.v = v;
    inst.val = val;
    inst.valtype = valtype;
    inst.getType = getType;
    inst.getVariable = getVariable;
    inst.getValue = getValue;
    inst.getValueType = getValueType;

    inst.prettyPrint = function() {
        return this.type + " " + this.v + ", value=" + this.val + ", valueType=" + this.valtype;
    };
    return inst;
};


//apply the unary operation op, on the variable x, of type xtype
module.exports.createUnaryOperation = function(op, x, xtype, res) {
    var inst = {};
    inst.type = "operation";
    inst.arity = "unary";
    inst.operator = op;
    inst.x = x;
    inst.xtype = xtype;
    inst.res = res;

    inst.getType = getType;
    inst.getArity = getArity;
    inst.getX = getX;
    inst.getXType = getXType;
    inst.getRes = getRes;

    inst.prettyPrint = function() {
        return this.type + " " + this.arity + " " + this.x + "(" + this.xtype + ") " + this.operator + " = " + this.res;
    };

    return inst;
};

//apply the binary operation op, on the variables x and y, of type xtype and ytype
module.exports.createBinaryOperation = function(op, x, xtype, y, ytype, res) {
    var inst = {};
    inst.type = "operation";
    inst.arity = "binary";
    inst.operator = op;
    inst.x = x;
    inst.xtype = xtype;
    inst.y = y;
    inst.ytype = ytype;
    inst.res = res;

    inst.getType = getType;
    inst.getArity = getArity;
    inst.getX = getX;
    inst.getXType = getXType;
    inst.getY = getY;
    inst.getYType = getYType;
    inst.getRes = getRes;

    inst.prettyPrint = function() {
        return this.type + " " + this.arity + " " + this.x + "(" + this.xtype + ") " + this.operator + " " + this.y + "(" + this.ytype + ") = " + this.res;
    };

    return inst;

};

//read the property p, of object o, and put it into res
module.exports.createReadProperty = function(o, p, res) {
    var inst = {};
    inst.type = "read-property";
    inst.object = o;
    inst.property = p;
    inst.res = res;

    inst.getType = getType;
    inst.getObject = getObject;
    inst.getProperty = getProperty;
    inst.getRes = getRes;

    inst.prettyPrint = function() {
        return this.type + " " + this.object + "." + this.property + "=>" + this.res;
    }

    return inst;

};

//write the value v, of type vtype, in the property p, of the object o
module.exports.createWriteProperty = function(o, p, v, vtype) {
    var inst = {};
    inst.type = "write-property";
    inst.object = o;
    inst.property = p;
    inst.val = v;
    inst.valType = vtype;

    inst.getType = getType;
    inst.getObject = getObject;
    inst.getProperty = getProperty;
    inst.getValue = getValue;
    inst.getValueType = getValueType;

    inst.prettyPrint = function() {
        return this.type + " " + this.object + "." + this.property + "=" + this.val + '(' + this.valType + ')';
    }

    return inst;

};

//call the expression
module.exports.createCallFunction = function(callee, args) {
    var inst = {};
    inst.type = "call-function";
    inst.callee = callee;
    inst.args = args;

    inst.getType = getType;
    inst.getCallee = getCallee;
    inst.getArguments = getArguments;


    inst.prettyPrint = function() {
        var pp = this.type + " " + this.callee + "(";
        for (var i = 0; i < this.args.length; i++) {
            if (i !== 0) pp = pp + ','
            pp = pp + this.args[i].arg + '(' + this.args[i].argType + ')';
        };
        pp = pp + ')';
        return pp;
    }

    return inst;

};


//call the expression
module.exports.createCallMethod = function(caller, callee, args) {
    var inst = {};
    inst.type = "call-method";
    inst.caller = caller;
    inst.callee = callee;
    inst.args = args;

    inst.getType = getType;
    inst.getCaller = getCaller;
    inst.getCallee = getCallee;
    inst.getArguments = getArguments;


    inst.prettyPrint = function() {
        var pp = this.type + " " + this.caller + "." + this.callee + "(";
        for (var i = 0; i < this.args.length; i++) {
            if (i !== 0) pp = pp + ','
            pp = pp + this.args[i].arg + '(' + this.args[i].argType + ')';
        };
        pp = pp + ')';
        return pp;
    }

    return inst;

};


module.exports.createFunctionDeclaration = function(name, params, body) {
    //console.log(body);
    var inst = {};
    inst.type = "function-declaration";
    inst.name = name;
    inst.params = params;
    inst.body = body;

    inst.getType = getType;
    inst.getName = getName;
    inst.getParams = getParams;
    inst.getBody = getBody;

    inst.prettyPrint = function() {
        var pp = this.type + " " + this.name + "(";
        for (var i = 0; i < this.params.length; i++) {
            if (i !== 0) pp = pp + ',';
            pp = pp + this.params[i].param + '(' + this.params[i].paramType + ')';
        };
        pp = pp + ') {\n';
        for (var i = 0; i < this.body.instructions.length; i++) {
            pp = pp + '\t' + this.body.instructions[i].prettyPrint() + '\n';
        };
        pp = pp + '}';
        return pp;
    }

    return inst;

};


module.exports.createFunctionExpression = function(name, params, body) {
    var inst = {};
    inst.type = "function-expression";
    inst.name = name;
    inst.params = params;
    inst.body = body;

    inst.getType = getType;
    inst.getName = getName;
    inst.getParams = getParams;
    inst.getBody = getBody;

    inst.prettyPrint = function() {
        var pp = this.type + " " + this.name + "(";
        for (var i = 0; i < this.params.length; i++) {
            if (i !== 0) pp = pp + ',';
            pp = pp + this.params[i].param + '(' + this.params[i].paramType + ')';
        };
        pp = pp + ') {\n';
        for (var i = 0; i < this.body.instructions.length; i++) {
            pp = pp + '\t' + this.body.instructions[i].prettyPrint() + '\n';
        };
        pp = pp + '}';
        return pp;
    };

    return inst;

};

module.exports.createIf = function(test, testType, consequent, alternate) {
    var inst = {};
    inst.type = "if";
    inst.test = test;
    inst.testType = testType;
    inst.consequent = consequent;
    inst.alternate = alternate;

    inst.getType = getType;
    inst.getTest = getTest;
    inst.getTestType = getTestType;
    inst.getConsequent = getConsequent;
    inst.getAlternate = getAlternate;

    inst.prettyPrint = function() {
        var pp = this.type + "(" + this.test + "(" + this.testType + "))\n";
        pp = pp + "\tthen ";
        for (var i = 0; i < this.consequent.instructions.length; i++) {
            pp = pp + "\t" + this.consequent.instructions[i].prettyPrint()+"\n";
        };
        if (this.alternate) {
            pp = pp + "\telse ";
            for (var i = 0; i < this.alternate.instructions.length; i++) {
                pp = pp + "\t" + this.alternate.instructions[i].prettyPrint()+"\n";
            };
        };
        return pp;
    };

    return inst;
};



//common functions
function getType() {
    return this.type;
};

function getVariable() {
    return this.v;
};

function getValue() {
    return this.val;
};

function getValueType() {
    return this.valtype;
};

function getArity() {
    return this.arity;
};

function getX() {
    return this.x;
};

function getXType() {
    return this.xtype;
};

function getY() {
    return this.y;
};

function getYType() {
    return this.ytype;
};

function getRes() {
    return this.res;
};

function getObject() {
    return this.object;
};

function getProperty() {
    return this.property;
};

function getCaller() {
    return this.caller;
};

function getCallee() {
    return this.callee;
};

function getArguments() {
    return this.args;
};

function getName() {
    return this.name;
};

function getParams() {
    return this.params;
};

function getBody() {
    return this.body;
};

function getTest() {
    return this.test;
};

function getTestType() {
    return this.testType;
};

function getConsequent() {
    return this.consequent;
};

function getAlternate() {
    return this.alternate;
}
