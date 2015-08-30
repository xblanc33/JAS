function State(i) {
	this.v= []; //set of variable -> Lattice
	this.f; //function to exec that should modify v and return true if changed
	this.parents = []; //set of parent node
	//this.children = []; //set of children node
	this.id=i;//could be line number

	
	this.addParent = function (s) {
		this.parents.push(s);
	};

	//this.addChild = function(c) {
	//	children.push(c);
	//};
	this.getParent = function () {
		return this.parents;
	}

	this.setF = function(fu) {
		this.f = fu;
	};

	this.applyF = function() {
		var that=this;
		return this.f.apply(that,[]);
	};

};

module.exports.State = State;