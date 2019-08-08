package com.hsnwallet;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import com.bolan9999.SpringScrollViewPackage;
import com.AlexanderZaytsev.RNI18n.RNI18nPackage;
import com.rnfs.RNFSPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import org.devio.rn.splashscreen.SplashScreenReactPackage;
import com.hieuvp.fingerprint.ReactNativeFingerprintScannerPackage;
import com.theweflex.react.WeChatPackage;
import fr.greweb.reactnativeviewshot.RNViewShotPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.lenny.modules.upgrade.UpgradeReactPackage;
import com.tradle.react.UdpSocketsModule;
import com.peel.react.TcpSocketsModule;
import com.horcrux.svg.SvgPackage;
import com.reactnativecomponent.barcode.RCTCapturePackage;
import com.bitgo.randombytes.RandomBytesPackage;
import com.peel.react.rnos.RNOSModule;
import com.BV.LinearGradient.LinearGradientPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import cn.jpush.reactnativejpush.JPushPackage;
import com.microsoft.codepush.react.CodePush;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import java.util.Arrays;
import java.util.List;
import com.hsnwallet.umeng.DplusReactPackage;
import com.hsnwallet.umeng.RNUMConfigure;
import com.umeng.commonsdk.UMConfigure;
import com.hsnwallet.opensettings.*; 
import com.hsnwallet.utils.*; 
import com.hsnwallet.camera.*;
import com.hsnwallet.kylin.*;
import org.pgsqlite.SQLitePluginPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
public class MainApplication extends Application implements ReactApplication {

    private ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
        }

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                new MainReactPackage(),
            new PickerPackage(),
                new FastImageViewPackage(),
                new SpringScrollViewPackage(),
                new RNI18nPackage(),
                new RNFSPackage(),
                new RNCWebViewPackage(),
                new ReactNativeFingerprintScannerPackage(),
                new WeChatPackage(),
                new RNViewShotPackage(),
                new VectorIconsPackage(),
                new UpgradeReactPackage(),
                new UdpSocketsModule(),
                new TcpSocketsModule(),
                new SvgPackage(),
                new SplashScreenReactPackage(),
                new RCTCapturePackage(),
                new RandomBytesPackage(),
                new RNOSModule(),
                new RNGestureHandlerPackage(),
                new RNDeviceInfo(),
                new JPushPackage(!BuildConfig.DEBUG, !BuildConfig.DEBUG),
                new LinearGradientPackage(),
                new OpenSettingsPackage(), /* setting add */
                new DplusReactPackage(),
                new UtilPackage(),
                new CameraPackage(),
                new KylinPackage(),
                new SQLitePluginPackage(),
                new CodePush(BuildConfig.CODEPUSH_KEY, MainApplication.this, BuildConfig.DEBUG, BuildConfig.CODEPUSH_SERVER_URL)
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    public void setReactNativeHost(ReactNativeHost reactNativeHost) {
        mReactNativeHost = reactNativeHost;
    }

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
        // RNUMConfigure.init(this, "5abddfbab27b0a2e67000011", "Umeng", UMConfigure.DEVICE_TYPE_PHONE,"");
    }

}
