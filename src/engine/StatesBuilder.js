var state = require('./State.js');
//this function build a set of states from an abstraction
function build(abst) {
    var graph = new state.Graph();
    for (var i = 0; i < abst.instructions.length; i++) {
        buildInstruction(abst.instructions[i], graph);
    };
    return graph;
};

function buildInstruction(inst, graph) {
    var st = new state.State(inst);
    if (typeof graph.getFirst() === "undefined") {
    	graph.setFirst(st);
    } else {
    	st.addParent(graph.getLast());
    };
    graph.addLastState(st);

    switch (inst.type) {
        case "function-declaration":
        case "function-expression":
            var fgraph = build(inst.getBody());
            st.body = fgraph;
            graph.addStates(fgraph.getStates());
            break;
        case "if":
            var st_fi = new state.State(inst);
            if (inst.getConsequent()) {
                var consGraph = build(inst.getConsequent());
                graph.addStates(consGraph.getStates());
                consGraph.getFirst().addParent(st);
                st_fi.addParent(consGraph.getLast());

            };
            if (inst.getAlternate()) {
                var altGraph = build(inst.getAlternate());
                graph.addStates(altGraph.getStates());
                altGraph.getFirst().addParent(st);
                st_fi.addParent(altGraph.getLast());
            } else { //no consequent
            	st_fi.addParent(st);

            };
            graph.addState(st_fi);
            graph.setLast(st_fi);
            break;
    };
};


module.exports.build = build;
