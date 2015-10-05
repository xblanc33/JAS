var fs = require('fs');

path = './graph.gv';

//create all.js
if (fs.exists(path)) fs.unlinkSync(path);
var f = fs.openSync(path, 'w+');


function print(states) {

    fs.appendFileSync(path, 'digraph G {');
    fs.appendFileSync(path, '\n');

    for (var i = 0; i < states.length; i++) {
    	fs.appendFileSync(path, states[i].sid+'_'+states[i].name+';');
    	fs.appendFileSync(path, '\n');
        if (states[i].parents.length) {
            for (var j = 0; j < states[i].parents.length; j++) {
                var link = states[i].parents[j].sid+'_'+states[i].parents[j].name +' -> ' + states[i].sid + '_'+ states[i].name +   ' ; ';
                fs.appendFileSync(path, link);
                fs.appendFileSync(path, '\n');

            };
        };
    };

    fs.appendFileSync(path, '}');
    fs.appendFileSync(path, '\n');


};


module.exports.print = print;
