export default (obj, methodName, args, fallbackResult) => {
    if (!Array.isArray(args)) {
        args = [];
    }

    if (obj != null && typeof obj[methodName] === "function") {
        let result;

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