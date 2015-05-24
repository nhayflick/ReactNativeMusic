//
//  AVPlayerManager.m
//  ReactNativeMusic
//
//  Created by Nathan Hayflick on 5/22/15.
//

#import "AVPlayerManager.h"
#import "RCTConvert.h"
#import "RCTBridge.h"
#import "RCTEventDispatcher.h"


@implementation AVPlayerManager

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(playMedia:(NSString *)mediaUrl)
{
  NSURL *urlStream = [NSURL URLWithString:mediaUrl];
  self.player = [AVPlayer playerWithURL:urlStream];
  [[NSNotificationCenter defaultCenter]
   addObserver:self
   selector:@selector(playerItemDidReachEnd:)
   name:AVPlayerItemDidPlayToEndTimeNotification
   object:[self.player currentItem]];
  [self.player play];
  RCTLogInfo(@"Play media from %@", urlStream);
  __unsafe_unretained typeof(self) weakSelf = self;
  [self.player addPeriodicTimeObserverForInterval:CMTimeMake(1, 1) queue:NULL usingBlock:^(CMTime time) {
    
    if (!weakSelf.bridge) {
      return;
    }
    RCTLogInfo(@"Current media playback: %f", CMTimeGetSeconds(time));
    [weakSelf.bridge.eventDispatcher sendDeviceEventWithName:@"UpdatePlaybackTime"
                                                        body:@{@"iCurrentTime": @(CMTimeGetSeconds(time))}];
  }];
}


- (void)playerItemDidReachEnd:(NSNotification *)notification {
  RCTLogInfo(@"Media ended: %@", notification);
  [self.bridge.eventDispatcher sendDeviceEventWithName:@"UpdatePlaybackTime"
                                                  body:@{@"iCurrentTime": @(0)}];
}


RCT_EXPORT_METHOD(pause)
{
  //  If AVPlayer is playing
  if (self.player.rate > 0) {
    [self.player pause];
  }
}

RCT_EXPORT_METHOD(unpause)
{
  //  If AVPlayer is playing
  if (self.player.rate == 0) {
    [self.player play];
  }
}

@end