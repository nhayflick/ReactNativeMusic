var AppDispatcher = require('./../../app-dispatcher');
var AppConstants = require('../constants/app-constants');
var NowPlayingConstants = require('../constants/now-playing-constants');
var NowPlayingActions = require('../actions/now-playing-actions');

var AVPlayerManager = require('NativeModules').AVPlayerManager;
var DeviceEventEmitter = require('RCTDeviceEventEmitter');

var AVPlayerManagerUtil = {
  playMedia: function (url) {
    var mediaUrl = url + '?client_id=' + AppConstants.SOUNDCLOUD_CLIENT_ID;
    AVPlayerManager.playMedia(mediaUrl);
  },

  pauseMedia: function () {
    AVPlayerManager.pause();
  },

  unpauseMedia: function () {
    AVPlayerManager.unpause();
  }
};

DeviceEventEmitter.addListener(
  'UpdatePlaybackTime',
  (media) => NowPlayingActions.updateTime(parseInt(media.iCurrentTime) * 1000)
);

// Register callback to handle all updates
AppDispatcher.register(function(action) {

  switch(action.actionType) {

     case NowPlayingConstants.NOW_PLAYING_START:
        AVPlayerManagerUtil.playMedia(action.track['stream_url']);
        break;

     case NowPlayingConstants.NOW_PLAYING_PAUSE:
        AVPlayerManagerUtil.pauseMedia();
        break;

    case NowPlayingConstants.NOW_PLAYING_UNPAUSE:
        AVPlayerManagerUtil.unpauseMedia();
        break;

     case NowPlayingConstants.NOW_PLAYING_STOP:
        stopTrack();
        break;

    default:
        return true;
  }
});


module.exports = AVPlayerManagerUtil;