var fs = require('fs');

module.exports.print = function (graph, path) {

    var states = graph.getStates();

    //create all.js
    if (fs.exists(path)) fs.unlinkSync(path);
    var f = fs.openSync(path, 'w+');

    fs.appendFileSync(path, 'digraph G {');
    fs.appendFileSync(path, '\n');

    for (var i = 0; i < states.length; i++) {
        fs.appendFileSync(path, 's_'+states[i].id +  '_' + states[i].inst.type.replace('-','_') + ';');
        fs.appendFileSync(path, '\n');
        if (states[i].getParents().length) {
            for (var j = 0; j < states[i].getParents().length; j++) {
                var link = 's_'+states[i].getParents()[j].id + '_' + states[i].getParents()[j].inst.type.replace('-','_') + ' -> ' + 's_'+states[i].id + '_' + states[i].inst.type.replace('-','_') + ' ; ';
                fs.appendFileSync(path, link);
                fs.appendFileSync(path, '\n');

            };
        };
    };

    fs.appendFileSync(path, '}');
    fs.appendFileSync(path, '\n');
};
