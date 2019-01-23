'use babel';

export default class LuaSymbolTable {

  static newSymbolTable() {
    return new LuaSymbolTable(null);
  }

  constructor(parent) {
    this.range = {start: NaN, end: Infinity};
    this.entries = {};
    this.parent = parent;
    this.children = [];
  }

  isRoot() {
    return null == this.parent;
  }

  getParent() {
    return null == this.parent ? this : this.parent;
  }

  getLastChild() {
    return 0 === this.children.length ? null : this.children[this.children.length - 1];
  }

  isInScope(index) {
    return this.range.start <= index && index <= this.range.end;
  }

  setStart(start) {
    this.range.start = start;
  }

  setEnd(end) {
    this.range.end = end;
  }

  addEntry(name, index, type, kind) {
    if (!this.entries.hasOwnProperty(name)) {
      const entry = {index: index, type: type, kind: kind};
      this.entries[name] = entry
    }
  }

  addChild(child) {
    this.children.push(child);
  }

}