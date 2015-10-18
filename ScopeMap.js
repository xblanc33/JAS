var Map = require('./Map.js');
var set = require('./set.js');

function ScopeMap(parent) {
    this.local_scope = new Map();
    if (parent) this.parent_scope = parent;
    else this.parent_scope = undefined;

    // change the value of a variable or add it in the globle scope (upper parent)
    this.put = function(k, v) {
        if (!this.containsKey(k)) {
            return this.putLocal(k, v);
        } else {
            if (this.local_scope.containsKey(k)) return this.putLocal(k, v);
            else {
                if (typeof this.parent_scope === "undefined") return this.putLocal(k, v);
                else return this.parent_scope.put(k, v);
            };
        };
    };

    // add a value for a variable in the local scope, return true if the value has changed
    this.putLocal = function(k, v) {
        if (this.local_scope.get(k) == v) return false;
        else {
            this.local_scope.put(k, v);
            return true;
        };
    };


    //return the value of a variable or undefined 
    this.get = function(k) {
        var v = this.local_scope.get(k);
        if (typeof v === "undefined") {
            if (typeof this.parent_scope !== "undefined") return this.parent_scope.get(k);
            else return undefined;
        } else return v;
    };

    //check that a variable is in the map (local or in parent scope)
    this.containsKey = function(k) {
        var inlocal = this.local_scope.containsKey(k);
        if (inlocal) return true;
        else {
            if (typeof this.parent_scope === "undefined") return false;
            else return this.parent_scope.containsKey(k);
        }
    };

    //return all variables in scope (local and parent scope)
    this.keySet = function() {
        var pks = [];
        if (typeof this.parent_scope !== "undefined") pks = this.parent_scope.keySet();
        var res = set.union(this.localKeySet(), pks);
        return res;
    };

    //return the variables that are in the local scope
    this.localKeySet = function() {
        return this.local_scope.keySet();
    };

    //clone the ScopeMap
    this.clone = function() {
        var tmp;
        if (typeof this.parent_scope !== "undefined") {
            tmp = new ScopeMap(this.parent_scope.clone());
        } else tmp = new ScopeMap();
        tmp.local_scope = this.local_scope.clone();
        return tmp;
    };

    //join this map with another map (m), according to the lattice (l)
    this.join = function(m, l) {
        var thisDepth = this.depth();
        var mDepth = m.depth();
        var changed = false;
        if (thisDepth === mDepth) {
            changed = this.local_scope.join(m.local_scope,l);
            if ((typeof this.parent_scope !== "undefined") &&(typeof m.parent_scope !== "undefined") ) {
                changed = changed || this.parent_scope.join(m.parent_scope , l);
            };
        } else {
            if (thisDepth > mDepth) {
                if (typeof this.parent_scope !== "undefined") {
                    changed = changed || this.parent_scope.join(m, l);      
                };
            } else {
                if (typeof m.parent_scope !== "undefined") {
                    changed = changed || this.join(m.parent_scope, l);      
                };
            };
        };
        return changed;
    };

    //clean all keys / values
    this.clean = function() {
        this.map.clean();
        if (parent) this.parent_map.clean();
    };

    //return the deep of the scope hierarchie
    this.depth = function() {
        if (typeof this.parent_scope === "undefined") return 0;
        else return 1 + this.parent_scope.depth();
    };
};


module.exports.ScopeMap = ScopeMap;
