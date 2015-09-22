module.exports.State = State;

function State(i, l) {
    this.lattice = l;
    this.map = {}; //set of variable -> Lattice
    this.f; //function to exec that should modify v and return true if changed
    this.parents = []; //set of parent node
    //this.children = []; //set of children node
    this.id = i; //could be line number



    //apply the F function associated to the state
    this.applyF = function() {
        if (this.f) {
            var that = this;
            return this.f.apply(that, []);
        };
    };

    //join the values of the map lattice from parents
    //can (should) be used by f
    this.join = function(k, v) {
        //gather all variables from parents
        var parents_map = {};
        for (var i = 0; i < this.parents.length; i++) {
            for (pk in this.parents[i].map) {
                if (!parents_map.hasOwnProperty(pk)) parents_map[pk] = [];
                parents_map[pk].push(this.parents[i].map[pk]);
            };
        };

        //join all properties but k
        var changed = false;
        for (pk in parents_map) {
            if (!k || (pk !== k)) {
                if (this.map[pk]) parents_map[pk].push(this.map[pk]); //include the state mapping 
                var pv = this.lattice.getLeastUpper(parents_map[pk])[0];
                if (!this.map[pk] || (pv != this.map[pk])) {
                    this.map[pk] = pv;
                    console.log('in state '+this.id+' now ' + pk + ' is ' + pv);
                    changed = true;
                };
            };
        };

        if (k && v && (v != this.map[k])) {
            this.map[k] = v;
            console.log('in state '+this.id+' now ' + k + ' is ' + v);
            changed = true;

        };

        if (!changed) console.log('no change');

        return changed;

    };

    //get the value of k only from parent nodes
    this.getParentValue = function(k) {
        var parents_v = [];
        for (var i = 0; i < this.parents.length; i++) {
            if (this.parents[i].map[k]) parents_v.push(this.parents[i].map[k]);
        };
        if (parents_v.length === 0) return l.getBottom();
        else return this.lattice.getLeastUpper(parents_v)[0];
    };

    //get the value after a join and after F
    this.getValue = function(k) {
        return this.map[k];
    };

};
