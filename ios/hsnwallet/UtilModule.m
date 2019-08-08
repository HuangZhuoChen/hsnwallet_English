//
//  UtilModule.m
//  hsnwallet
//
//  Created by xyg on 11/9/18.
//  Copyright © 2018年 Facebook. All rights reserved.
//
#import "UtilModule.h"
#import "AppDelegate.h"
#import "NSString+MD5.h"
#import "UIViewController+RN.h"
#import "KeychainTool.h"

#import <WebKit/WebKit.h>

#define rnNotification @"getValueFromRN"

NSString *const kIosEventName = @"IosEventName";
NSString *const WalletDataEvent = @"IosWalletData";//用来监听一键迁移数据的
NSString *const SimpleWalletEvent = @"IosSimpleWallet";//用来监听simplewallet的
@implementation UtilModule

RCT_EXPORT_MODULE();


+ (id)allocWithZone:(struct _NSZone *)zone {
  static UtilModule *sharedInstance = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [super allocWithZone:zone];
  });
  return sharedInstance;
}


- (instancetype)init {
  self = [super init];
  if (self) {
    NSNotificationCenter *defaultCenter = [NSNotificationCenter defaultCenter];
    [defaultCenter removeObserver:self];
    [defaultCenter addObserver:self
                      selector:@selector(sendCustomEvent:)
                          name:@"sendCustomEventNotification"
                        object:nil];
  }
  return self;
}



RCT_EXPORT_METHOD(iosDebugInfo:(NSString *)s){
  //  NSLog(@"IOS调试输出信息iosDebugInfo: %@", name);
  NSString *msg = [NSString stringWithFormat:@"RN传递过来的字符串：%@", s];
  [self showAlert:msg];
  
}

//清除wkwebview缓存
//- (void)clearWebCache {
RCT_EXPORT_METHOD(clearWebCache)
{
  if (@available(iOS 9.0, *)) {
    //allWebsiteDataTypes清除所有缓存
    dispatch_async(dispatch_get_main_queue(), ^{  // 跳转界面，在主线程进行UI操作
      NSSet *websiteDataTypes = [WKWebsiteDataStore allWebsiteDataTypes];
      NSDate *dateFrom = [NSDate dateWithTimeIntervalSince1970:0];
      [[WKWebsiteDataStore defaultDataStore] removeDataOfTypes:websiteDataTypes modifiedSince:dateFrom completionHandler:^{
        
      }];
    });
  }else { //iOS9以下 
    NSString *libraryPath = [NSSearchPathForDirectoriesInDomains(NSLibraryDirectory, NSUserDomainMask, YES) objectAtIndex:0];
    NSString *cookiesFolderPath = [libraryPath stringByAppendingString:@"/Cookies"];
    NSError *errors;
    [[NSFileManager defaultManager] removeItemAtPath:cookiesFolderPath error:&errors];
  }
}


//创建文件夹，将数据写成文件
- (BOOL)writeWalletFile:(NSString*)mydata
{
  NSFileManager *fileManager = [NSFileManager defaultManager];
//  NSString *document = [NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES) objectAtIndex:0];
//  NSString *folder = [document stringByAppendingPathComponent:@"et"];
  NSString *tmpPath = NSTemporaryDirectory();
  NSLog(@"folder: %@", tmpPath);
  NSString *filePath = [tmpPath stringByAppendingPathComponent:@"wallet.data"];
  if (![fileManager fileExistsAtPath:tmpPath]){
    BOOL blCreateFolder= [fileManager createDirectoryAtPath:tmpPath withIntermediateDirectories:NO attributes:nil error:NULL];
    if (blCreateFolder){
      NSLog(@"文件夹创建成功");
    }else {
      NSLog(@"文件夹创建失败");
      return NO;
    }
  }else{
    NSLog(@"文件夹已经存在");
  }

  NSData *data = [mydata dataUsingEncoding:NSUTF8StringEncoding];
  NSLog(@"data: %@", data);
  BOOL result = [data writeToFile:filePath atomically:YES];
  if (result) {
    NSLog(@"文件写入成功");
  }else{
    NSLog(@"文件写入失败");
  }
  
  return result;
}

//分享同步数据(shareFile)
RCT_EXPORT_METHOD(shareFile:(NSString *)myWalletData){
  NSLog(@"shareFileName: %@", myWalletData);
  BOOL blHave=[self writeWalletFile:myWalletData];//写入一个文件，然后发送
  if(blHave){
    NSString *tmpPath = NSTemporaryDirectory();
    NSString *filePath1=[tmpPath stringByAppendingPathComponent:@"wallet.data"];

    dispatch_async(dispatch_get_main_queue(), ^{  // 跳转界面，在主线程进行UI操作
      AppDelegate *appDele = (AppDelegate *)[UIApplication sharedApplication].delegate;
      RnViewController *rootViewController2 = (RnViewController*)appDele.window.rootViewController;
      [rootViewController2 shareClick:filePath1];
      [appDele.window makeKeyAndVisible];
    });
  }
}


