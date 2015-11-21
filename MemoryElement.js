
function MemoryElement(type , value) {
    if (type) this.type = type;
    if (value) this.value = value;
    this.parent = undefined;
    this.children = [];
};

MemoryElement.prototype.setType(type) {
	this.type = type;
};

MemoryElement.prototype.getType() {
	return this.type;
};

MemoryElement.prototype.setValue(value) {
	this.value = value;
};

MemoryElement.prototype.getValue() {
	return this.value;
};

MemoryElement.prototype.addMemoryElement(element) {
	this.children.push(element);
	element.parent = this;
};

module.exports.MemoryElement = MemoryElement;
