һ��windows  android virtual manager���Է���
1.����avd ģ����������debug device, Enable Reomot Debug;
2.D:\work\eostokenwallet\wallet>adb reverse tcp:8081  tcp:8081
3.����ʱ���ֹ�ɾ�� wallet/android/app/build Ŀ¼ ����������
  react-native start
���� launch.json �� .vscodeĿ¼

4.vscode ����debug �������м���.  

�����������ݿ��ļ�
adb pull  /sdcard/testPromise.db


windows ����8081
netstat -aon|findstr "8081"
taskkill -PID 1232 -F