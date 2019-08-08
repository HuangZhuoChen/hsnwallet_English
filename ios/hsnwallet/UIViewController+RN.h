//
//  UIViewController+RN.h
//  hsnwallet
//
//  Created by xyg on 10/12/18.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RnViewController : UIViewController
//- (IBAction)changeStyle:(UISegmentedControl *)sender;
- (IBAction)statusShowOrHidden:(BOOL)sender;
- (void)setHorizontalScreen:(BOOL) hScreenFlag;
- (IBAction)changeStyle:(BOOL)sender;
- (void)choicePhoto:(NSString*)rnkey;
- (void)shareClick:(NSString *) shareFile;
@end

NS_ASSUME_NONNULL_END
