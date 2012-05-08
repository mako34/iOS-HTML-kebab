//
//  ExternalViewController.h
//  Detailer
//
//  Created by Calvin Chong on 27/01/11.
//  Copyright 20111 Orchard Marketing. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface ExternalViewController : UIViewController {
	UIWebView *htmlView;
}

@property (nonatomic, retain) IBOutlet UIWebView *htmlView;

@end
