package com.hsnwallet.utils;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;

import android.telephony.TelephonyManager;

import android.os.Build;
import android.os.Handler;
import android.app.Activity;
import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.content.res.Configuration;
import android.util.Base64;
import android.util.Log;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.graphics.Color;

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
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import android.widget.Toast;

import org.json.JSONException;
import org.json.JSONObject;
import de.greenrobot.event.EventBus;

import java.math.BigInteger;
import java.security.NoSuchAlgorithmException;
import java.util.Stack;
import java.util.logging.LogManager;
import java.security.MessageDigest;

import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import android.support.annotation.NonNull;
import android.support.annotation.RequiresApi;

import java.io.IOException;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.UnrecoverableEntryException;
import java.security.cert.CertificateException;
import java.security.SignatureException;

import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.KeyGenerator;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;


public class UtilModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext context;

    private static final String TRANSFORMATION = "AES/GCM/NoPadding";
    private static final String ANDROID_KEY_STORE = "AndroidKeyStore";
    private static String TAG = "UtilModule";
    private static String result = "";
    private static Encryptor encryptor;
    private static Decryptor decryptor;

    public UtilModule(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;

        try {
            encryptor = new Encryptor();
            decryptor = new Decryptor();
        } catch (Exception e) {
            //TODO: handle exception
        }
    }

    @Override
    public String getName() {
        return "UtilModule";
    }
    
    //获取永久免密的密码
    @ReactMethod
    public void getPayPassword(String account,Callback callback){
        try {
            String factor = getEncryptionFactor(account);
            String encrypt_account = encryptAES(factor,account);
    
            SharedPreferences sharedPreferences= context.getSharedPreferences(getSPFileName(),Activity.MODE_PRIVATE);
            String encrypt_password = sharedPreferences.getString(encrypt_account,"");
            String decrypt_password;
            if(encrypt_password == null || encrypt_password == ""){
                decrypt_password = "";
            }else{
                decrypt_password = decryptAES(factor,encrypt_password);
            }
            
            // Log.d(TAG, "account=" + account + " encrypt_password="+encrypt_password + " decrypt_password="+decrypt_password);
            //  Toast.makeText(context,"getPayPassword0=" + factor + " encrypt_account=" + encrypt_account + " encrypt_password="+encrypt_password + " decrypt_password="+decrypt_password, Toast.LENGTH_LONG).show();
            if(callback != null) 
            {
                callback.invoke(decrypt_password);
            }
        } catch (Exception e) {
            //TODO: handle exception
            e.printStackTrace();
            if(callback != null) 
            {
                callback.invoke("");
            }
        }
    }
    //保存永久密码
    @ReactMethod
    public void savePayPassword(String account,String password){
        try {
            String factor = getEncryptionFactor(account);
            String encrypt_account = encryptAES(factor,account);
            String encrypt_password = encryptAES(factor,password);
            
            SharedPreferences sharedPreferences= context.getSharedPreferences(getSPFileName(),Activity.MODE_PRIVATE);
            SharedPreferences.Editor editor = sharedPreferences.edit();
            editor.putString(encrypt_account, encrypt_password);
            editor.commit();
            // Log.d(TAG, "account=" + account + " encrypt_password="+encrypt_password);
            // Toast.makeText(context,"savePayPassword0=" + factor + " encrypt_account=" + encrypt_account + " encrypt_password="+encrypt_password, Toast.LENGTH_LONG).show();
        } catch (Exception e) {
            //TODO: handle exception
            e.printStackTrace();
        }
    }
    @ReactMethod
    public void deletePayPassword(String account){
        try {
            String factor = getEncryptionFactor(account);
            String encrypt_account = encryptAES(factor,account);
    
            SharedPreferences sharedPreferences= context.getSharedPreferences(getSPFileName(),Activity.MODE_PRIVATE);
            SharedPreferences.Editor editor = sharedPreferences.edit();
            editor.putString(encrypt_account, "");
            editor.commit();
            // Toast.makeText(context,"savePayPassword0=" + factor + " encrypt_account=" + encrypt_account, Toast.LENGTH_LONG).show();
        } catch (Exception e) {
            //TODO: handle exception
            e.printStackTrace();
        }
    }
    private String getSPFileName()
    {
        // String deviceid = getDeviceId();
        // if(deviceid == null || deviceid == ""){
        //     deviceid = "_24@%&&***(";
        // }
        // String encrypt_name = encryptAES(deviceid,deviceid);
        // if(encrypt_name == null || encrypt_name == "")
        // {
        //     encrypt_name = "a7cfb896";
        // }
        // return encrypt_name;
        return "a7cfb896";// 小米8手机加密后有"/"出现，文件名报错，无法保存,故文件名不加密
    }
    private String getEncryptionFactor(String account){
        String deviceid = getDeviceId();
        if(deviceid == null){
            deviceid = "";
        }
        String factor = "3w5ioig890-ptgol`24@%&&***("+deviceid + account + "&key="+"597063b7mc7411me9bfea7cd30a99b11a";
        return factor;
    }
    private String getDeviceId(){
        String tac = "";
        try {
            final TelephonyManager manager = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);
            if(manager.getDeviceId() == null || manager.getDeviceId().equals("")) {
                if (Build.VERSION.SDK_INT >= 23) {
                    tac = manager.getDeviceId(0);
                    if(tac == null || tac == ""){
                        tac = manager.getDeviceId(1);
                    }
                }
            }else{
                tac = manager.getDeviceId();
            }
        }catch (Exception e)
        {
            e.printStackTrace();
        }
        return tac;
    }
    private String encryptAES(String AES_KEY,String content){
        try {
            return AES256.encrypt(AES_KEY, content);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }
    private String decryptAES(String AES_KEY,String content){
        try {
            return AES256.decrypt(AES_KEY, content);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }


    class Encryptor {
    
        private byte[] encryption;
        private byte[] iv;
    
        Encryptor() {
        }
    
        @RequiresApi(api = Build.VERSION_CODES.M)
        byte[] encryptText(final String alias, final String textToEncrypt)
                throws UnrecoverableEntryException, NoSuchAlgorithmException, KeyStoreException,
                NoSuchProviderException, NoSuchPaddingException, InvalidKeyException, IOException,
                InvalidAlgorithmParameterException, SignatureException, BadPaddingException,
                IllegalBlockSizeException {
    
            final Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            cipher.init(Cipher.ENCRYPT_MODE, getSecretKey(alias));
    
            iv = cipher.getIV();
    
            return (encryption = cipher.doFinal(textToEncrypt.getBytes("UTF-8")));
        }
    
        @RequiresApi(api = Build.VERSION_CODES.M)
        @NonNull
        private SecretKey getSecretKey(final String alias) throws NoSuchAlgorithmException,
                NoSuchProviderException, InvalidAlgorithmParameterException {
    
            final KeyGenerator keyGenerator = KeyGenerator
                    .getInstance(KeyProperties.KEY_ALGORITHM_AES, ANDROID_KEY_STORE);
    
            keyGenerator.init(new KeyGenParameterSpec.Builder(alias,
                    KeyProperties.PURPOSE_ENCRYPT | KeyProperties.PURPOSE_DECRYPT)
                    .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                    .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                    .build());
    
            return keyGenerator.generateKey();
        }
    
        byte[] getEncryption() {
            return encryption;
        }
    
        byte[] getIv() {
            return iv;
        }
    }

    class Decryptor {
    
        private KeyStore keyStore;
    
        Decryptor() throws CertificateException, NoSuchAlgorithmException, KeyStoreException,
                IOException {
            initKeyStore();
        }
    
        private void initKeyStore() throws KeyStoreException, CertificateException,
                NoSuchAlgorithmException, IOException {
            keyStore = KeyStore.getInstance(ANDROID_KEY_STORE);
            keyStore.load(null);
        }
    
        @RequiresApi(api = Build.VERSION_CODES.KITKAT)
        String decryptData(final String alias, final byte[] encryptedData, final byte[] encryptionIv)
                throws UnrecoverableEntryException, NoSuchAlgorithmException, KeyStoreException,
                NoSuchProviderException, NoSuchPaddingException, InvalidKeyException, IOException,
                BadPaddingException, IllegalBlockSizeException, InvalidAlgorithmParameterException {
    
            final Cipher cipher = Cipher.getInstance(TRANSFORMATION);
            final GCMParameterSpec spec = new GCMParameterSpec(128, encryptionIv);
            cipher.init(Cipher.DECRYPT_MODE, getSecretKey(alias), spec);
    
            return new String(cipher.doFinal(encryptedData), "UTF-8");
        }
    
        private SecretKey getSecretKey(final String alias) throws NoSuchAlgorithmException,
                UnrecoverableEntryException, KeyStoreException {
            return ((KeyStore.SecretKeyEntry) keyStore.getEntry(alias, null)).getSecretKey();
        }
    }

  
    @ReactMethod
    public void StatusHiddenFlag(String flag){
        UiThreadUtil.runOnUiThread(
            new Runnable() {
                @Override
                public void run() {
                    if(flag.equals("YES")){
                    // getCurrentActivity().getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_FULLSCREEN);
                    // getCurrentActivity().getWindow().getDecorView().setSystemUiVisibility(
                    //         View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                    //                 | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                    //                 | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                    //                 | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION // hide nav bar
                    //                 | View.SYSTEM_UI_FLAG_FULLSCREEN // hide status bar
                    //                 | View.SYSTEM_UI_FLAG_IMMERSIVE
                    // );
                        getCurrentActivity().getWindow().addFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
                        getCurrentActivity().getWindow().clearFlags(WindowManager.LayoutParams.FLAG_FORCE_NOT_FULLSCREEN);
                    }else{
                        // getCurrentActivity().getWindow().getDecorView().setSystemUiVisibility(
                        //     View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                        //             | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                        //             | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
                        // );
                        getCurrentActivity().getWindow().addFlags(WindowManager.LayoutParams.FLAG_FORCE_NOT_FULLSCREEN);
                        getCurrentActivity().getWindow().clearFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN);
                    }
                }
            }
        );
    }
    @ReactMethod
    public void setIsLandscape(final String flag) {
        UiThreadUtil.runOnUiThread(
            new Runnable() {
                @Override
                public void run() {
                    if(flag.equals("YES")){ 
                        int orientationInt = context.getResources().getConfiguration().orientation;
                        if(orientationInt == Configuration.ORIENTATION_PORTRAIT)
                        {
                            getCurrentActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);//横屏
                        }
                    }else{
                        getCurrentActivity().setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);//竖屏 
                    }
                }
            }
        );
    }

    @ReactMethod
    public void setStatusBarStyle(final String flag) {
        UiThreadUtil.runOnUiThread(
            new Runnable() {
                @Override
                public void run() {
                    try{
                        Activity currentActivity = getCurrentActivity();
                        if(null!=currentActivity){
                            boolean useDark = true;
                            if(flag.equals("YES")){
                                useDark = false;
                            }
                            ScreenUtil.setStatusTextColor(useDark, currentActivity);
                        }
                    }catch(Exception e){
            
                        throw new JSApplicationIllegalArgumentException(
                                "does not open activity: "+e.getMessage());
                    }

                    // getCurrentActivity().getWindow().addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS); 
                    // if(flag.equals("YES")){ 
                    //     // 设置为 白色
                    //     int color = Color.parseColor("#FFFFFF");
                    //      getCurrentActivity().getWindow().setStatusBarColor(color);
                    // }else{
                    //      int color = Color.parseColor("#323232");
                    //      getCurrentActivity().getWindow().setStatusBarColor(color);
                    // }
                }
            }
        );
    }
    
    @ReactMethod
    public void isNotchScreen(Callback callback){
        callback.invoke(ScreenUtil.hasNotchScreen(context));
    }

    @ReactMethod
    public void commSign(String data, Callback callback){
        callback.invoke(stringToMD5("3w5ioig890-ptgol`24@%&&***("+data+"&key="+"597063b7mc7411me9bfea7cd30a99b11a"));
    }

    public String stringToMD5(String plainText) {
        byte[] secretBytes = null;
        try {
            secretBytes = MessageDigest.getInstance("md5").digest( plainText.getBytes());
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("md5 algorithm error");
        }
        String md5code = new BigInteger(1, secretBytes).toString(16);
        for (int i = 0; i < 32 - md5code.length(); i++) {
            md5code = "0" + md5code;
        }
        return md5code;
    }
}
