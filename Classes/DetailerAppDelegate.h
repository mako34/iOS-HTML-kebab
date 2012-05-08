//
//  DetailerAppDelegate.h
//  Detailer
//
//  Created by Calvin Chong on 27/01/11.
//  Copyright 2011 Orchard Marketing. All rights reserved.
//

#import <UIKit/UIKit.h>

@class DetailerViewController;
@class ExternalViewController;

@interface DetailerAppDelegate : NSObject <UIApplicationDelegate> {
	UIWindow *window;
	UIWindow *externalWindow;	
    DetailerViewController *viewController;
	ExternalViewController *externalViewController;
	BOOL externalScreenIsConnected;	
}

@property (nonatomic, retain) IBOutlet UIWindow *window;
@property (nonatomic, retain) IBOutlet UIWindow *externalWindow;
@property (nonatomic, retain) IBOutlet DetailerViewController *viewController;
@property (nonatomic, retain) IBOutlet ExternalViewController *externalViewController;
@property (nonatomic, assign) BOOL externalScreenIsConnected;

- (BOOL)addExternalScreen;
- (void)removeExternalScreen;
- (void)addExternalScreenAndLoadHtml;

@end
