"use strict";
exports.__esModule = true;
var namespaced_1 = require("./namespaced");
// ______________________________________________________
function createAggregate(mutations, namespace) {
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
    Object.keys(mutations).forEach(function (key) {
        var type = "" + namespace + key;
        types[key] = type;
        creators[key] = function (payload) { return ({ type: type, payload: payload }); };
        __srcmap__[type] = mutations[key];
    });
    function reducerFactory(initialState) {
        return function (state, action) {
            if (state === void 0) { state = initialState; }
            var mutator = __srcmap__[action.type];
            if (typeof mutator !== 'function')
                return state;
            return mutator(state, action.payload);
        };
    }
    function subscribe(provider, subscriptions) {
        Object.keys(subscriptions).forEach(function (key) {
            var type = "" + provider.__namespace__ + key;
            __srcmap__[type] = subscriptions[key];
        });
    }
    return {
        __namespace__: namespace,
        __srcmap__: __srcmap__,
        types: types,
        creators: creators,
        reducerFactory: reducerFactory,
        subscribe: subscribe
    };
}
exports.createAggregate = createAggregate;
