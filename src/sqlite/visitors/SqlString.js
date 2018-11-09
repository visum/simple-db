export default class SqlString {
    constructor(value) {
        this.value = `${value.replace("'", "''")}`;
    }

    toString() {
        return `'${this.value}'`;
    }

    toEndsWithString() {
        return `'%${this.value}'`;
    }

    toContainsString() {
        return `'%${this.value}%'`;
    }

    toStartsWithString() {
        return `'${this.value}%'`;
    }
}