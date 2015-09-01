var estraverse = require('estraverse');
var esprima = require('esprima');
var fs = require('fs');
var lat = require('./lattice.js');
var state = require('./state.js');



var fileName = process.argv[2];


//Parse all.js
var data = fs.readFileSync(fileName, 'utf-8');
//console.log(data);
var ast = esprima.parse(data, {
    loc: true
});
//console.log(JSON.stringify(ast, null, 4))


l = new lat.Lattice(['+', '-']);
l.lift('B');
l.down('?');
l.enforceAll();
console.log(l.elements);

var states = [];
var lastState;
//traverse
estraverse.traverse(ast, {
    enter: function(node, parent) {
        switch (node.type) {
            case 'Program':
                console.log('start program analysis');
                break;

        }
    },
    leave: function(node, parent) {
        switch (node.type) {
            case 'Program':
                console.log('end program analysis');
                fixedPoint();
                break;
            case 'VariableDeclarator':
                variableDeclaration(node);
                break;
            case 'ExpressionStatement':
                expressionStatement(node);
                break;
        }

    }
});

function expressionStatement(node) {
    if (node.expression.operator === '=') { //otherwize, I don't know how it works
        if (node.expression.left.type === 'Identifier') { //otherwize, I don't know how it works
            var v = node.expression.left.name;
            switch (node.expression.right.type) {
                case 'Literal':
                    var lit = node.expression.right.value;
                    var ns = new state.State(states.length, l);
                    if (lastState) ns.parents.push(lastState);
                    lastState = ns;
                    ns.f = function() {
                        console.log('f applied to ' + this.id);
                        return state.variableAffectationLiteral.apply(this, [v, lit]);
                    };
                    states.push(ns);
                    break;
                case 'Identifier':
                    var id = node.expression.right.name;
                    var ns = new state.State(states.length, l);
                    if (lastState) ns.parents.push(lastState);
                    lastState = ns;
                    ns.f = function() {
                        console.log('f applied to ' + this.id);
                        return state.variableAffectationIdentifier.apply(this, [v, id]);
                    };
                    states.push(ns);
                    break;
                case 'BinaryExpression':
                    var ns = new state.State(states.length, l);
                    if (lastState) ns.parents.push(lastState);
                    lastState = ns;
                    ns.f = function() {
                        var exp = {};
                        exp.l = node.expression.right.left.name;
                        exp.r = node.expression.right.right.name;
                        exp.op = node.expression.right.operator;
                        console.log('f applied to ' + this.id);
                        return state.variableAffectationExpression.apply(this, ['a', exp]);
                    };
                    states.push(ns);
                    break;
            };
        };
    };
};

function variableDeclaration(node) {

    var ns = new state.State(states.length, l);
    if (lastState) ns.parents.push(lastState);
    lastState = ns;

    ns.f = function() {
        console.log('f applied to ' + this.id);
        return state.variableDeclaration.apply(this, [node.id.name]);
    };
    states.push(ns);

};


function fixedPoint() {
    console.log('Fixed point');
    var fixed = false;
    var start = 0;
    var next_start = 0;
    while (!fixed) {
        fixed = true;
        for (var i = 0; i < states.length; i++) {
            var j = (i + start) % states.length;
            if (states[j].applyF()) {
                next_start = i;
                fixed = false;
            };
        };
        start = next_start + 1;
    };
}
