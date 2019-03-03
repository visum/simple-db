"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (obj, methodName, args, fallbackResult) {
    if (!Array.isArray(args)) {
        args = [];
    }

    if (obj != null && typeof obj[methodName] === "function") {
        var result = void 0;

        try {
            result = obj[methodName].apply(obj, args);
        } catch (error) {
            return Promise.reject(error);
        }

        if (!(result instanceof Promise)) {
            return Promise.resolve(result);
        }

        return result;
    }
    return Promise.resolve(fallbackResult);
};
//# sourceMappingURL=invokeMethodAsync.js.map