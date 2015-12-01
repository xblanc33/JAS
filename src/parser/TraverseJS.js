var fact = require('./InstructionFactory.js');

var id = 0;

function createAbst(node) {
    var abst = {};
    abst.instructions = [];
    node.abst = abst;
};

//this module contains the functions used by estrave to build instuction
module.exports.enterProgram = function(node, parent) {};

module.exports.leaveProgram = function(node, parent) {
    var programAbst = {};
    programAbst.instructions = [];
    for (var i = 0; i < node.body.length; i++) {
        var bodyElement = node.body[i];
        if (bodyElement.abst) {
            for (var j = 0; j < bodyElement.abst.instructions.length; j++) {
                programAbst.instructions.push(bodyElement.abst.instructions[j]);
            };
        };
    };
    return programAbst;
};

module.exports.enterVariableDeclarator = function(node, parent) {
    createAbst(node);
    node.abst.instructions.push(fact.createDeclareVariable(node.id.name));
};

module.exports.leaveVariableDeclarator = function(node, parent) {
    //nothing to do here
    if (node.init) {
        switch (node.init.type) {
            case 'Literal':
                node.abst.instructions.push(fact.createWriteVariable(node.id.name, node.init.value, 'Literal'));
                break;
            case 'Identifier':
                node.abst.instructions.push(fact.createWriteVariable(node.id.name, node.init.name, 'Identifier'));
                break;
            case 'UnaryExpression':
            case 'BinaryExpression':
            case 'FunctionExpression':
            case 'MemberExpression':
                for (var i = 0; i < node.init.abst.instructions.length; i++) {
                    node.abst.instructions.push(node.init.abst.instructions[i]);
                };
                node.abst.instructions.push(fact.createWriteVariable(node.id.name, node.init.res, 'TempIdentifier'));
                break;

        };
    };
};


module.exports.enterVariableDeclaration = function(node, parent) {
    createAbst(node);
};

module.exports.leaveVariableDeclaration = function(node, parent) {
    for (var i = 0; i < node.declarations.length; i++) {
        var declaration = node.declarations[i];
        for (var j = 0; j < declaration.abst.instructions.length; j++) {
            node.abst.instructions.push(declaration.abst.instructions[j]);
        };
    };
};

module.exports.enterUnaryExpression = function(node, parent) {
    createAbst(node);
    node.res = '__v_' + id;
    id++;
};

module.exports.leaveUnaryExpression = function(node, parent) {
    var op = node.operator;
    var x, xtype;
    var res = node.res;

    switch (node.argument.type) {
        case 'Literal':
            x = node.argument.value;
            xtype = 'Literal';
            break;
        case 'Identifier':
            x = node.argument.name;
            xtype = 'Identifier';
            break;
        case 'UnaryExpression':
        case 'BinaryExpression':
        case 'FunctionExpression':
        case 'MemberExpression':
            if (node.argument.abst) {
                for (var i = 0; i < node.argument.abst.instructions.length; i++) {
                    node.abst.instructions.push(node.argument.abst.instructions[i]);
                };
            };
            x = node.argument.res;
            xtype = 'TempIdentifier'
            break;
    }

    node.abst.instructions.push(fact.createUnaryOperation(op, x, xtype, res));
};



module.exports.enterBinaryExpression = function(node, parent) {
    createAbst(node);
    node.res = '__v_' + id;
    id++;
};

