var esprima = require('esprima');
var fs = require('fs');

var fileName = process.argv[2];


//Parse all.js
var data = fs.readFileSync(fileName, 'utf-8');
//console.log(data);
var ast = esprima.parse(data, {
    loc: true
});

console.log(ast);

var abst = {};
var tmp_var_id = 0;

visitNode(ast, abst);
console.log(abst);
console.log(tmp_var_id);



function visitNode(node, abst) {
    console.log('node type:' + node.type);
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
        default:
            break;
    };

};

function visitProgram(node, abst) {
    console.log('Program');
    abst.instructions = [];
    for (var i = 0; i < node.body.length; i++) {
        visitNode(node.body[i], abst);
    };
};

function visitVariableDeclaration(node, abst) {
    console.log('VariableDeclaration');
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
            break;
        case 'Identifier':
            var read = {};
            read.type = 'read-variable';
            read.x = node.init.name;
            read.v = '__v_' + tmp_var_id;
            tmp_var_id++;
            abst.instructions.push(read);
            write.v = read.v;
            break;
        case 'BinaryExpression':
            visitBinaryExpression(node.init, abst);
            write.v = abst.instructions[abst.instructions.length - 1].r;
            break;
        case 'UnaryExpression':
            visitUnaryExpression(node.init, abst);
            write.v = abst.instructions[abst.instructions.length - 1].r;
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

    switch (node.left.type) {
        case 'Literal':
            op.x = node.left.value;
            break;
        case 'Identifier':
            var read = {};
            read.type = 'read-variable';
            read.x = node.left.name;
            read.v = '__v_' + tmp_var_id;
            tmp_var_id++;
            abst.instructions.push(read);
            op.x = read.v;
            break;
        case 'BinaryExpression':
            visitBinaryExpression(node.left, abst);
            op.x = abst.instructions[abst.instructions.length - 1].r;
            break;
        case 'UnaryExpression':
            visitUnaryExpression(node.left, abst);
            op.x = abst.instructions[abst.instructions.length - 1].r;
            break;
        default:
            break;
    };

    switch (node.right.type) {
        case 'Literal':
            op.y = node.right.value;
            break;
        case 'Identifier':
            var read = {};
            read.type = 'read-variable';
            read.x = node.right.name;
            read.v = '__v_' + tmp_var_id;
            tmp_var_id++;
            abst.instructions.push(read);
            op.y = read.v;
            break;
        case 'BinaryExpression':
            visitBinaryExpression(node.right, abst);
            op.y = abst.instructions[abst.instructions.length - 1].r;
            break;
        case 'UnaryExpression':
            visitUnaryExpression(node.right, abst);
            op.y = abst.instructions[abst.instructions.length - 1].r;
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
    op.operator = node.operator;


    switch (node.argument) {
        case 'Literal':
            op.x = node.argument.value;
            break;
        case 'Identifier':
            var read = {};
            read.type = 'read-variable';
            read.x = node.argument.name;
            read.v = '__v_' + tmp_var_id;
            tmp_var_id++;
            abst.instructions.push(read);
            op.x = read.v;
            break;
        case 'BinaryExpression':
            visitBinaryExpression(node.argument, abst);
            op.x = abst.instructions[abst.instructions.length - 1].r;
            break;
        case 'UnaryExpression':
            visitUnaryExpression(node.argument, abst);
            op.x = abst.instructions[abst.instructions.length - 1].r;
            break;

        default:
            break;
    };



    op.r = '__v_' + tmp_var_id;
    tmp_var_id++;
    abst.instructions.push(op);
};


function visitExpressionStatement(node, abst) {
    console.log('ExpressionStatement');
    switch (node.expression.type) {
        case 'AssignmentExpression':
            var write = {};
            write.type = 'write-variable';
            write.x = node.expression.left.name;

            switch (node.expression.right.type) {
                case 'Literal':
                    write.v = node.expression.right.value;
                    break;
                case 'Identifier':
                    var read = {};
                    read.type = 'read-variable';
                    read.x = node.expression.right.name;
                    read.v = '__v_' + tmp_var_id;
                    tmp_var_id++;
                    abst.instructions.push(read);
                    write.v = read.v;
                    break;
                case 'BinaryExpression':
                    visitBinaryExpression(node.expression.right, abst);
                    write.v = abst.instructions[abst.instructions.length - 1].r;
                    break;
                case 'UnaryExpression':
                    visitUnaryExpression(node.expression.right, abst);
                    write.v = abst.instructions[abst.instructions.length - 1].r;
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


function visitIfStatement(node, abst) {
    console.log('IfStatement');
    var ifi = {};
    ifi.type = 'if';


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

}