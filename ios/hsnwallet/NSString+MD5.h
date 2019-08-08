//
//  NSString+MD5.h
//  hsnwallet
//
//  Created by xyg on 20/11/18.
//  Copyright © 2018年 Facebook. All rights reserved.
//

/**
 *  md5加密
 *
 */

#import <Foundation/Foundation.h>

@interface NSString (MD5)
/**
 *  md5加密的字符串
 *
 *  @param str
 *
 *  @return
 */
+ (NSString *) md5:(NSString *) str;

@end


