import debugFactory from 'debug';
/** A documented example module */
var Module = /** @class */ (function () {
    /** Creates a new Module */
    function Module() {
        this.logger = debugFactory('module-ts-template');
    }
    /** Starts the module */
    Module.prototype.start = function () {
        this.logger('Starting module');
    };
    return Module;
}());
export default Module;
