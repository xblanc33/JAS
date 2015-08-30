function inter(a, b) {
    var res = [];

    for (var i = 0; i < a.length; i++) {
        if ((b.indexOf(a[i]) !== -1) && (res.indexOf(a[i]) === -1)) res.push(a[i])
    };
	return res;
};

function union(a, b) {
	res = toSet(a);
	for (var i = 0; i < b.length; i++) {
		if (res.indexOf(b[i]) === -1) res.push(b[i]);
	};
	return res;
};

function toSet(a) {
    var res = [];
    for (var i = 0; i < a.length; i++) {
        if (a.lastIndexOf(a[i]) === i) res.push(a[i]);
    };
    return res;
};

function isSet(a) {
    var res=true;
    for (var i = 0; i < a.length; i++) {
        if (a.lastIndexOf(a[i]) != i) res=false;
    };
    return res;
};

module.exports.inter = inter;
module.exports.union = union;