module.exports.leaveBinaryExpression = function(node, parent) {
    var op = node.operator;
    var x, xtype, y, ytype;
    var res = node.res;

    switch (node.left.type) {
        case 'Literal':
            x = node.left.value;
            xtype = 'Literal';
            break;
        case 'Identifier':
            x = node.left.name;
            xtype = 'Identifier';
            break;
        case 'UnaryExpression':
        case 'BinaryExpression':
        case 'FunctionExpression':
        case 'MemberExpression':
            if (node.left.abst) {
                for (var i = 0; i < node.left.abst.instructions.length; i++) {
                    node.abst.instructions.push(node.left.abst.instructions[i]);
                };
            };
            x = node.left.res;
            xtype = 'TempIdentifier'
            break;
    }

    switch (node.right.type) {
        case 'Literal':
            y = node.right.value;
            ytype = 'Literal';
            break;
        case 'Identifier':
            y = node.right.name;
            ytype = 'Identifier';
            break;
        case 'UnaryExpression':
        case 'BinaryExpression':
        case 'FunctionExpression':
        case 'MemberExpression':
            if (node.right.abst) {
                for (var i = 0; i < node.right.abst.instructions.length; i++) {
                    node.abst.instructions.push(node.right.abst.instructions[i]);
                };
            };
            y = node.right.res;
            ytype = 'TempIdentifier'
            break;
    }

    node.abst.instructions.push(fact.createBinaryOperation(op, x, xtype, y, ytype, res));
};


module.exports.enterUpdateExpression = function(node, parent) {
    createAbst(node);
    node.res = '__v_' + id;
    id++;
    return abst;
};

module.exports.leaveUpdateExpression = function(node, parent) {
    var op = node.operator;
    var x, xtype;
    var res = node.res;

    switch (node.argument.type) {
        case 'Literal':
            x = node.argument.value;
            xtype = 'Literal';
            break;
        case 'Identifier':
            x = node.argument.name;
            xtype = 'Identifier';
            break;
        case 'UnaryExpression':
        case 'BinaryExpression':
        case 'FunctionExpression':
        case 'MemberExpression':
            if (node.argument.abst) {
                for (var i = 0; i < node.argument.abst.instructions.length; i++) {
                    node.abst.instructions.push(node.argument.abst.instructions[i]);
                };
            };
            x = node.argument.res;
            xtype = 'TempIdentifier'
            break;
    }

    node.abst.instructions.push(fact.createUnaryOperation(op, x, xtype, res));
};


module.exports.enterMemberExpression = function(node, parent) {
    createAbst(node);
    node.res = '__v_' + id;
    id++;
};

module.exports.leaveMemberExpression = function(node, parent) {
    var o;
    var p;
    var res = node.res;

    switch (node.object.type) {
        case 'Identifier':
            o = node.object.name;
            xtype = 'Identifier';
            break;
        case 'UnaryExpression':
        case 'BinaryExpression':
        case 'FunctionExpression':
        case 'MemberExpression':
            if (node.object.abst) {
                for (var i = 0; i < node.object.abst.instructions.length; i++) {
                    node.abst.instructions.push(node.object.abst.instructions[i]);
                };
            };
            o = node.object.res;
            break;
    }

    switch (node.property.type) {
        case 'Identifier':
            p = node.property.name;
            xtype = 'Identifier';
            break;
        case 'UnaryExpression':
        case 'BinaryExpression':
        case 'FunctionExpression':
        case 'MemberExpression':
            if (node.property.abst) {
                for (var i = 0; i < node.property.abst.instructions.length; i++) {
                    node.abst.instructions.push(node.right.abst.instructions[i]);
                };
            };
            p = node.property.res;
            break;
    }

    node.o = o;
    node.p = p;

    node.abst.instructions.push(fact.createReadProperty(o, p, res));
};



module.exports.enterExpressionStatement = function(node, parent) {
    createAbst(node);
};

module.exports.leaveExpressionStatement = function(node, parent) {
    if (node.expression.abst) {
        for (var i = 0; i < node.expression.abst.instructions.length; i++) {
            node.abst.instructions.push(node.expression.abst.instructions[i]);
        };
    };
};


module.exports.enterAssignmentExpression = function(node, parent) {
    createAbst(node);
};

