an eos wallet


## Build project:<br> 
cd hsn_Wallet <br> 
npm i <br> 

### fix react-native build error:<br>
修改： /node_modules/react-native/local-cli/runIOS/findMatchingSimulator.js <br>
42行 error:<br>
``` javascript
if (!version.startsWith('iOS') && !version.startsWith('tvOS'))
```
correct:<br>
``` javascript
if (!version.startsWith('com.apple.CoreSimulator.SimRuntime.iOS') && !version.startsWith('com.apple.CoreSimulator.SimRuntime.tvOS'))
```
### run ios:<br>
在xcode里面点击run



### fix react-native-device-info build error:<br>
修改： node_modules\react-native-device-info\android\src\main\java\com\learnium\RNDeviceInfo/RNDeviceModule.java 
390行 error:<br>
``` javascript
@ReactMethod
  public void isLocationEnabled(Promise p) {
      boolean locationEnabled = false;

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
        LocationManager mLocationManager = (LocationManager) reactContext.getApplicationContext().getSystemService(Context.LOCATION_SERVICE);
        locationEnabled = mLocationManager.isLocationEnabled();
      } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
        int locationMode = Settings.Secure.getInt(reactContext.getContentResolver(), Settings.Secure.LOCATION_MODE, Settings.Secure.LOCATION_MODE_OFF);
        locationEnabled = locationMode != Settings.Secure.LOCATION_MODE_OFF;
      } else {
        String locationProviders = Settings.Secure.getString(reactContext.getContentResolver(), Settings.Secure.LOCATION_PROVIDERS_ALLOWED);
        locationEnabled = !TextUtils.isEmpty(locationProviders);
      }

      p.resolve(locationEnabled);
  }
```
修改为:
``` javascript
@ReactMethod
  public void isLocationEnabled(Promise p) {
      boolean locationEnabled = false;

      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
        //LocationManager mLocationManager = (LocationManager) reactContext.getApplicationContext().getSystemService(Context.LOCATION_SERVICE);
        //locationEnabled = mLocationManager.isLocationEnabled();
      } else if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
        int locationMode = Settings.Secure.getInt(reactContext.getContentResolver(), Settings.Secure.LOCATION_MODE, Settings.Secure.LOCATION_MODE_OFF);
        locationEnabled = locationMode != Settings.Secure.LOCATION_MODE_OFF;
      } else {
        String locationProviders = Settings.Secure.getString(reactContext.getContentResolver(), Settings.Secure.LOCATION_PROVIDERS_ALLOWED);
        locationEnabled = !TextUtils.isEmpty(locationProviders);
      }

      p.resolve(locationEnabled);
  }
```
### run android:<br>
react-native run-android



### 环境
npm version:3.10.10 <br>
node version:v6.11.2 <br>
gradle:2.2.3 <br>

