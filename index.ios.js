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
var SOUNDCLOUD_CLIENT_ID = 'ff3108ddadaeeea1c2cd56d0b3617255';

var ReactNativeMusic = React.createClass({
  getInitialState: function () {
    return {
      nowPlaying: null
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
        <NowPlayingFooterView nowPlaying={this.props.nowPlaying}/>
      </View>
    );
  }
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
  fetchEndpoint: 'http://api.soundcloud.com/tracks.json?client_id=' + SOUNDCLOUD_CLIENT_ID,
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
  render: function () {
    if (!this.props.nowPlaying) {
      return (
        <View style={styles.nowPlayingFooter}>
          <Text style={styles.trackTitle}>Welcome!</Text>
          <Text style={styles.trackArtist}>No Track Right Now</Text>
        </View>
      );
    }
    return (
      <View style={styles.nowPlayingFooter}>
        <Text style={styles.trackTitle}>{this.props.nowPlaying.title}</Text>
        <Text style={styles.trackArtist}>{this.props.nowPlaying.user.username}</Text>
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
            <Text style={styles.trackTitle}>{this.props.track.title}</Text>
            <Text style={styles.trackArtist}>{this.props.track.user.username}</Text>
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
          <TouchableHighlight style={styles.playButton}>
            <Text style={styles.playButtonText}>Play Track</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
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
    borderTopWidth: .5
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
  rightContainer: {
    flex: 1,
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
    marginBottom: 8,
    textAlign: 'center',
  },
  trackArtist: {
    fontSize: 12,
    marginBottom: 6,
    textAlign: 'center',
  },
  thumbnail: {
    width: 50,
    height: 50,
  }
});

AppRegistry.registerComponent('ReactNativeMusic', () => ReactNativeMusic);
