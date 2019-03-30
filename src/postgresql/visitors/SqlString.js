export default class SqlString {
    constructor(value) {
        this.value = `${value.replace("'", "''")}`;
        this.likeValue = this.value.replace(/\%/g, "\\%").replace(/\_/g, "\\_");
    }

    toString() {
        return `'${this.value}'`;
    }

    toEndsWithString() {
        return `'%${this.likeValue}' ESCAPE '\\'`;
    }

    toContainsString() {
        return `'%${this.likeValue}%' ESCAPE '\\'`;
    }

    toStartsWithString() {
        return `'${this.likeValue}%' ESCAPE '\\'`;
    }
}