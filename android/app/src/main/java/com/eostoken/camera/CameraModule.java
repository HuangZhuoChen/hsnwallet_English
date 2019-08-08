package com.hsnwallet.camera;
import android.content.ContentResolver;
import android.os.AsyncTask;
import android.os.Handler;
import android.os.Bundle;
import android.app.Activity;
import android.content.Intent;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Log;
import android.net.Uri;
import android.os.Environment;
import android.provider.DocumentsContract;
import android.provider.MediaStore;
import android.provider.Settings;


import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;
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
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.Promise;

import cn.bingoogolapple.qrcode.zxing.QRCodeDecoder;

import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;


import java.io.FileNotFoundException;


/**
 * Created by wangfei on 17/8/28.
 */

public class CameraModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext context;
    private final  int REQUEST_ECODE_SCAN=100;
    private String key = "";

    public CameraModule(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
        context.addActivityEventListener(mActivityEventListener);
    }

    @Override
    public String getName() {
        return "CameraModule";
    }
    @ReactMethod
    public void callCamera(String key){
        this.key = key;
        new Handler().post(new Runnable(){
            @Override
            public void run() {
                try {
                    Activity currentActivity = getCurrentActivity();
                    if (currentActivity == null) {
                        return;
                    }
                    Intent intent = new Intent(Intent.ACTION_PICK, android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
                    currentActivity.startActivityForResult(intent, REQUEST_ECODE_SCAN);
                } catch (Exception e) {
                    throw new JSApplicationIllegalArgumentException("open activity fail: " + e.getMessage());
                }
            }
        });
    }
    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() 
    {
         @Override 
         public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) 
         {
              if(requestCode == REQUEST_ECODE_SCAN)
              { 
                  if (resultCode == Activity.RESULT_CANCELED) 
                  { 

                  }else if(resultCode == Activity.RESULT_OK && data.getData()!=null){ 
                    Uri selectedImage = data.getData();
                    new AsyncTask<Void, Void, String>() {
                        @Override
                        protected String doInBackground(Void... params) {
                            String result = "";
                            try {
                                ContentResolver cr = context.getContentResolver();
                                Bitmap bmp = BitmapFactory.decodeStream(cr.openInputStream(selectedImage));
        
                                result = QRCodeDecoder.syncDecodeQRCode(bmp);
                            } catch (FileNotFoundException e) {
                                e.printStackTrace();
                            }  

                            // String[] filePathColumns = {MediaStore.Images.Media.DATA};
                            // String imagePath="";
                            // Cursor c = context.getContentResolver().query(selectedImage, filePathColumns, null, null, null);
                            // if (c != null) {
                            //     c.moveToFirst();
                            //     int columnIndex = c.getColumnIndex(filePathColumns[0]);
                            //     imagePath = c.getString(columnIndex);
                            //     c.close();
                            //     Bitmap bm = BitmapFactory.decodeFile(imagePath);
                            //     result = QRCodeDecoder.syncDecodeQRCode(bm);
                            // } 
                            return result;
                        }
            
                        @Override
                        protected void onPostExecute(String result) {
                            if (result == null || result == "") {
                                Toast.makeText(context, "parse fail", Toast.LENGTH_SHORT).show();
                            } else {
                                try {
                                    JSONObject object = new JSONObject();
                                    object.put("key", key);
                                    object.put("result", result);
                                    context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("CallToRN", object.toString());
                                } catch (Exception e) {
                                    //TODO: handle exception
                                    Toast.makeText(context, "parse error", Toast.LENGTH_SHORT).show();
                                }
                            }
                        }
                    }.execute();
                   
                  }else{ 

                  } 
              } 
        } 
    };
   
}