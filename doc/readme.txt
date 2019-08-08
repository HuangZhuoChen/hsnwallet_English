一。windows  android virtual manager调试方法
1.启动avd 模拟器，设置debug device, Enable Reomot Debug;
2.D:\work\eostokenwallet\wallet>adb reverse tcp:8081  tcp:8081
3.报错时，手工删除 wallet/android/app/build 目录 重新启动。
  react-native start
复制 launch.json 到 .vscode目录

4.vscode 启动debug 下载运行即可.  

二。导出数据库文件
adb pull  /sdcard/testPromise.db


windows 查找8081
netstat -aon|findstr "8081"
taskkill -PID 1232 -F