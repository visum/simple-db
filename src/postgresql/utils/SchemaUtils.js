export default class SchemaUtils {
    static getTableName(name, version) {
        return `${name}_${version}`;
    }

    static getTableNameFromSchema(schema){
        return SchemaUtils.getTableName(schema.name, schema.version);
    }

    static getPrimaryKeysFromSchema(schema) {
        return schema.primaryKeys;
    }
}