module.exports.leaveAssignmentExpression = function(node, parent) {

    //if property
    if (node.left.type === 'Identifier') {
        var v = node.left.name;
        var val;
        var valtype;


        switch (node.right.type) {
            case 'Literal':
                val = node.right.value;
                valtype = 'Literal';
                break;
            case 'Identifier':
                val = node.right.name;
                valtype = 'Identifier';
                break;
            case 'UnaryExpression':
            case 'BinaryExpression':
            case 'FunctionExpression':
            case 'MemberExpression':
                if (node.right.abst) {
                    for (var i = 0; i < node.right.abst.instructions.length; i++) {
                        node.abst.instructions.push(node.right.abst.instructions[i]);
                    };
                };
                val = node.right.res;
                valtype = 'TempIdentifier'
                break;
        }

        node.abst.instructions.push(fact.createWriteVariable(v, val, valtype));

    } else if (node.left.type === 'MemberExpression') {
        var o = node.left.o;
        var p = node.left.p;
        var v;
        var vtype;


        switch (node.right.type) {
            case 'Literal':
                v = node.right.value;
                vtype = 'Literal';
                break;
            case 'Identifier':
                v = node.right.name;
                vtype = 'Identifier';
                break;
            case 'UnaryExpression':
            case 'BinaryExpression':
            case 'FunctionExpression':
            case 'MemberExpression':
                if (node.right.abst) {
                    for (var i = 0; i < node.right.abst.instructions.length; i++) {
                        node.abst.instructions.push(node.right.abst.instructions[i]);
                    };
                };
                v = node.right.res;
                vtype = 'TempIdentifier'
                break;
        }
        node.abst.instructions.push(fact.createWriteProperty(o, p, v, vtype));

    };
};



module.exports.enterCallExpression = function(node, parent) {
    createAbst(node);
};

module.exports.leaveCallExpression = function(node, parent) {
    var arguments = [];
    var currentArgument;
    if (node.arguments) {
        for (var i = 0; i < node.arguments.length; i++) {
            currentArgument = node.arguments[i];
            switch (currentArgument.type) {
                case 'Literal':
                    arguments.push({
                        arg: currentArgument.value,
                        argType: 'Literal'
                    });
                    break;
                case 'Identifier':
                    arguments.push({
                        arg: currentArgument.name,
                        argType: 'Identifier'
                    });
                    break;
                case 'UnaryExpression':
                case 'BinaryExpression':
                case 'FunctionExpression':
                case 'MemberExpression':
                    if (currentArgument.abst) {
                        for (var i = 0; i < currentArgument.abst.instructions.length; i++) {
                            node.abst.instructions.push(currentArgument.abst.instructions[i]);
                        };
                    };
                    arguments.push({
                        arg: currentArgument.res,
                        argType: 'TempIdentifier'
                    });
                    break;
            };
        };
    };

    switch (node.callee.type) {
        case 'Identifier': //function call
            var callee = node.callee.name;
            node.abst.instructions.push(fact.createCallFunction(callee, arguments));
            break;
        case 'MemberExpression': //method call
            if (node.callee.abst) {
                for (var i = 0; i < node.callee.abst.instructions.length; i++) {
                    node.abst.instructions.push(node.callee.abst.instructions[i]);
                };
            };
            var callee = node.callee.p;
            var caller = node.callee.o;
            node.abst.instructions.push(fact.createCallMethod(caller, callee, arguments));
            break;
        case 'FunctionExpression': //anonymous function call
            if (node.callee.abst) {
                for (var i = 0; i < node.callee.abst.instructions.length; i++) {
                    node.abst.instructions.push(node.callee.abst.instructions[i]);
                };
            };
            var callee = node.callee.fname;
            node.abst.instructions.push(fact.createCallFunction(callee, arguments));
            break;
    };
};



module.exports.enterFunctionDeclaration = function(node, parent) {
    //create a new abst;
    createAbst(node);
};

