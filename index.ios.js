/**
 * Sample React Native Music App
 * https://github.com/nhayflick/ReactNativeMusic
 * https://medium.com/@Nayflix/building-a-soundcloud-app-with-react-native-1144b6d3773a
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  Image,
  ListView,
  NavigatorIOS,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
} = React;

var TimerMixin = require('react-timer-mixin');
var NowPlayingStore = require('./scripts/stores/now-playing-store');
var NowPlayingActions = require('./scripts/actions/now-playing-actions');
var AVPlayerManagerUtil = require('./scripts/utils/av-player-manager-util');
var AppConstants = require('./scripts/constants/app-constants');
var Icon = require('FAKIconImage');

var ReactNativeMusic = React.createClass({

  componentDidMount: function() {
    NowPlayingStore.addChangeListener(this.onChange);  
  },

  componentWillUnmount: function() {
    NowPlayingStore.removeChangeListener(this.onChange);
  },

  onChange: function() {
    this.setState({
      nowPlaying: this.getNowPlaying()
    });
  },

  getInitialState: function () {
    return {
      nowPlaying: this.getNowPlaying()
    }
  },

  getNowPlaying: function () {
    return {
      track: NowPlayingStore.getTrack(),
      playState: NowPlayingStore.getState(),
      playbackTime: NowPlayingStore.getPlaybackTime()
    }
  },

  render: function() {
    return (
      <View style={styles.appContainer}>
        <NavigatorIOS style={styles.navContainer}
          barTintColor='#F5FCFF' 
          initialRoute={{
            title: 'ReactNativeMusic',
            component: BrowseTracksView
          }} />
        <NowPlayingFooterView nowPlaying={this.state.nowPlaying}/>
      </View>
    );
  },
});

// List View For Browsing Songs
var BrowseTracksView = React.createClass({

  mixins: [TimerMixin],

  timeoutID: (null: any),

  getInitialState: function () {
    return {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2
      })
    };
  },

  componentDidMount: function() {
    this.fetchData();
  },

  fetchData: function (query) {
    var queryString = '';
    if (query) {
      queryString = '&q=' + query
    }
    // Return live data
    fetch(this.fetchEndpoint + queryString)
      .then((response) => response.json())
      .then((responseData) => {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(responseData)
        });
      }).catch((error) => {
        console.warn(error);
      })
      .done();
  },

  fetchEndpoint: 'http://api.soundcloud.com/tracks.json?client_id=' + AppConstants.SOUNDCLOUD_CLIENT_ID,

  onSearchChange: function (event) {
    var q = event.nativeEvent.text.toLowerCase();
    this.clearTimeout(this.timeoutID);
    this.timeoutID = this.setTimeout(() => this.fetchData(q), 100);
  },

  render: function () {
    return (
      <ListView 
        dataSource={this.state.dataSource}
        renderRow={this.renderTrack}
        renderHeader={this.renderSearchBar}
        style={styles.listView}/>
    );
  },

  renderSearchBar: function () {
    return (
      <View style={styles.searchCell}>
        <Icon name='fontawesome|search'
            size={32}
            color={'#4472B9'}
            style={styles.playIcon}/>
        <TextInput onChange={this.onSearchChange} placeholder={'Search Here'} style={styles.searchContainer}/>
      </View>
    )
  },

  renderTrack: function (track) {
    return (
      <TrackCell navigator={this.props.navigator} track={track}/>
    );
  }
});

var NowPlayingFooterView = React.createClass({

  componentWillUnmount: function () {
    console.log('will unmount');
  },

  timeString: function (duration) {
    var mins = Math.floor((duration / 60000) % 60);
    var secs = Math.floor((duration / 1000) % 60);
    return (mins > 9 ? mins : '0' + mins) + ':' + (secs> 9 ? secs : '0' + secs);
  },

  onPressPause: function () {
    NowPlayingActions.pause();
  },

  onPressUnpause: function () {
    NowPlayingActions.unpause();
  },

  render: function () {
    var playerButton;
    if (!this.props.nowPlaying.track) {
      return (
        <View style={styles.nowPlayingFooter}>
          <View>
            <Icon name='fontawesome|music'
            size={32}
            color='#3b5998'
            style={styles.playIcon}/>
          </View>
          <View style={styles.rightContainer}>
            <Text numberOfLines={1} style={styles.trackTitle}>
              <Text style={styles.lightText}>
                Welcome to React Native Music!
              </Text>
            </Text>
            <Text numberOfLines={1} style={styles.trackArtist}>
              <Text style={styles.lightText}>
                No Track Currently Playing
              </Text>
            </Text>
          </View>
        </View>
      );
    }
    if (this.props.nowPlaying.playState === 'PLAYING') {
      playerButton = (
        <TouchableOpacity onPress={() => this.onPressPause()}>
          <Icon name='fontawesome|pause'
          size={28}
          color='lightgray'
          style={styles.playIcon}/>
        </TouchableOpacity>
      );
    } else {
       playerButton = (
        <TouchableOpacity onPress={() => this.onPressUnpause()}>
          <Icon name='fontawesome|play'
          size={28}
          color='lightgray'
          style={styles.playIcon}/>
        </TouchableOpacity>
        );
    }
    return (
      <View style={styles.nowPlayingFooter}>
        {playerButton}
        <Image
          source={{uri: this.props.nowPlaying.track.artwork_url}}
          style={styles.microThumbnail} />
        <View style={styles.rightContainer}>
          <Text numberOfLines={1} style={styles.trackTitle}>
            <Text style={styles.lightText}>
              {this.props.nowPlaying.track.title}
            </Text>
          </Text>
          <Text numberOfLines={1} style={styles.trackArtist}>
            <Text style={styles.lightText}>
              {this.props.nowPlaying.track.user.username}
            </Text>
          </Text>
        </View>
        <Text numberOfLines={1}>
          <Text style={styles.lightText}>{this.timeString(this.props.nowPlaying.playbackTime)} / {this.timeString(this.props.nowPlaying.track.duration)}</Text>
        </Text>
      </View>
    );
  }

});

// Song Result Cell For BrowseTracksView
var TrackCell = React.createClass({

  render: function () {
    return (
      <TouchableOpacity onPress={() => this.selectTrack(this.props.track)} style={styles.rightContainer}>
        <View style={styles.trackCell}>
          <Image
            source={{uri: this.props.track.artwork_url}}
            style={styles.thumbnail} />
          <View style={styles.rightContainer}>
            <Text numberOfLines={1} style={styles.trackTitle}>{this.props.track.title}</Text>
            <Text numberOfLines={1} style={styles.trackArtist}>{this.props.track.user.username}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  },

  selectTrack: function (track) {
    this.props.navigator.push({
      title: track.title,
      component: TrackScreen,
      passProps: {track}
    });
  }
});

var TrackScreen = React.createClass({

  render: function () {
    var largeImageUrl = this.props.track.artwork_url ? this.props.track.artwork_url.replace('-large', '-t300x300') : '';
    return (
      <View style={styles.trackScreen}>
       <Image
          style={styles.largeArtwork}
          source={{uri: largeImageUrl}}>
        </Image>
        <Text style={styles.trackTitle}>{this.props.track.title}</Text>
        <Text style={styles.trackArtist}>{this.props.track.user.username}</Text>
        <View style={styles.buttonRow}>
          <TouchableHighlight onPress={()=>this.onPressPlay(this.props.track)} style={styles.playButton}>
            <View style={{flexDirection: 'row'}}>
              <Icon name='fontawesome|play'
              size={20}
              color='white'
              style={styles.smallIcon}/>
              <Text style={styles.playButtonText}>Play Track</Text>
             </View>
          </TouchableHighlight>
        </View>
      </View>
    );
  },

  onPressPlay: function (track) {
    NowPlayingActions.play(track);
  }
});

var styles = StyleSheet.create({

  appContainer: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#F5FCFF'
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
  },

  largeArtwork: {
    width: 300,
    height: 300
  },

  listView: {
     backgroundColor: '#F5FCFF',
  },

  navContainer: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },

  nowPlayingFooter: {
    flex: 0,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: .5,
    paddingLeft: 6,
    paddingRight: 6,
    backgroundColor: '#333'
  },

  playButton: {
    backgroundColor: '#4472B9',
    margin: 4,
    padding: 4,
    borderRadius: 4,
    flex: 1
  },

  playButtonText: {
    color: 'white',
    fontSize: 20
  },

  playIcon: {
    height: 32,
    width: 32,
    margin: 4
  },

  playbackTimeContainer: {
    flexDirection: 'column',
    alignItems: 'center'
  },

  rightContainer: {
    flex: 1,
    paddingLeft: 8,
    paddingRight: 8
  },

  searchCell: {
    flex: 1,
    flexDirection: 'row'
  },

  searchContainer: {
    height: 40,
    width: 100,
    flex: 1,
    margin: 4,
    padding: 4,
    borderColor: 'gray',
    color: 'black',
    borderWidth: 1
  },

  smallIcon: {
    height: 20,
    width: 20
  },

  trackCell: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
    marginRight: 4,
    padding: 4,
    borderBottomWidth: .5,
    borderColor: 'lightgray'
  },

  trackScreen: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },

  trackTitle: {
    fontSize: 20,
    marginBottom: 4,
    textAlign: 'center'
  },

  trackArtist: {
    fontSize: 12,
    marginBottom: 6,
    textAlign: 'center',
  },

  thumbnail: {
    width: 50,
    height: 50,
  },

  microThumbnail: {
    width: 40,
    height: 40,
  },

  lightText: {
    color: 'lightgray'
  }
});

AppRegistry.registerComponent('ReactNativeMusic', () => ReactNativeMusic);
