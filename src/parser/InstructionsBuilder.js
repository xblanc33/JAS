//load required modules
var esprima = require('esprima');
var estraverse = require('estraverse');
var traverseJS = require('./TraverseJS.js');


module.exports.build = function(data) {
    //build the ast
    var ast = esprima.parse(data, {
        loc: true
    });


    //the abstraction that will contain all instructions
    var abst = {}

    //traverse the ast
    estraverse.traverse(ast, {
        enter: enterNode,
        leave: leaveNode
    });

    return abst;


    function enterNode(node, parent) {
        switch (node.type) {
            case 'Program':
                traverseJS.enterProgram(node, parent);
                break;
            case 'VariableDeclaration':
                traverseJS.enterVariableDeclaration(node, parent);
                break;
            case 'VariableDeclarator':
                traverseJS.enterVariableDeclarator(node, parent);
                break;
            case 'UnaryExpression':
                traverseJS.enterUnaryExpression(node, parent);
                break;
            case 'BinaryExpression':
                traverseJS.enterBinaryExpression(node, parent);
                break;
            case 'UpdateExpression':
                traverseJS.enterUpdateExpression(node, parent);
                break;
            case 'MemberExpression':
                traverseJS.enterMemberExpression(node, parent, abst);
                break;
            case 'ExpressionStatement':
                traverseJS.enterExpressionStatement(node, parent);
                break;
            case 'AssignmentExpression':
                traverseJS.enterAssignmentExpression(node, parent);
                break;
            case 'CallExpression':
                traverseJS.enterCallExpression(node, parent);
                break;
            case 'FunctionExpression':
                traverseJS.enterFunctionExpression(node, parent);
                break;
            case 'FunctionDeclaration':
                traverseJS.enterFunctionDeclaration(node, parent);
                break;
            case 'BlockStatement':
                traverseJS.enterBlockStatement(node, parent);
                break;
            case 'IfStatement':
                traverseJS.enterIfStatement(node, parent);
                break;
        };
    };

    function leaveNode(node, parent) {
        switch (node.type) {
            case 'Program':
                abst = traverseJS.leaveProgram(node, parent);
                break;
            case 'VariableDeclaration':
                traverseJS.leaveVariableDeclaration(node, parent);
                break;
            case 'VariableDeclarator':
                traverseJS.leaveVariableDeclarator(node, parent);
                break;
            case 'UnaryExpression':
                traverseJS.leaveUnaryExpression(node, parent);
                break;
            case 'BinaryExpression':
                traverseJS.leaveBinaryExpression(node, parent);
                break;
            case 'UpdateExpression':
                traverseJS.leaveUpdateExpression(node, parent);
                break;
            case 'MemberExpression':
                traverseJS.leaveMemberExpression(node, parent, abst);
                break;
            case 'ExpressionStatement':
                traverseJS.leaveExpressionStatement(node, parent);
                break;
            case 'AssignmentExpression':
                traverseJS.leaveAssignmentExpression(node, parent);
                break;
            case 'CallExpression':
                traverseJS.leaveCallExpression(node, parent);
                break;
            case 'FunctionExpression':
                traverseJS.leaveFunctionExpression(node, parent);
                break;
            case 'FunctionDeclaration':
                traverseJS.leaveFunctionDeclaration(node, parent);
                break;
            case 'BlockStatement':
                traverseJS.leaveBlockStatement(node, parent);
                break;
            case 'IfStatement':
                traverseJS.leaveIfStatement(node, parent);
                break;
        };
    };

};

module.exports.prettyPrint = function(abst) {
    for (var i = 0; i < abst.instructions.length; i++) {
        console.log(abst.instructions[i].prettyPrint());
    };
};
