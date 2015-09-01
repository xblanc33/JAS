function State(i, l) {
    this.lattice = l;
    this.map = {}; //set of variable -> Lattice
    this.f; //function to exec that should modify v and return true if changed
    this.parents = []; //set of parent node
    //this.children = []; //set of children node
    this.id = i; //could be line number




    this.applyF = function() {
        var that = this;
        return this.f.apply(that, []);
    };

    this.join = function(k, v) {
        //gather all variables from parents
        var parents_map = {};
        for (var i = 0; i < this.parents.length; i++) {
        	for (pk in this.parents[i].map) {
            	if (!parents_map.hasOwnProperty(pk)) parents_map[pk]=[];
            	parents_map[pk].push(this.parents[i].map[pk]);
            };
        };

        //join all properties but k
        var changed = false;
        for (pk in parents_map) {
        	if (pk !== k) {
        		if (this.map[pk]) parents_map[pk].push(this.map[pk]);//include the state mapping 
        		var pv = this.lattice.getLeastUpper(parents_map[pk])[0];
        		if (!this.map[pk] || (pv != this.map[pk])) {
        			this.map[pk] = pv;
        			console.log('now ' + pk + ' is ' + pv);
        			changed = true;
        		};
        	};
        };

        if (v != this.map[k]) {
        	this.map[k] = v;
        	console.log('now ' + k + ' is ' + v);
        	changed = true;

        };

        if (!changed) console.log('no change');

        return changed;

    };

};

module.exports.State = State;
