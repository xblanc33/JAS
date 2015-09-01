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
                if (!parents_map.hasOwnProperty(pk)) parents_map[pk] = [];
                parents_map[pk].push(this.parents[i].map[pk]);
            };
        };

        //join all properties but k
        var changed = false;
        for (pk in parents_map) {
            if (pk !== k) {
                if (this.map[pk]) parents_map[pk].push(this.map[pk]); //include the state mapping 
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

    this.variableBefore = function(k) {
        var parents_v =  [];
        for (var i = 0; i < this.parents.length; i++) {
            if (this.parents[i].map[k]) parents_v.push(this.parents[i].map[k]);
        };
        if (parents_v.length === 0) return 'B';
        else return this.lattice.getLeastUpper(parents_v)[0];
    };

    this.variableAfter = function(k) {
        return this.map[k];
    };

};


function variableDeclaration(v) {
    return this.join(v, '?');
};

function variableAffectationLiteral(v, lit) {
    var val = 'B';
    var num = parseInt(lit);
    if (!isNaN(num)) {
        if (num >= 0) {
            val = '+'
        } else val = '-';
    };
    return this.join(v, val);
};

function variableAffectationIdentifier(v, id) {
	var v_id = this.variableBefore(id);
	return this.join(v,v_id);
};

function variableAffectationExpression(v, exp) {
	var l = this.variableBefore(exp.l);
	var r = this.variableBefore(exp.r);
	return this.join(v,elementExpression(l,r,exp.op));
};

function elementExpression(l,r,op) {
	switch (op) {
		case('+') : return signPlus(l,r); break;
		case('-') : return signMinus(l,r); break;
		case('*') : return signPower(l,r); break;
		default : return 'B';
	};
};

function signPlus(l,r) {
	if (l === '+' && r === '+') return '+';
	if (l === '-' && r === '-') return '-';
	else return '?';
};

function signMinus(l,r) {
	if (l === '-' && r === '+') return '-';
	else if (l === '+' && r === '-') return '+';
	else return '?';
};

function signPower(l,r) {
	return '?';
};


module.exports.State = State;
module.exports.variableDeclaration = variableDeclaration;
module.exports.variableAffectationLiteral = variableAffectationLiteral;
module.exports.variableAffectationIdentifier = variableAffectationIdentifier;
module.exports.variableAffectationExpression = variableAffectationExpression;
