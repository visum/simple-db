export default (obj, methodName, args, fallbackResult) => {
    if (!Array.isArray(args)) {
        args = [];
    }

    if (obj != null && typeof obj[methodName] === "function") {
        return obj[methodName].apply(obj, args);
    }

    return fallbackResult;
};