//
//  DetailerViewController.m
//  Detailer
//
//  Created by Calvin Chong on 27/01/11.
//  Copyright 2011 Orchard Marketing. All rights reserved.
//

#import "DetailerViewController.h"

@implementation DetailerViewController

@synthesize appDelegate, htmlView, externalHtmlView, firstLoad;

// Implement viewDidLoad to do additional setup after loading the view, typically from a nib.
- (void)viewDidLoad {
	NSString *path = [[NSBundle mainBundle] pathForResource:@"index" ofType:@"html" inDirectory:@"html"];
	NSURL *baseURL = [NSURL fileURLWithPath:path];
	NSString *html = [NSString stringWithContentsOfFile:path encoding:NSUTF8StringEncoding error:nil];
	
	[htmlView setBackgroundColor:[UIColor clearColor]];
	[htmlView setOpaque:NO];
	
	firstLoad = YES;
	
	[htmlView loadHTMLString:html baseURL:baseURL];
	htmlView.delegate = self;
	
    [super viewDidLoad];
}

// Override to allow orientations other than the default portrait orientation.
- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation {
    return (interfaceOrientation == UIInterfaceOrientationLandscapeLeft || interfaceOrientation == UIInterfaceOrientationLandscapeRight);
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
}

- (void)viewDidUnload {
	self.appDelegate = nil;
	self.htmlView = nil;
	self.externalHtmlView = nil;
}

- (void)dealloc {
	[appDelegate dealloc];
	[htmlView dealloc];
	[externalHtmlView dealloc];
    [super dealloc];
}

#pragma mark -
#pragma mark Load and execute scripts in external screen

- (void)loadHtmlInExternalScreen {
	[externalHtmlView loadRequest:htmlView.request];
}

- (void)executeScriptInExternalScreen:(NSString *)script {
	[externalHtmlView stringByEvaluatingJavaScriptFromString:script];
}

#pragma mark -
#pragma mark UIWebViewDelegate methods

- (void)webViewDidFinishLoad:(UIWebView *)webView {
	if (firstLoad) {
		firstLoad = NO;
		[htmlView setOpaque:YES];
	}
	
	if (![appDelegate addExternalScreen]) return;
	[self loadHtmlInExternalScreen];
}

- (BOOL)webView:(UIWebView *)webView shouldStartLoadWithRequest:(NSURLRequest *)request navigationType:(UIWebViewNavigationType)navigationType {
	// Get URL
	NSURL *url = [[request URL] absoluteURL];
	
	// Get page from URL
	NSString *page = [[url path] lastPathComponent];
	NSLog(@"=======================");
	NSLog(@"Device screen loading: %@", page);
	
	// Get fragment from URL
	NSString *fragment = [[[request URL] absoluteURL] fragment];
	
	// Check for fragment
	if (fragment != NULL && [fragment length] > 0) {
		
		// URL fragment is used for communicating with external screen from within the webview
		// Exit if external screen is not connected
		if (!appDelegate.externalScreenIsConnected) return YES;
		
		// Fragment starts with !
		if ([fragment characterAtIndex:0] == '!') {
			// Get name of JavaScript function sent from webview
			NSString *function = [fragment substringFromIndex:1];
			
			if ([function compare:@"playVideo()"] == 0) {
				// Remove external screen during video playback
				[appDelegate removeExternalScreen];
			} else if (([function compare:@"endVideo()"] == 0)) {
				// Restore external screen after video playback
				[appDelegate addExternalScreenAndLoadHtml];
			} else {
				// Custom JavaScript function to be executed in external screen
				[self executeScriptInExternalScreen:function];				
			}
			
		}	
	}
	
	return YES;
}

@end