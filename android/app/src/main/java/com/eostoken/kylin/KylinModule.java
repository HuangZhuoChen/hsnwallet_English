package com.hsnwallet.kylin;

import android.os.Handler;
import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.JSApplicationIllegalArgumentException;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableNativeMap;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.Callback;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;

import android.net.Uri;
import android.util.Base64;

import android.content.ComponentName;

public class KylinModule extends ReactContextBaseJavaModule{
    private static final String TAG = "KylinModule";

    private static ReactApplicationContext context;
    private static String callerPackage = null;
    private static String callerClass = "com.hsnwallet.opensdk.simple.ETAssistActivity";
    private static String data = null;
    private static String time = "";
    private static Activity activity = null;
    private static boolean listenComplete = false;
    public KylinModule(ReactApplicationContext reactContext){
        super(reactContext);
        context = reactContext;
    }

    @Override
    public String getName() {
        return "KylinModule";
    }
    
    public static void sendRnEvent(String data){
        context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("app_pull", data);
    }

    public static void setCallerPackage(String callerPackage){
        KylinModule.callerPackage = callerPackage;
    }

    public static void setCallerClass(String callerClass){
        KylinModule.callerClass = callerClass;
    }

    public static void setData(String data){
        KylinModule.data = data;
    }

    public static void setTime(String time){
        KylinModule.time = time;
    }

    public static String getTime(){
        return KylinModule.time;
    }

    public static void setActivity(Activity activity){
        KylinModule.activity = activity;
    }

    public static boolean getListenCompleteFlag(){
        return listenComplete;
    }

    @ReactMethod
    public void onListenComplete(){
        listenComplete = true;
        if(KylinModule.data == null){
            return;
        }
        sendRnEvent(KylinModule.data);
    }

    @ReactMethod
    public void callbackToKylinCaller(int status, String data){
        try {
            if(activity != null){
                activity.moveTaskToBack(true);
            }
            
            Intent intent = new Intent();
            if(status == 4){ // 状态为4表示是要callback 拉起第三方dapp，则通过simple wallet回调的方式进行回调
                intent.setData(getParamUri(data));
                intent.setAction(Intent.ACTION_VIEW);
                intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                context.startActivity(intent);
                return;
            }

            if(callerPackage == null || callerClass == null){
                return;
            }
            intent.putExtra("status", status);
            intent.putExtra("result", data);
            //拼凑uri
            // intent.setData(getParamUri(data));
            // intent.setAction(Intent.ACTION_VIEW);
            //保证新启动的APP有单独的堆栈，如果希望新启动的APP和原有APP使用同一个堆栈则去掉该项
            intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            ComponentName cn=new ComponentName(callerPackage, callerClass);
            intent.setComponent(cn);
            context.startActivity(intent);
        } catch (Exception e) {
            e.printStackTrace();
        }
        KylinModule.data = null;
    }

    /**
     * 拼凑要传递数据的uri
    */
    private Uri getParamUri(String data) {
        //将param encode处理
        // String temp = "et_sdk_kylin://et.callback" + "?params=" + base64Encode(data);
        return Uri.parse(data);
    }

        /**
     * Base64加密,指定utf-8编码
     */
    public static String base64Encode(String content) {
        try {
            return Base64.encodeToString(content.getBytes("utf-8"), Base64.NO_WRAP);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }
}