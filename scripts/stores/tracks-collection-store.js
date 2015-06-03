/** The global store for the current tracks collection **/

var EventEmitter = require('events').EventEmitter;
var AppDispatcher = require('./../../app-dispatcher');
var TracksCollectionConstants = require('../constants/tracks-collection-constants');
var TracksApiUtil = require('../utils/tracks-api-util');

var _tracksCollection,
  _query,
  CHANGE_EVENT = 'change';

function updateQuery (query) {
  _query = query;
  TracksApiUtil.getTracks(_query);
}

function loadTracks (data) {
  _tracksCollection = data;
}

var TracksCollectionStore = Object.assign({}, EventEmitter.prototype, {

  getTracksCollection: function () {
    return _tracksCollection;
  },

  getQuery: function () {
    return _query;
  },

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }
});

// Register callback to handle all updates
AppDispatcher.register(function(action) {

  switch(action.actionType) {

    case TracksCollectionConstants.UPDATE_QUERY:
        updateQuery(action.query);
        break;

    case TracksCollectionConstants.LOAD_TRACKS:
        loadTracks(action.data);
        break;

    default:
        return true;
  }
  TracksCollectionStore.emitChange();
});

module.exports = TracksCollectionStore;