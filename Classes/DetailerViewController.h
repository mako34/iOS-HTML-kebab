//
//  DetailerViewController.h
//  Detailer
//
//  Created by Calvin Chong on 27/01/11.
//  Copyright 2011 Orchard Marketing. All rights reserved.
//

#import <UIKit/UIKit.h>
#import "DetailerAppDelegate.h"

@interface DetailerViewController : UIViewController <UIWebViewDelegate> {
	DetailerAppDelegate *appDelegate;
	UIWebView *htmlView;
	UIWebView *externalHtmlView;
	BOOL firstLoad;
}

@property (nonatomic, retain) DetailerAppDelegate *appDelegate;
@property (nonatomic, retain) IBOutlet UIWebView *htmlView;
@property (nonatomic, retain) UIWebView *externalHtmlView;
@property (nonatomic, assign) BOOL firstLoad;

- (void)loadHtmlInExternalScreen;
- (void)executeScriptInExternalScreen:(NSString *)script;

@end
