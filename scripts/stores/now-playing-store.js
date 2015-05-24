/** The global store for NowPlaying state **/

var EventEmitter = require('events').EventEmitter;
var AppDispatcher = require('./../../app-dispatcher');
var NowPlayingConstants = require('../constants/now-playing-constants');

var _nowPlaying = false;
var _playState = 'PAUSED';
var _playbackTime = 0;
var CHANGE_EVENT = 'change';
var SOUNDCLOUD_CLIENT_ID = 'ff3108ddadaeeea1c2cd56d0b3617255';


function playTrack (nowPlaying) {
  _nowPlaying = nowPlaying;
  _playState = 'PLAYING';
}

function updatePlaybackTime (time) {
  _playbackTime = time;
  console.log(_playbackTime);
}

function pauseTrack () {
  _playState = 'PAUSED';
}

function unpauseTrack () {
  _playState = 'PLAYING';
}

function stopTrack () {
  _nowPlaying = null;
  _playState = 'PAUSED';
}

var NowPlayingStore = Object.assign({}, EventEmitter.prototype, {

  getTrack: function () {
    return _nowPlaying;
  },

  getState: function () {
    return _playState;
  },

  getPlaybackTime: function () {
    return _playbackTime;
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

     case NowPlayingConstants.NOW_PLAYING_START:
        playTrack(action.track);
        break;

      case NowPlayingConstants.NOW_PLAYING_UPDATE_TIME:
        updatePlaybackTime(action.time);
        break;

     case NowPlayingConstants.NOW_PLAYING_PAUSE:
        pauseTrack();
        break;

    case NowPlayingConstants.NOW_PLAYING_UNPAUSE:
        unpauseTrack();
        break;

     case NowPlayingConstants.NOW_PLAYING_STOP:
        stopTrack();
        break;

    default:
        return true;
  }
  NowPlayingStore.emitChange();
});

module.exports = NowPlayingStore;