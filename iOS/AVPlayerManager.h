//
//  AVPlayerManager.h
//  ReactNativeMusic
//
//  Created by Nathan Hayflick on 5/22/15.
//

#import <AVFoundation/AVFoundation.h>
#import "RCTBridgeModule.h"
#import "RCTLog.h"

@interface AVPlayerManager : NSObject  <RCTBridgeModule>
@property (nonatomic) AVPlayer *player;

@end
