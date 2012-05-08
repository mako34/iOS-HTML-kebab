//
//  ExternalViewController.m
//  Detailer
//
//  Created by Calvin Chong on 27/01/11.
//  Copyright 2011 Orchard Marketing. All rights reserved.
//

#import "ExternalViewController.h"

@implementation ExternalViewController

@synthesize htmlView;

// Implement viewDidLoad to do additional setup after loading the view, typically from a nib.
- (void)viewDidLoad {
	[htmlView setBackgroundColor:[UIColor whiteColor]];
	[htmlView setOpaque:YES];
    [super viewDidLoad];
}

// Override to allow orientations other than the default portrait orientation.
- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation {
    return NO;
}

- (void)didReceiveMemoryWarning {
    [super didReceiveMemoryWarning];
}

- (void)viewDidUnload {
	self.htmlView = nil;
}

- (void)dealloc {
	[htmlView dealloc];
    [super dealloc];
}

@end