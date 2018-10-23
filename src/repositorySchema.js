export default {
    "$id": "/Repository",
    "title": "Description of Repository",
    "type": "object",
    "definitions": {
        "primitiveTypes": {
            "type": "string",
            "enum": ["INTEGER", "TEXT", "REAL", "INTEGER"]
        },
        "source": {
            "type": "object",
            "properties": {
                "name": {
                    "type": "string"
                },
                "version":{
                    "type": "string"
                },
                "label": {
                    "type": "string"
                },
                "column": {
                    "type": "string"
                }
            },
            "required": ["name", "version", "label", "column"]
        },
        "foreignKey": {
            "type": "object",
            "properties": {
                "label": {
                    "type": "string"
                },
                "source": {
                    "$ref": "#/definitions/source"
                }
            },
            "required": ["label", "source"]
        },
        "column": {
            "type": "object",
            "properties": {
                "type": {
                    "$ref": "#/definitions/primitiveTypes"
                },
                "name": {
                    "type": "string"
                },
                "label": {
                    "type": "string"
                },
                "description": {
                    "type": "string"
                },
                "foreignKey": {
                    "$ref": "#/definitions/foreignKey"
                },
                "isNullable": {
                    "type": "boolean"
                },
                "isUnique": {
                    "type": "boolean"
                },
                "isPrimaryKey": {
                    "type": "boolean"
                },
                "isIndexed": {
                    "type": "boolean"
                },
                "defaultValue": {
                    "type": ["string", "number", "boolean", "null"]
                }
            },
            "required": ["type", "name", "label"] 
        }
    },
    "properties": {
        "name": {
            "type": "string"
        },
        "label": {
            "type": "string"
        },
        "description": {
            "type": "string"
        },
        "version": {
            "type": "string"
        },
        "columns": {
            "type": "array",
            "items": {
                "$ref": "#/definitions/column"
            }
        }
    },
    "required": ["name", "label", "version", "columns"]
}
