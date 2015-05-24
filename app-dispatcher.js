var Dispatcher = require('flux').Dispatcher;
var AppDispatcher = {};
/**
 * AppDispatcher 
 * A singleton that operates as the central hub for application updates.
 */
var AppDispatcher = Object.assign(new Dispatcher(), {});

module.exports = AppDispatcher;