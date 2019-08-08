//
//  UIViewController+RN.m
//  hsnwallet
//
//  Created by xyg on 10/12/18.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "UIViewController+RN.h"
#import "AppDelegate.h"
#import <AVFoundation/AVFoundation.h>
#import "UIDevice+TFDevice.h"

@interface RnViewController ()<UINavigationControllerDelegate,UIImagePickerControllerDelegate,AVCaptureMetadataOutputObjectsDelegate,UIDocumentInteractionControllerDelegate>{
  UIImagePickerController *imagePicker;
}
//@interface RnViewController()
@property (assign, nonatomic)   UIStatusBarStyle            statusBarStyle;//状态栏样式
@property (assign, nonatomic)   BOOL                        statusBarHidden; //状态栏隐藏
@property (assign, nonatomic)   BOOL                        isHScreen; //是否横屏的状态
//@property (assign, nonatomic)   NSString*                   rkey; //选择的key
@property(nonatomic,strong)UIDocumentInteractionController *documentController;
@end

NSString* rkey = @"";
@implementation RnViewController
//在试图将要已将出现的方法中x
- (void)viewDidAppear:(BOOL)animated{
  
  [super viewDidAppear:animated];
  
  if ([self respondsToSelector:@selector(setNeedsStatusBarAppearanceUpdate)]) {
    
    //调用隐藏方法
    [self preferredStatusBarStyle];
    [self prefersStatusBarHidden];
    [self performSelector:@selector(setNeedsStatusBarAppearanceUpdate)];
    
  }
  _isHScreen=false;
  [self setInterfaceOrientation:UIInterfaceOrientationPortrait];
}

- (IBAction)changeStyle:(BOOL)sender {
  
  if (sender == false) {
    _statusBarStyle = UIStatusBarStyleDefault;
  } else {
    _statusBarStyle = UIStatusBarStyleLightContent;
  }
  [self setNeedsStatusBarAppearanceUpdate];
}
- (IBAction)statusShowOrHidden:(BOOL)sender {
  if (sender == false) {
    _statusBarHidden = NO;
  } else {
    _statusBarHidden = YES;
  }
  [self setNeedsStatusBarAppearanceUpdate];
}

- (UIStatusBarStyle)preferredStatusBarStyle
{
  return _statusBarStyle;
}

- (BOOL)prefersStatusBarHidden
{
  return _statusBarHidden;
}

- (void)setHorizontalScreen:(BOOL) hScreenFlag
{
  if(hScreenFlag==1){
    _isHScreen=true;
//    [self setInterfaceOrientation:UIInterfaceOrientationLandscapeRight];
    AppDelegate * appDelegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
    //允许转成横屏
    appDelegate.allowRotation = YES;
    //调用转屏代码
    [UIDevice switchNewOrientation:UIInterfaceOrientationLandscapeRight];
  }else{
    _isHScreen=false;
//    [self setInterfaceOrientation:UIInterfaceOrientationPortrait];
    AppDelegate * appDelegate = (AppDelegate *)[UIApplication sharedApplication].delegate;
    appDelegate.allowRotation = NO;//关闭横屏仅允许竖屏
    //切换到竖屏
    [UIDevice switchNewOrientation:UIInterfaceOrientationPortrait];
  }
  
}

//强制转屏(暂时不用这种了，保留参考)
- (void)setInterfaceOrientation:(UIInterfaceOrientation)orientation{

    if ([[UIDevice currentDevice] respondsToSelector:@selector(setOrientation:)]) {
      SEL selector  = NSSelectorFromString(@"setOrientation:");
      NSInvocation *invocation = [NSInvocation invocationWithMethodSignature:[UIDevice instanceMethodSignatureForSelector:selector]];
      [invocation setSelector:selector];
      [invocation setTarget:[UIDevice currentDevice]];
      // 从2开始是因为前两个参数已经被selector和target占用
      [invocation setArgument:&orientation atIndex:2];
      [invocation invoke];
    }

}

//必须返回YES
- (BOOL)shouldAutorotate{
    return YES;
}

- (UIInterfaceOrientationMask)supportedInterfaceOrientations{
  if(_isHScreen==true){
    return (UIInterfaceOrientationMaskLandscapeRight);
  }else{
    return (UIInterfaceOrientationMaskPortrait);
  }
}

#pragma mark - 从相册识别二维码
- (void)choicePhoto:(NSString*)rnkey
{
  rkey=rnkey;
  imagePicker = [[UIImagePickerController alloc]init];
  imagePicker.sourceType = UIImagePickerControllerSourceTypePhotoLibrary;
  imagePicker.delegate = self;
  [self presentViewController:imagePicker animated:YES completion:nil];
}
#pragma mark - ImagePickerDelegate
-(void)imagePickerController:(UIImagePickerController*)picker didFinishPickingMediaWithInfo:(NSDictionary *)info
{
  NSString *content = @"" ;
  //取出选中的图片
  UIImage *pickImage = info[UIImagePickerControllerOriginalImage];
  NSData *imageData = UIImagePNGRepresentation(pickImage);
  CIImage *ciImage = [CIImage imageWithData:imageData];
  
  //创建探测器
  CIDetector *detector = [CIDetector detectorOfType:CIDetectorTypeQRCode context:nil options:@{CIDetectorAccuracy: CIDetectorAccuracyLow}];
  NSArray *feature = [detector featuresInImage:ciImage];
  
  //取出探测到的数据
  for (CIQRCodeFeature *result in feature) {
    content = result.messageString;
  }
  
  [picker dismissViewControllerAnimated:NO completion:^{
    NSString *resultContent = @"" ;
    if (![content isEqualToString:@""]) {
      resultContent=content;
    }else{
      resultContent=@"未识别图片中的二维码";
    }
   
    NSDictionary* resultDate = @{
                               @"result": resultContent,
                               @"key" : rkey,
                               };
    dispatch_async(dispatch_get_main_queue(), ^{
            [[NSNotificationCenter defaultCenter] postNotificationName:@"sendCustomEventNotification" object:self userInfo:resultDate];
    });
  }];
}

- (void)imagePickerControllerDidCancel:(UIImagePickerController *)picker{
  [picker dismissViewControllerAnimated:YES completion:nil];
}


- (void)shareClick:(NSString *) shareFile
{
  NSLog(@"shareFile:%@",shareFile);
  self.documentController = [UIDocumentInteractionController interactionControllerWithURL:[NSURL fileURLWithPath:shareFile]];
  self.documentController.delegate = self;
  self.documentController.UTI =  @"public.data";
  [self.documentController presentOpenInMenuFromRect:CGRectZero inView:self.view animated:YES];
}

@end
