var AppDispatcher = require('./../../app-dispatcher');
var NowPlayingConstants = require('../constants/now-playing-constants');

var NowPlayingActions = {

  play: function(track) {
    AppDispatcher.dispatch({
      actionType: NowPlayingConstants.NOW_PLAYING_START,
      track: track
    });
  },

  updateTime: function(time) {
    AppDispatcher.dispatch({
      actionType: NowPlayingConstants.NOW_PLAYING_UPDATE_TIME,
      time: time
    });
  },

  pause: function() {
    AppDispatcher.dispatch({
      actionType: NowPlayingConstants.NOW_PLAYING_PAUSE
    });
  },

 unpause: function() {
    AppDispatcher.dispatch({
      actionType: NowPlayingConstants.NOW_PLAYING_UNPAUSE
    });
  },

  stop: function() {
    AppDispatcher.dispatch({
      actionType: NowPlayingConstants.NOW_PLAYING_STOP
    });
  }
};

module.exports = NowPlayingActions;