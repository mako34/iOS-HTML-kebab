//
//  DetailerAppDelegate.m
//  Detailer
//
//  Created by Calvin Chong on 27/01/11.
//  Copyright 2011 Orchard Marketing. All rights reserved.
//
//  External window code by Matt Legend Gemmell @ http://mattgemmell.com/

#import "DetailerAppDelegate.h"
#import "DetailerViewController.h"
#import "ExternalViewController.h"

@implementation DetailerAppDelegate

@synthesize window, externalWindow;
@synthesize viewController, externalViewController;
@synthesize externalScreenIsConnected;

#pragma mark -
#pragma mark Application lifecycle

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {    
	externalScreenIsConnected = NO;
	externalWindow.hidden = YES;
	
	// Pass app delegate into main view controller
	viewController.appDelegate = self;
	
    // Add main view to main window
    [window addSubview:viewController.view];
    [window makeKeyAndVisible];
	
	// Add external screen if available
	[self addExternalScreen];
	
	// Register for external screen connection/disconnection events
	[[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(addExternalScreenAndLoadHtml) name:UIScreenDidConnectNotification object:nil];
	[[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(removeExternalScreen) name:UIScreenDidDisconnectNotification object:nil];
	
	return YES;
}


#pragma mark -
#pragma mark Memory management

- (void)dealloc {
	[[NSNotificationCenter defaultCenter] removeObserver:self name:UIScreenDidConnectNotification object:nil];
	[[NSNotificationCenter defaultCenter] removeObserver:self name:UIScreenDidDisconnectNotification object:nil];	
    [viewController release];
	[externalViewController release];
    [window release];
	[externalWindow release];	
    [super dealloc];
}


#pragma mark -
#pragma mark External screen connection notifications and handling

- (BOOL)addExternalScreen {
	if (!externalScreenIsConnected) {
		if ([[UIScreen screens] count] > 1) {
			// Internal display is 0, external is 1.
			UIScreen *externalScreen = [[UIScreen screens] objectAtIndex:1];
			
			// Search for 1024x768 mode
			NSArray *screenModes = externalScreen.availableModes;
			for (UIScreenMode *mode in screenModes) {
				if (mode.size.width == 1024.0f && mode.size.height == 768.0f) {
					externalScreen.currentMode = mode;
					
					CGSize externalScreenSize;
					externalScreenSize.width = 1024.0f;
					externalScreenSize.height = 768.0f;
					
					CGRect rect = CGRectZero;
					rect.size = externalScreenSize;
					
					// Setup external window
					externalWindow.screen = externalScreen;
					externalWindow.frame = rect;
					externalWindow.clipsToBounds = YES;
					
					// Add external view to external window, unhide
					[externalWindow addSubview:externalViewController.view];		
					externalWindow.hidden = NO;
					[externalWindow makeKeyAndVisible];
					
					// Pass reference to external html view
					viewController.externalHtmlView = externalViewController.htmlView;
					
					// Make main window key again
					[window makeKeyWindow];
					
					externalScreenIsConnected = YES;
				}
			}		
		}
	}
	
	return externalScreenIsConnected;
}

- (void)removeExternalScreen {
	if (externalScreenIsConnected) {
		externalScreenIsConnected = NO;
		viewController.externalHtmlView = nil;
		externalWindow.hidden = YES;
		[externalWindow removeFromSuperview];
	}
}

- (void)addExternalScreenAndLoadHtml {
	[self addExternalScreen];
	[viewController loadHtmlInExternalScreen];
}

@end