module.exports.leaveFunctionDeclaration = function(node, parent) {
    //body
    var body = {};
    body.instructions = [];

    var fname = node.id.name;
    var params = [];
    if (node.params) {
        for (var i = 0; i < node.params.length; i++) {
            currentParam = node.params[i];
            switch (currentParam.type) {
                case 'Literal':
                    params.push({
                        param: currentParam.value,
                        paramType: 'Literal'
                    });
                    break;
                case 'Identifier':
                    params.push({
                        param: currentParam.name,
                        paramType: 'Identifier'
                    });
                    break;
                case 'UnaryExpression':
                case 'BinaryExpression':
                case 'FunctionExpression':
                case 'MemberExpression':
                    if (currentParam.abst) {
                        for (var i = 0; i < currentParam.abst.instructions.length; i++) {
                            body.instructions.push(currentParam.abst.instructions[i]);
                        };
                    };
                    params.push({
                        param: currentParam.res,
                        paramType: 'TempIdentifier'
                    });
                    break;
            };
        };
    };

    if (node.body) {
        for (var j = 0; j < node.body.abst.instructions.length; j++) {
            body.instructions.push(node.body.abst.instructions[j]);
        };
    };

    node.abst.instructions.push(fact.createFunctionDeclaration(fname, params, body));
};


module.exports.enterFunctionExpression = function(node, parent) {
    //create a new abst;
    createAbst(node);
};

module.exports.leaveFunctionExpression = function(node, parent) {
    //body
    var body = {};
    body.instructions = [];

    var fname;
    if (node.id && node.id.name) fname = node.id.name;
    else {
        fname = '__v_' + id;
        id++;
    }
    node.fname = fname;
    node.res = fname;
    var params = [];
    if (node.params) {
        for (var i = 0; i < node.params.length; i++) {
            currentParam = node.params[i];
            switch (currentParam.type) {
                case 'Literal':
                    params.push({
                        param: currentParam.value,
                        paramType: 'Literal'
                    });
                    break;
                case 'Identifier':
                    params.push({
                        param: currentParam.name,
                        paramType: 'Identifier'
                    });
                    break;
                case 'UnaryExpression':
                case 'BinaryExpression':
                case 'FunctionExpression':
                case 'MemberExpression':
                    if (currentParam.abst) {
                        for (var i = 0; i < currentParam.abst.instructions.length; i++) {
                            body.instructions.push(currentParam.abst.instructions[i]);
                        };
                    };
                    params.push({
                        param: currentParam.res,
                        paramType: 'TempIdentifier'
                    });
                    break;
            };
        };
    };

    if (node.body.abst) {
        for (var j = 0; j < node.body.abst.instructions.length; j++) {
            body.instructions.push(node.body.abst.instructions[j]);
        };
    };

    node.abst.instructions.push(fact.createFunctionExpression(fname, params, body));
};


module.exports.enterBlockStatement = function(node, parent) {
    //create a new abst;
    createAbst(node);
};

module.exports.leaveBlockStatement = function(node, parent) {
    for (var i = 0; i < node.body.length; i++) {
        var bodyElement = node.body[i];
        for (var j = 0; j < bodyElement.abst.instructions.length; j++) {
            node.abst.instructions.push(bodyElement.abst.instructions[j]);
        };
    }
};



module.exports.enterIfStatement = function(node, parent) {
    //create a new abst;
    createAbst(node);
};

module.exports.leaveIfStatement = function(node, parent) {
    //test
    var test;
    var testType
    switch (node.test.type) {
        case 'Literal':
            test = node.test.value;
            testType = 'Literal';
            break;
        case 'Identifier':
            test = node.test.name;
            testType = 'Identifier';
            break;
        case 'UnaryExpression':
        case 'BinaryExpression':
        case 'FunctionExpression':
        case 'MemberExpression':
            if (node.test.abst) {
                for (var i = 0; i < node.test.abst.instructions.length; i++) {
                    node.abst.instructions.push(node.test.abst.instructions[i]);
                };
            };
            test = node.test.res;
            testType = 'TempIdentifier';
            break;
    };

    node.abst.instructions.push(fact.createIf(test, testType, node.consequent.abst, node.alternate ? node.alternate.abst : undefined));

};