////分享同步数据(shareFile)调试用
//RCT_EXPORT_METHOD(shareFile:(NSString *)myWalletData){
//  NSLog(@"shareFileName: %@", myWalletData);
//
//NSDictionary* resultDate = @{
//                             @"key" : @"WalletData",
//                             @"result": myWalletData,
//                             };
//dispatch_async(dispatch_get_main_queue(), ^{
//  [[NSNotificationCenter defaultCenter] postNotificationName:@"sendCustomEventNotification" object:self userInfo:resultDate];
//});
//
//}

//simpleWallet回调
RCT_EXPORT_METHOD(callbackToSimpleWallet:(int)status payPassword:(NSString *)data){
  NSLog(@"status: %d", status);
  NSLog(@"data: %@", data);
//  NSString *urlString =@"newdex://?action=login&result=1";
//  urlString = [urlString stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet URLQueryAllowedCharacterSet]];
  NSString *urlString = [data stringByAddingPercentEncodingWithAllowedCharacters:[NSCharacterSet URLQueryAllowedCharacterSet]];
  NSLog(@"urlString: %@", urlString);
  dispatch_async(dispatch_get_main_queue(), ^{  // 跳转界面，在主线程进行UI操作

    if([[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:urlString]]){
      if (@available(iOS 10.0, *)) {
        [[UIApplication sharedApplication] openURL:[NSURL URLWithString:urlString] options:@{} completionHandler:nil];
      } else {
        [[UIApplication sharedApplication] openURL:[NSURL URLWithString:urlString]];
      }
    }
  });
}

//保存密码
RCT_EXPORT_METHOD(savePayPassword:(NSString *)accountName payPassword:(NSString *)password  callback:(RCTResponseSenderBlock)callback){
    NSString *sflag =@"";
    if([[KeychainTool shareInstance] setAccount:accountName password:password]){
      sflag=@"YES";
    }
    callback(@[sflag]);//准备回调回去的数据
}

//获取密码
RCT_EXPORT_METHOD(getPayPassword:(NSString *)accountName callback:(RCTResponseSenderBlock)callback){

    NSString *pwd = [[KeychainTool shareInstance] getPasswordWithAccount:accountName];
    if(pwd){
//    callback(@[pwd]);//准备回调回去的数据
      NSLog(@"password %@",pwd);
    }else{
      pwd=@"";
      NSLog(@"not exist");
    }
    NSLog(@"pwd: %@", pwd);
    callback(@[pwd]);//准备回调回去的数据
}

//删除密码deleteKeychain
RCT_EXPORT_METHOD(deletePayPassword:(NSString *)accountName  callback:(RCTResponseSenderBlock)callback){
    NSString *sflag =@"";
    if([[KeychainTool shareInstance] deletePasswordWithAccount:accountName]){
//  NSLog(@"delete success");
      sflag=@"YES";
    }
    callback(@[sflag]);//准备回调回去的数据
}


//选择相册图片
RCT_EXPORT_METHOD(callCamera:(NSString *)key)
{
  dispatch_async(dispatch_get_main_queue(), ^{  // 跳转界面，在主线程进行UI操作
    AppDelegate *appDele = (AppDelegate *)[UIApplication sharedApplication].delegate;
    RnViewController *rootViewController2 = (RnViewController*)appDele.window.rootViewController;
    NSLog(@"rootViewController222 = %@",rootViewController2);
    [rootViewController2 choicePhoto:key];
    [appDele.window makeKeyAndVisible];
  });

}

//升级APP
RCT_EXPORT_METHOD(upgradeAPP:(NSString *)upgradeUrl){
  NSLog(@"升级APP: %@", upgradeUrl);
  dispatch_async(dispatch_get_main_queue(), ^{  // 跳转界面，在主线程进行UI操作
    if ([upgradeUrl hasPrefix:@"itms-services"]) {
      [[UIApplication sharedApplication] openURL:[NSURL URLWithString:upgradeUrl]];
    }
  });
}

//用来隐藏状态栏目和是否横屏的设置
RCT_EXPORT_METHOD(setIsLandscape:(NSString *)sHScreen){
  NSLog(@"RN接收传过来的sHScreen: %@", sHScreen);
  BOOL HScreen=false;
  if ([sHScreen isEqualToString:@"YES"]) {
    HScreen=true;
  }else{
    HScreen=false;
  }
//  allowRotation=HScreen;
  dispatch_async(dispatch_get_main_queue(), ^{  // 跳转界面，在主线程进行UI操作
    AppDelegate *appDele = (AppDelegate *)[UIApplication sharedApplication].delegate;
    RnViewController *rootViewController2 = (RnViewController*)appDele.window.rootViewController;
    NSLog(@"rootViewController222 = %@",rootViewController2);
    [rootViewController2 setHorizontalScreen:HScreen];
    [appDele.window makeKeyAndVisible];
  });
}
//用来隐藏状态栏目
RCT_EXPORT_METHOD(StatusHiddenFlag:(NSString *)sfullFlag){
  BOOL fullFlag=false;
  if ([sfullFlag isEqualToString:@"YES"]) {
    fullFlag=true;
  }
  dispatch_async(dispatch_get_main_queue(), ^{  // 跳转界面，在主线程进行UI操作
    AppDelegate *appDele = (AppDelegate *)[UIApplication sharedApplication].delegate;
    RnViewController *rootViewController2 = (RnViewController*)appDele.window.rootViewController;
    NSLog(@"rootViewController222 = %@",rootViewController2);
    [rootViewController2 statusShowOrHidden:fullFlag];
    [appDele.window makeKeyAndVisible];
  });
}

