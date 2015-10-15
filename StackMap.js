var Map = require('./Map.js');
var set = require('./set.js');

function StackMap(parent) {
    this.map = new Map();
    if (parent) this.parent_map = parent;
    else this.parent_map = undefined;

    this.put = function(k, v) {
        if (!this.containsKey(k)) {
            this.map.put(k, v);
            return true; //something has changed
        } else {
            if (this.map.containsKey(k)) return this.putTop(k, v);
            else return this.parent_map.put(k, v);
        };
    };

    this.putTop = function(k, v) {
        if (this.map.get(k) == v) return false;
        else {
            this.map.put(k, v);
            return true;
        };
    };

    this.get = function(k) {
        var v = this.map.get(k);
        if (typeof v === "undefined") {
            if (this.parent_map) return this.parent_map.get(k);
            else return undefined;
        } else return v;
    };

    this.containsKey = function(k) {
        var local = this.map.containsKey(k);
        if (!this.map.containsKey(k) && this.parent_map) return this.parent_map.containsKey(k);
        else return local;

    };

    this.keySet = function() {
        var pks = [];
        if (this.parent_map) pks = this.parent_map.keySet();
        return set.union(this.ownKeySet(), pks);
    };

    this.ownKeySet = function() {
        return this.map.keySet();
    };

    this.clone = function() {
        var tmp;
        if (this.parent_map) {
            tmp = new StackMap(this.parent_map.clone());
        } else tmp = new StackMap();
        tmp.map = this.map.clone();
        return tmp;
    };

    //join this map with another map (m), according to the lattice (l)
    this.join = function(m, l) {
        var changed = this.map.join(m.map, l); //join the first level
        if (m.parent_map) {
            if (this.parent_map) {
                if (this.parent_map.join(m.parent_map, l)) changed = true;
            } else {
                this.parent_map = m.parent_map.clone();
                changed = true;
            };
        };
        return changed;
    };

    //clean all keys / values
    this.clean = function() {
        this.map.clean();
        if (parent) this.parent_map.clean();
    };
};


module.exports.StackMap = StackMap;
