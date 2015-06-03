var TracksCollectionActions = require('../actions/tracks-collection-actions');
var AppConstants = require('../constants/app-constants');

var TracksAPIUtil = {
  // SoundCloud Tracks Endpoint
  fetchEndpoint: 'http://api.soundcloud.com/tracks.json?client_id=' + AppConstants.SOUNDCLOUD_CLIENT_ID,
  // Load Tracks From SoundCloud
  getTracks: function (query) {
    var queryString = '';
    if (query) {
      queryString = '&q=' + query;
    }
        // Return live data
    fetch(this.fetchEndpoint + queryString)
      .then((response) => response.json())
      .then((responseData) => {
        TracksCollectionActions.loadTracks(responseData);
      }).catch((error) => {
        console.warn(error);
      })
      .done();
  }
};

module.exports = TracksAPIUtil; 