//用来设置状态栏的色彩
RCT_EXPORT_METHOD(setStatusBarStyle:(NSString *)barColor){
  NSLog(@"barColor:%@",barColor);
  BOOL barFlag=false;
  if ([barColor isEqualToString:@"YES"]) {
    barFlag=true;
  }
  dispatch_async(dispatch_get_main_queue(), ^{  // 跳转界面，在主线程进行UI操作
    AppDelegate *appDele = (AppDelegate *)[UIApplication sharedApplication].delegate;
    RnViewController *rootViewController2 = (RnViewController*)appDele.window.rootViewController;
    NSLog(@"rootViewController222 = %@",rootViewController2);
    [rootViewController2 changeStyle:barFlag];
    [appDele.window makeKeyAndVisible];
  });
}


//RCT_EXPORT_METHOD(addEventOne:(NSString *)name){
//  NSLog(@"接收传过来的NSString+NSString: %@", name);
//}

//接收来自RN的数据
RCT_EXPORT_METHOD(getDictionaryFromRN:(NSDictionary *)dict){
  NSLog(@"RN接收传过来的dict: %@", dict);
  //  let dict = {methodName:data, callback: str,resp:resp};
  NSString *methodName = [dict objectForKey:@"methodName"];
  NSString *callback = [dict objectForKey:@"callback"];
  NSString *resp = [dict objectForKey:@"resp"];
  
  //  NSString *rnData=@"{\"wallets\":{\"eos\":[{\"name\":\"chengengping\",\"address\":\"EOS8Af2FhdiVTZVvg2bL43JHaGx8gPzq5aBonXawUoQMzaCVA9jpS\",\"tokens\":{\"eos\":1.0778}}]}}";
  NSLog(@"接收传过来的resp: %@", resp);
  [[NSNotificationCenter defaultCenter] postNotificationName:rnNotification object:self userInfo:@{@"methodName":methodName,@"callback":callback,@"resp":resp}];
}


  //  对外提供调用方法,演示Callback
  RCT_EXPORT_METHOD(commSign:(NSString *)sigParam callback:(RCTResponseSenderBlock)callback)
  {
//    NSLog(@"%@",sigParam);
    NSString *newData = [NSString stringWithFormat:@"%@%@%@",@"3w5ioig890-ptgol`24@%&&***(", sigParam,@"&key=597063b7mc7411me9bfea7cd30a99b11a"];
//        NSLog(@"%@",newData);
//    NSArray *events=@[@"1", @"2", @"3",@"4"];
    NSString *signData =[NSString md5:newData];
//    NSLog(@"md5:%@",signData);//准备回调回去的数据
    callback(@[signData]);//准备回调回去的数据
  }


/// 接收通知的方法，接收到通知后发送事件到RN端。RN端接收到事件后可以进行相应的逻辑处理或界面跳转
- (void)sendCustomEvent:(NSNotification *)notification {
  
//  NSDictionary *dic = notification.userInfo;
//  NSDictionary *dicToRN = [dic objectForKey:@"requestInfo"];
//
//  NSLog(@"DAPP-view接收传过来的数据: %@", dicToRN);
//  [self sendEventWithName:kIosEventName body:dicToRN];
//  //  [self sendEventWithName:kIosEventName body:@"这是发给RN的字符串"];
  
  NSDictionary *codeInfo = notification.userInfo;
  NSLog(@"codeInfo: %@", codeInfo);
  NSString *key = [codeInfo objectForKey:@"key"];
  NSString *result = [codeInfo objectForKey:@"result"];
  NSLog(@"key: %@", key);
  NSLog(@"result: %@", result);
  
  if([key isEqualToString:@"WalletData"]){
    [self sendEventWithName:WalletDataEvent body:result];
  }else if([key isEqualToString:@"SimpleWallet"]){
    [self sendEventWithName:SimpleWalletEvent body:result];
  }
  else{
    [self sendEventWithName:kIosEventName body:codeInfo];
  }
  
//  NSLog(@"codeInfo:%@", notification);
//  [self sendEventWithName:kIosEventName body:notification];
}

/// 重写方法，定义支持的事件集合
- (NSArray<NSString *> *)supportedEvents {
  return @[kIosEventName,WalletDataEvent,SimpleWalletEvent];
}

/// 重写方法，定义常量
- (NSDictionary *)constantsToExport {
  return @{@"CustomConstant": @"我是iOS端定义的常量"};
}


- (void)showAlert:(NSString *)msg {
  dispatch_async(dispatch_get_main_queue(), ^{
    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"显示结果"
                                                    message:msg
                                                   delegate:nil
                                          cancelButtonTitle:nil
                                          otherButtonTitles:@"确定", nil];
    [alert show];
  });
}

@end
