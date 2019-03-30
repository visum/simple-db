export default class PostgreSQLUtils {
    static escapeValue(value) {
        if (typeof value === "string") {
            return `'${value.replace(/\'/, "''")}'`;
        } else {
            return value.toString();
        }
    }

    static escapeName(name) {
        if (typeof name === "string") {
            return `"${name.replace(/\"/, "\"")}"`;
        }
        return name;
    }
}