"use strict";
exports.__esModule = true;
var namespaced_1 = require("./namespaced");
// ______________________________________________________
function createActions(actionsSrc, namespace) {
    if (namespaced_1.namespaced[namespace] !== undefined &&
        process.env.NODE_ENV !== 'development') {
        throw new Error("redux-aggregate: conflict namespace -> " + namespace);
    }
    else {
        namespaced_1.namespaced[namespace] = namespace;
    }
    var types = {};
    var creators = {};
    var __srcmap__ = {};
    Object.keys(actionsSrc).forEach(function (key) {
        var type = "" + namespace + key;
        types[key] = type;
        creators[key] = function (payload) { return ({
            type: type,
            payload: actionsSrc[key](payload)
        }); };
        __srcmap__[type] = actionsSrc[key];
    });
    return {
        __namespace__: namespace,
        __srcmap__: __srcmap__,
        types: types,
        creators: creators
    };
}
exports.createActions = createActions;
