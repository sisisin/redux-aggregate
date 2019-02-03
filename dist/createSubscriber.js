"use strict";
exports.__esModule = true;
// ______________________________________________________
function createSubscriber() {
    var __srcmap__ = {};
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
        reducerFactory: reducerFactory,
        subscribe: subscribe
    };
}
exports.createSubscriber = createSubscriber;
