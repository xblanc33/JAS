//rewrite JS code to have something easier to parse
//the JS code is no more an AST, but a sequence of intructions (where some instructions can be sequence too)
//the main function is rewriteJS(fileName)

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
        case 'UpdateExpression':
            visitUpdateExpression(node, abst);
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
        case 'FunctionExpression':
            visitFunctionExpression(node.init, abst);
            write.v = abst.instructions[abst.instructions.length - 1].id;
            write.jstype = 'Identifier';
            break;
        case 'MemberExpression':
            visitMemberExpression(node.init, abst);
            write.v = abst.instructions[abst.instructions.length - 1].v;
            write.jstype = 'Property';
        default:
            break;

    };
    abst.instructions.push(write);
};


function visitArgument(node, abst) {
    var arg_v = {};
    switch (node.type) {
        case 'Literal': //create a new variable for the argument
            //create a new variable for the argument
            var write = {};
            write.type = 'write-variable';
            write.x = '__v_' + tmp_var_id;
            tmp_var_id++;
            write.v = node.value;
            write.jstype = 'Literal';
            arg_v.name = write.x;
            arg_v.type = 'Literal';
            abst.instructions.push(write);
            break;
        case 'Identifier': //nothing to do
            arg_v.name = node.name;
            arg_v.type = 'Identifier';
            break;
        case 'BinaryExpression': //create a new variable for the argument
            //create a new variable for the argument
            var write = {};
            write.type = 'write-variable';
            write.x = '__v_' + tmp_var_id;
            tmp_var_id++;
            visitBinaryExpression(node, abst);
            write.v = abst.instructions[abst.instructions.length - 1].r;
            write.jstype = 'Identifier';
            arg_v.name = write.x;
            arg_v.type = 'Identifier';
            abst.instructions.push(write);
            break;
        case 'UnaryExpression':
            //create a new variable for the argument
            var write = {};
            write.type = 'write-variable';
            write.x = '__v_' + tmp_var_id;
            tmp_var_id++;
            visitUnaryExpression(node, abst);
            write.v = abst.instructions[abst.instructions.length - 1].r;
            write.jstype = 'Identifier';
            arg_v.name = write.x;
            arg_v.type = 'Identifier';
            abst.instructions.push(write);
            break;
        case 'FunctionExpression':
            visitFunctionExpression(node, abst);
            arg_v.name = abst.instructions[abst.instructions.length - 1].id;
            arg_v.type = 'Identifier';
            break;
        case 'MemberExpression':
            visitMemberExpression(node.init, abst);
            arg_v.name = abst.instructions[abst.instructions.length - 1].v;
            arg_v.type = 'Property';
            break;
        default:
            break;

    };
    return arg_v;
};

function visitMemberExpression(node, abst) {
    var me = {};
    me.type = 'read-property';
    if (node.object.type === 'Identifier') {
        me.object = node.object.name;
    } else {
        visitMemberExpression(node.object, abst);
        me.object = abst.instructions[abst.instructions.length - 1].v;
    }
    me.property = node.property.name;
    me.v = '__p_' + tmp_var_id;
    tmp_var_id++;
    abst.instructions.push(me);
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
        case 'MemberExpression':
            visitMemberExpression(node.left, abst);
            op.x = abst.instructions[abst.instructions.length - 1].v;
            op.xjstype = 'Property';
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
        case 'MemberExpression':
            visitMemberExpression(node.right, abst);
            op.y = abst.instructions[abst.instructions.length - 1].v;
            op.yjstype = 'Property';
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


    switch (node.argument.type) {
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
        case 'MemberExpression':
            visitMemberExpression(node.argument, abst);
            op.x = abst.instructions[abst.instructions.length - 1].v;
            op.xjstype = 'Property';
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

            switch (node.expression.left.type) {
                case 'Identifier':
                    write.type = 'write-variable';
                    write.x = node.expression.left.name;
                    break;
                case 'MemberExpression':
                    write.type = 'write-property';
                    visitMemberExpression(node.expression.left, abst);
                    write.property = abst.instructions[abst.instructions.length - 1].v;
                    write.object = abst.instructions[abst.instructions.length - 1].property;
                    break;

            };

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
                    write.jstype = 'Identifier';
                    break;
                case 'BinaryExpression':
                    visitBinaryExpression(node.expression.right, abst);
                    write.v = abst.instructions[abst.instructions.length - 1].r;
                    write.jstype = 'Identifier';
                    break;
                case 'UnaryExpression':
                    visitUnaryExpression(node.expression.right, abst);
                    write.v = abst.instructions[abst.instructions.length - 1].r;
                    write.jstype = 'Identifier';
                    break;
                case 'FunctionExpression':
                    visitFunctionExpression(node.expression.right, abst);
                    write.v = abst.instructions[abst.instructions.length - 1].id;
                    write.jstype = 'Identifier';
                    break;
                case 'MemberExpression':
                    visitMemberExpression(node.expression.right, abst);
                    write.v = abst.instructions[abst.instructions.length - 1].v;
                    write.jstype = 'Property';
                    break;
                default:
                    break;

            };
            abst.instructions.push(write);
            break;
        case 'CallExpression':
            var call = {};
            call.type = 'call-expression';
            switch (node.expression.callee.type) {
                case 'Identifier':
                    call.callee = node.expression.callee.name;
                    break;
                case 'FunctionExpression':
                    visitFunctionExpression(node.expression.callee, abst);
                    call.callee = abst.instructions[abst.instructions.length - 1].id;
                    break;
                case 'MemberExpression':
                    visitMemberExpression(node.expression.callee, abst);
                    call.callee = abst.instructions[abst.instructions.length - 1].v;
                    break;    
            };
            if (node.expression.arguments) {
                call.args = [];
                for (var i = 0; i < node.expression.arguments.length; i++) {
                    call.args.push(visitArgument(node.expression.arguments[i], abst));
                };
            };
            abst.instructions.push(call);
            break;
        default:
            break;
    };
};


