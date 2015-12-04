var nb_states = 0;

function State(inst) {
    this.id = nb_states++;
    this.inst = inst;
    this.parents = [];


};

State.prototype.addParent = function(st) {
    this.parents.push(st);
};

State.prototype.getParents = function() {
	return this.parents;
};

function Graph() {
	this.first = undefined;
	this.last = undefined;
	this.states = [];
};

Graph.prototype.getFirst = function() {
	return this.first;
};

Graph.prototype.setFirst = function(st) {
	this.first = st;
};


Graph.prototype.getLast = function() {
	return this.last;
};

Graph.prototype.setLast = function(st) {
	this.last = st;
};

Graph.prototype.addState = function(st) {
	this.states.push(st);
};

Graph.prototype.addLastState = function(st) {
	this.states.push(st);
	this.last = st;
};

Graph.prototype.getStates = function() {
	return this.states;
};

Graph.prototype.addStates = function(stats) {
	for (var i = 0; i < stats.length; i++) {
		this.states.push(stats[i]);
	};
};


module.exports.State = State;
module.exports.Graph = Graph;
