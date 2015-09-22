var esprima = require('esprima');
var fs = require('fs');

var fileName = process.argv[2];


var abst = {};
var tmp_var_id = 0;

//main function
//parse a JS file and returns an abstraction (not a complete CFG)
module.exports.rewriteJS = rewriteJS;


function rewriteJS(fileName) {
    //Parse all.js
    var data = fs.readFileSync(fileName, 'utf-8');
    //console.log(data);
    var ast = esprima.parse(data, {
        loc: true
    });

    //init variables
    abst = {};
    tmp_var_id = 0;


    visitNode(ast, abst);

    return abst;

};



function visitNode(node, abst) {
    switch (node.type) {
        case 'Program':
            visitProgram(node, abst);
            break;
        case 'VariableDeclaration':
            visitVariableDeclaration(node, abst);
            break;
        case 'ExpressionStatement':
            visitExpressionStatement(node, abst);
            break;
        case 'IfStatement':
            visitIfStatement(node, abst);
            break;
        case 'WhileStatement':
            visitWhileStatement(node, abst);
            break;
        case 'ForStatement':
            visitForStatement(node, abst);
            break;
        case 'FunctionDeclaration':
            visitFunctionDeclaration(node, abst);
            break;
        default:
            break;
    };

};

function visitProgram(node, abst) {
    abst.instructions = [];
    for (var i = 0; i < node.body.length; i++) {
        visitNode(node.body[i], abst);
    };
};

function visitVariableDeclaration(node, abst) {
    for (var i = 0; i < node.declarations.length; i++) {
        var decl = {};
        decl.type = 'declare-variable';
        decl.x = node.declarations[i].id.name;
        abst.instructions.push(decl);
        if (node.declarations[i].init) visitVariableInit(node.declarations[i], abst);
    };
};


function visitVariableInit(node, abst) {

    var write = {};
    write.type = 'write-variable';
    write.x = node.id.name;

    switch (node.init.type) {
        case 'Literal':
            write.v = node.init.value;
            write.jstype = 'Literal';
            break;
        case 'Identifier':
            var read = {};
            read.type = 'read-variable';
            read.x = node.init.name;
            read.v = '__v_' + tmp_var_id;
            tmp_var_id++;
            abst.instructions.push(read);
            write.v = read.v;
            write.jstype = 'Identifier';
            break;
        case 'BinaryExpression':
            visitBinaryExpression(node.init, abst);
            write.v = abst.instructions[abst.instructions.length - 1].r;
            write.jstype = 'Identifier';
            break;
        case 'UnaryExpression':
            visitUnaryExpression(node.init, abst);
            write.v = abst.instructions[abst.instructions.length - 1].r;
            write.jstype = 'Identifier';
            break;
        default:
            break;

    };
    abst.instructions.push(write);
};



function visitBinaryExpression(node, abst) {
    var op = {};
    op.type = 'operation';
    op.operator = node.operator;
    op.arity = 'binary';

    switch (node.left.type) {
        case 'Literal':
            op.x = node.left.value;
            op.xjstype = 'Literal';
            break;
        case 'Identifier':
            var read = {};
            read.type = 'read-variable';
            read.x = node.left.name;
            read.v = '__v_' + tmp_var_id;
            tmp_var_id++;
            abst.instructions.push(read);
            op.x = read.v;
            op.xjstype = 'Identifier';
            break;
        case 'BinaryExpression':
            visitBinaryExpression(node.left, abst);
            op.x = abst.instructions[abst.instructions.length - 1].r;
            op.xjstype = 'Identifier';
            break;
        case 'UnaryExpression':
            visitUnaryExpression(node.left, abst);
            op.x = abst.instructions[abst.instructions.length - 1].r;
            op.xjstype = 'Identifier';
            break;
        default:
            break;
    };

    switch (node.right.type) {
        case 'Literal':
            op.y = node.right.value;
            op.yjstype = 'Literal';
            break;
        case 'Identifier':
            var read = {};
            read.type = 'read-variable';
            read.x = node.right.name;
            read.v = '__v_' + tmp_var_id;
            tmp_var_id++;
            abst.instructions.push(read);
            op.y = read.v;
            op.yjstype = 'Identifier';
            break;
        case 'BinaryExpression':
            visitBinaryExpression(node.right, abst);
            op.y = abst.instructions[abst.instructions.length - 1].r;
            op.yjstype = 'Identifier';
            break;
        case 'UnaryExpression':
            visitUnaryExpression(node.right, abst);
            op.y = abst.instructions[abst.instructions.length - 1].r;
            op.yjstype = 'Identifier';
            break;
        default:
            break;
    };

    op.r = '__v_' + tmp_var_id;
    tmp_var_id++;
    abst.instructions.push(op);
};

