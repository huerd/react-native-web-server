package com.reactnativewebserver.AppWebServer;

import android.util.Log;

import java.util.List;
import java.util.ArrayList;
import java.util.concurrent.Callable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.Callback;
import com.facebook.react.modules.core.RCTNativeAppEventEmitter;
import com.facebook.react.bridge.Promise;

import bolts.Continuation;
import bolts.Task;
import webserver.Webserver;

public class AppWebServerModule extends ReactContextBaseJavaModule {

    public AppWebServerModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @ReactMethod
    public void start(final String fileDir, final Promise promise) {
        Log.d("NativeModule", "start()");
        Task.call(new Callable<String>() {
            @Override
            public String call() throws Exception {
                Webserver.setConfig(fileDir, true);
                return Webserver.start();
            }
        }, Task.BACKGROUND_EXECUTOR).continueWith(new Continuation<String, Object>() {
            @Override
            public Object then(Task<String> task) throws Exception {
                if (task.getError() != null) {
                    promise.reject(task.getError().toString());
                    return null;
                }
                promise.resolve(task.getResult());
                return null;
            }
        }, Task.UI_THREAD_EXECUTOR);
    }

    @ReactMethod
    public void isRunning(final Promise promise) {
        Log.d("NativeModule", "isRunning");
        Task.call(new Callable<Boolean>() {
            @Override
            public Boolean call() throws Exception {
                return Webserver.isRunning();
            }
        }, Task.BACKGROUND_EXECUTOR).continueWith(new Continuation<Boolean, Object>() {
            @Override
            public Object then(Task<Boolean> task) throws Exception {
                if (task.getError() != null) {
                    promise.reject(task.getError().toString());
                    return null;
                }
                promise.resolve(task.getResult());
                return null;
            }
        }, Task.UI_THREAD_EXECUTOR);
    }

    @ReactMethod
    public void url(final Promise promise) {
        Log.d("NativeModule", "url()");
        Task.call(new Callable<String>() {
            @Override
            public String call() throws Exception {
                return Webserver.url();
            }
        }, Task.BACKGROUND_EXECUTOR).continueWith(new Continuation<String, Object>() {
            @Override
            public Object then(Task<String> task) throws Exception {
                if (task.getError() != null) {
                    promise.reject(task.getError());
                    return null;
                }
                promise.resolve(task.getResult());
                return null;
            }
        }, Task.UI_THREAD_EXECUTOR);
    }

    @ReactMethod
    public void stop(final Promise promise) {
        Log.d("NativeModule", "serverUrl()");
        Task.call(new Callable<Object>() {
            @Override
            public Object call() throws Exception {
                Webserver.stop();
                return null;
            }
        }, Task.BACKGROUND_EXECUTOR).continueWith(new Continuation<Object, Object>() {
            @Override
            public Object then(Task<Object> task) throws Exception {
                promise.resolve(null);
                return null;
            }
        }, Task.UI_THREAD_EXECUTOR);
    }

    @Override
    public String getName() {
        return "AppWebServer";
    }
}
