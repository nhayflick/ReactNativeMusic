var AppDispatcher = require('./../../app-dispatcher');
var TracksCollectionConstants = require('../constants/tracks-collection-constants');

var TracksCollectionActions = {

  updateQuery: function(query) {
    AppDispatcher.dispatch({
      actionType: TracksCollectionConstants.UPDATE_QUERY,
      query: query
    });
  },

  loadTracks: function(data) {
    AppDispatcher.dispatch({
      actionType: TracksCollectionConstants.LOAD_TRACKS,
      data: data
    });
  }
};

module.exports = TracksCollectionActions;