function visitUnaryExpression(node, abst) {
    var op = {};
    op.type = 'operation';
    op.arity = 'unary';
    op.operator = node.operator;


    switch (node.argument) {
        case 'Literal':
            op.x = node.argument.value;
            op.xjstype = 'Literal';
            break;
        case 'Identifier':
            var read = {};
            read.type = 'read-variable';
            read.x = node.argument.name;
            read.v = '__v_' + tmp_var_id;
            tmp_var_id++;
            abst.instructions.push(read);
            op.x = read.v;
            op.xjstype = 'Identifier';
            break;
        case 'BinaryExpression':
            visitBinaryExpression(node.argument, abst);
            op.x = abst.instructions[abst.instructions.length - 1].r;
            op.xjstype = 'Identifier';
            break;
        case 'UnaryExpression':
            visitUnaryExpression(node.argument, abst);
            op.x = abst.instructions[abst.instructions.length - 1].r;
            op.xjstype = 'Identifier';
            break;

        default:
            break;
    };



    op.r = '__v_' + tmp_var_id;
    tmp_var_id++;
    abst.instructions.push(op);
};


function visitExpressionStatement(node, abst) {
    switch (node.expression.type) {
        case 'AssignmentExpression':
            var write = {};
            write.type = 'write-variable';
            write.x = node.expression.left.name;

            switch (node.expression.right.type) {
                case 'Literal':
                    write.v = node.expression.right.value;
                    write.jstype = 'Literal';
                    break;
                case 'Identifier':
                    var read = {};
                    read.type = 'read-variable';
                    read.x = node.expression.right.name;
                    read.v = '__v_' + tmp_var_id;
                    tmp_var_id++;
                    abst.instructions.push(read);
                    write.v = read.v;
                    write.jstype = "Identifier";
                    break;
                case 'BinaryExpression':
                    visitBinaryExpression(node.expression.right, abst);
                    write.v = abst.instructions[abst.instructions.length - 1].r;
                    write.jstype = "Identifier";
                    break;
                case 'UnaryExpression':
                    visitUnaryExpression(node.expression.right, abst);
                    write.v = abst.instructions[abst.instructions.length - 1].r;
                    write.jstype = "Identifier";
                    break;
                default:
                    break;

            };
            abst.instructions.push(write);
            break;
        default:
            break;
    };
};


function visitTest(node, abst) {
    switch (node.type) {
        case 'Identifier':
            var read = {};
            read.type = 'read-variable';
            read.x = node.name;
            read.v = '__v_' + tmp_var_id;
            tmp_var_id++;
            abst.instructions.push(read);
            break;
        case 'BinaryExpression':
            visitBinaryExpression(node, abst);
            break;
        case 'UnaryExpression':
            visitUnaryExpression(node, abst);
            break;
        default:
            break;

    };
};


function visitIfStatement(node, abst) {
    var ifi = {};
    ifi.type = 'if';

    //test
    ifi.test = {};
    ifi.test.instructions = [];
    visitTest(node.test, ifi.test);

    //consequent
    ifi.consequent = {};
    ifi.consequent.instructions = [];
    switch (node.consequent.type) {
        case 'ExpressionStatement':
            visitExpressionStatement(node.consequent, ifi.consequent);
            break;
        case 'BlockStatement':
            for (var i = 0; i < node.consequent.body.length; i++) {
                visitNode(node.consequent.body[i], ifi.consequent);
            };
            break;
    };

    //alternate
    if (node.alternate) {
        ifi.alternate = {};
        ifi.alternate.instructions = [];
        switch (node.alternate.type) {
            case 'ExpressionStatement':
                visitExpressionStatement(node.alternate, ifi.alternate);
                break;
            case 'BlockStatement':
                for (var i = 0; i < node.alternate.body.length; i++) {
                    visitNode(node.alternate.body[i], ifi.alternate);
                };
                break;
        };
    };

    abst.instructions.push(ifi);

};


function visitWhileStatement(node, abst) {
    var we = {};
    we.type = 'while';

    //test
    we.test = {};
    we.test.instructions = [];
    visitTest(node.test, we.test);

    //body
    we.body = {};
    we.body.instructions = [];
    if (node.body.type === 'BlockStatement') {
        for (var i = 0; i < node.body.body.length; i++) {
            visitNode(node.body.body[i], we.body);
        };
    } else visitNode(node.body, we.body);
    abst.instructions.push(we);

};


function visitForStatement(node, abst) {
    var fo = {};
    fo.type = 'for';
    fo.body = {};
    fo.body.instructions = [];
    if (node.body.type === 'BlockStatement') {
        for (var i = 0; i < node.body.body.length; i++) {
            visitNode(node.body.body[i], fo.body);
        };
    } else visitNode(node.body, fo.body);
    abst.instructions.push(fo);

};

function visitFunctionDeclaration(node, abst) {
    var fun = {};
    fun.type = 'function';
    fun.body = {};
    fun.body.instructions = [];
    if (node.body.type === 'BlockStatement') {
        for (var i = 0; i < node.body.body.length; i++) {
            visitNode(node.body.body[i], fun.body);
        };
    } else visitNode(node.body, fun.body);
    abst.instructions.push(fun);
};
