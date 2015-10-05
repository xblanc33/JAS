module.exports.State = State;

var sid=0;

function State(name, type, inst) {
    this.parents = []; //set of parent node
    //this.children = []; //set of children node
    this.name = name;
    this.inst = inst;
    this.type = type;

    this.sid='s'+sid;
    sid++;


    //join the values of the map lattice from parents
    //can (should) be used by f
    this.joinMap = function(k, v) {
        //gather all variables from parents
        // console.log('JoinMap');
        // if (k && v) {
        //     console.log(k);
        //     console.log(v);
        // } else console.log('empty parameters');

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
                var pv = this.lattice.getLeastUpper(parents_map[pk]);
                if (!this.map[pk] || (!this.lattice.equality(pv, this.map[pk]))) {
                    this.map[pk] = pv;
                    // console.log('in state ' + this.id + ' now ' + pk + ' is ' + pv);
                    changed = true;
                };
            };
        };

        if (k && v) {
            if (this.map[k] && this.lattice.equality(v, this.map[k])) {

            } else {
                this.map[k] = v;
                // console.log('in state ' + this.id + ' now ' + k + ' is ' + v);
                changed = true;
            };

        };

        // if (!changed) console.log('no change');
        // else console.log('change');

        return changed;

    };

    //get the value of k only from parent nodes
    this.getParentValue = function(k) {
        // console.log('getParentValue:' + k);
        var parents_v = [];
        for (var i = 0; i < this.parents.length; i++) {
            if (this.parents[i].map[k]) parents_v.push(this.parents[i].map[k]);
        };
        if (parents_v.length === 0) return this.lattice.getBottom();
        else return this.lattice.getLeastUpper(parents_v);
    };

    //get the value after a join and after F
    this.getValue = function(k) {
        return this.map[k];
    };

};