function visitUpdateExpression(node, abst) {
    if (node.argument.type == 'Identifier') {
        var read = {};
        read.type = 'read-variable';
        read.x = node.argument.name;
        read.v = '__v_' + tmp_var_id;
        tmp_var_id++;
        abst.instructions.push(read);

        var op = {};
        op.type = 'operation';
        op.operator = node.operator.substring(0, 1);
        op.arity = 'binary';
        op.x = read.v;
        op.xjstype = 'Identifier';
        op.y = 1;
        op.yjstype = 'Literal';
        op.r = '__v_' + tmp_var_id;
        tmp_var_id++;
        abst.instructions.push(op);

        var write = {};
        write.type = 'write-variable';
        write.x = node.argument.name;
        write.v = op.r;
        write.jstype = 'Identifier';
        abst.instructions.push(write);

    } else { //Literal?

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


function visitInit(node, abst) {
    switch (node.type) {
        case 'VariableDeclaration':
            visitVariableDeclaration(node, abst);
            break;
        case 'AssignmentExpression':
            var write = {};
            write.type = 'write-variable';
            write.x = node.left.name;

            switch (node.right.type) {
                case 'Literal':
                    write.v = node.right.value;
                    write.jstype = 'Literal';
                    break;
                case 'Identifier':
                    var read = {};
                    read.type = 'read-variable';
                    read.x = node.right.name;
                    read.v = '__v_' + tmp_var_id;
                    tmp_var_id++;
                    abst.instructions.push(read);
                    write.v = read.v;
                    write.jstype = "Identifier";
                    break;
                case 'BinaryExpression':
                    visitBinaryExpression(node.right, abst);
                    write.v = abst.instructions[abst.instructions.length - 1].r;
                    write.jstype = "Identifier";
                    break;
                case 'UnaryExpression':
                    visitUnaryExpression(node.right, abst);
                    write.v = abst.instructions[abst.instructions.length - 1].r;
                    write.jstype = "Identifier";
                    break;
                default:
                    break;

            };
            abst.instructions.push(write);
            break;
        case 'UnaryExpression':
            visitUnaryExpression(node, abst);
            break;
        default:
            break;

    };
};



function visitForStatement(node, abst) {
    var fo = {};
    fo.type = 'for';

    fo.init = {};
    fo.init.instructions = [];
    visitInit(node.init, fo.init);

    fo.update = {};
    fo.update.instructions = [];
    visitNode(node.update, fo.update);

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
    fun.type = 'function-declaration';
    fun.body = {};
    fun.body.instructions = [];
    fun.id = node.id.name;


    //params
    fun.params = [];
    if (node.params) {
        for (var i = 0; i < node.params.length; i++) {
            var type = node.params[i].type;
            var iden = node.params[i].name;
            if (type === 'Identifier') fun.params.push(iden);
        };
    }

    //body
    if (node.body.type === 'BlockStatement') {
        for (var i = 0; i < node.body.body.length; i++) {
            visitNode(node.body.body[i], fun.body);
        };
    } else visitNode(node.body, fun.body);
    abst.instructions.push(fun);
};

function visitFunctionExpression(node, abst) {
    var fun = {};
    fun.type = 'function-expression';
    fun.body = {};
    fun.body.instructions = [];

    fun.id = '__f_' + tmp_var_id;
    tmp_var_id++;


    //params
    fun.params = [];
    if (node.params) {
        for (var i = 0; i < node.params.length; i++) {
            var type = node.params[i].type;
            var iden = node.params[i].name;
            if (type === 'Identifier') fun.params.push(iden);
        };
    }

    if (node.body.type === 'BlockStatement') {
        for (var i = 0; i < node.body.body.length; i++) {
            visitNode(node.body.body[i], fun.body);
        };
    } else visitNode(node.body, fun.body);
    abst.instructions.push(fun);
}
