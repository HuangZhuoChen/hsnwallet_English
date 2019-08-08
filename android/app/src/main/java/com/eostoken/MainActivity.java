package com.hsnwallet;

import android.content.pm.PackageManager;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.Manifest;
import android.os.Bundle;
import android.os.Build;
import android.widget.Toast;

import org.devio.rn.splashscreen.SplashScreen;
import com.facebook.react.ReactActivity;
import com.umeng.analytics.MobclickAgent;

import java.util.ArrayList;
import java.util.List;

import android.util.Log;
import android.content.Intent;
import android.net.Uri;

import com.hsnwallet.kylin.*;

public class MainActivity extends ReactActivity {
    private static final String TAG = "MainActivity";

    String[] permissions = new String[]{
        Manifest.permission.INTERNET,
        Manifest.permission.SYSTEM_ALERT_WINDOW,
        Manifest.permission.REQUEST_INSTALL_PACKAGES,
        Manifest.permission.WRITE_EXTERNAL_STORAGE,
        Manifest.permission.READ_EXTERNAL_STORAGE,
        Manifest.permission.CAMERA,
        Manifest.permission.VIBRATE,
        Manifest.permission.READ_PHONE_STATE
    };
    List<String> mPermissionList = new ArrayList<>();

    private final int mRequestCode = 100;//权限请求码

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "hsnwallet";
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        if(!"com.hsnwallet".equals(getPackageName())){
            return;
        };
        SplashScreen.show(this);  // here
        super.onCreate(savedInstanceState);
        MobclickAgent.setSessionContinueMillis(1000);
        MobclickAgent.setScenarioType(this, MobclickAgent.EScenarioType.E_DUM_NORMAL);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M)
        {
            initPermission();
        }

    }

     /**
     *
     * 重写此方法，加上setIntent(intent);否则在onResume里面得不到intent
     * @param intent intent
     */ 
    @Override 
    public void onNewIntent(Intent intent) 
    { 
        super.onNewIntent(intent); 
        setIntent(intent); 
    }

    @Override
    public void onStart() {
        super.onStart();
        try {
            Intent intent = getIntent();
            Uri uri = intent.getData();
            String url = uri.toString(); 
            // Log.d(TAG, "url: " + uri); 
            // scheme部分 
            String scheme = uri.getScheme(); 
            // Log.e(TAG, "scheme: " + scheme); 
            // host部分 
            String host = uri.getHost(); 
            // Log.d(TAG, "host: " + host); 
            //port部分 
            int port = uri.getPort(); 
            // Log.e(TAG, "host: " + port); 
            // 访问路劲 
            String path = uri.getPath(); 
            // Log.e(TAG, "path: " + path); 
            List<String> pathSegments = uri.getPathSegments(); 
            // Query部分 
            String query = uri.getQuery(); 
            // Log.e(TAG, "query: " + query); 
            //获取指定参数值 
            String param = uri.getQueryParameter("param"); 
            // Log.e(TAG, "param: " + param);
    
            String packageName = intent.getStringExtra("packageName");
            String className = intent.getStringExtra("className");
            String time = intent.getStringExtra("time");
            // Log.d(TAG, "packageName: " + packageName);
            // Log.d(TAG, "className: " + className);
            // Log.d(TAG, "time: " + time+":"+KylinModule.getTime());
            // Log.d(TAG, "param: " + param);

            if((time != null) && (time.equals(KylinModule.getTime()))){
                return;
            }
            KylinModule.setActivity(this);
            KylinModule.setCallerPackage(packageName);
            KylinModule.setCallerClass(className);
            KylinModule.setTime(time);
            KylinModule.setData(param); 
            if(KylinModule.getListenCompleteFlag()){ // app已经加载完直接拉起js页面， app没加载完时则先保存数据，等app加载完后再拉起js页面
                KylinModule.sendRnEvent(param); 
            }
        } catch (Exception e) {
            Log.d(TAG, "e: " + e); 
        }
    }
    @Override
    public void onResume() {
        super.onResume();
        MobclickAgent.onResume(this);
    }

    @Override
    protected void onPause() {
        super.onPause();
        MobclickAgent.onPause(this);
    }

    @Override
    protected void onDestroy() {
        KylinModule.setData(null); 
        super.onDestroy();
    }
    //Android 6.0以上系统，AndroidManifest.xml配置的权限判断和申请 
     private void initPermission()
     {
        mPermissionList.clear();//清空没有通过的权限 

        //逐个判断你要的权限是否已经通过 
        for (int i = 0; i < permissions.length; i++) { 
            if (ContextCompat.checkSelfPermission(this, permissions[i]) != PackageManager.PERMISSION_GRANTED) { 
                mPermissionList.add(permissions[i]);//添加还未授予的权限 
            } 
        } 
        //申请权限 
        if (mPermissionList.size() > 0) {//有权限没有通过，需要申请 
            String[] tmp_permissions = mPermissionList.toArray(new String[mPermissionList.size()]);//将List转为数组
            ActivityCompat.requestPermissions(this, tmp_permissions, mRequestCode); 
        }else{ 
            //说明权限都已经通过，可以做你想做的事情去 
        } 
    }

    @Override 
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, 
                                                @NonNull int[] grantResults) { 
         
            boolean hasPermissionDismiss = false;//有权限没有通过 
            if (mRequestCode == requestCode) { 
                for (int i = 0; i < grantResults.length; i++) { 
                    if (grantResults[i] != PackageManager.PERMISSION_GRANTED) { 
                        // hasPermissionDismiss = true; 
                        //判断是否勾选禁止后不再询问
                        // boolean showRequestPermission = ActivityCompat.shouldShowRequestPermissionRationale(this, permissions[i]);
                        // if (showRequestPermission) {
                        //     Toast.makeText(MainActivity.this,"权限未申请",Toast.LENGTH_SHORT).show();
                        // }
                    } 
                } 
                // //如果有权限没有被允许 
                // if (hasPermissionDismiss) { 
                //     // showPermissionDialog();//跳转到系统设置权限页面，或者直接关闭页面，不让他继续访问 
                //     // Toast.makeText(MainActivity.this,"hasPermissionDismiss",Toast.LENGTH_SHORT).show();
                // }else{ 
                //     //全部权限通过，可以进行下一步操作。。。 
                // } 
            } 
            super.onRequestPermissionsResult(requestCode, permissions, grantResults); 
    }
}
