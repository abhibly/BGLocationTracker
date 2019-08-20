import { Component, ChangeDetectorRef } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Plugins } from '@capacitor/core';
import { LocationAPIService } from './service/location-api.service';
const { App, Storage, Geolocation } = Plugins;
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  // tslint:disable-next-line:no-inferrable-types
  IsTrackingEnabled: boolean = false;
  intervalId: any;
  constructor(
    private platform: Platform,
    public changeDetector: ChangeDetectorRef,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar, public locAPI: LocationAPIService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  StartTracking() {
    this.EnableTracking().then((Enabled: boolean) => {
      if (Enabled) {
        this.IsTrackingEnabled = true;
        this.CaptureAndSubscribe();
      }
    });
  }

  EnableTracking() {
    return new Promise((resolve, reject) => {
      Storage.set({ key: 'TrackingEnabled', value: 'yes' }).then(() => {
        resolve(true);
      });
    });
  }

  CaptureAndSubscribe() {
    this.GetCurrentLocation();
    this.SubscribeIntervals();
  }

  GetCurrentLocation() {
    Geolocation.getCurrentPosition({ timeout: 60000, enableHighAccuracy: true }).then((position: any) => {
      this.changeDetector.detectChanges();
      // tslint:disable-next-line:prefer-const
      let LocationInfo: any = {
        Latitude: position.coords.latitude,
        Longitude: position.coords.longitude,
        LocDt: new Date()
      };
      this.SaveLocation(LocationInfo);
      this.changeDetector.detectChanges();
    });
  }

  SaveLocation(Location: any) {
    return new Promise((resolve, reject) => {
      this.locAPI.SaveLocation(Location).subscribe((locationInfo: any) => {
        resolve(true);
      },
        (error) => {
          resolve(false);
        });
    });
  }

  SubscribeIntervals() {
    clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      this.GetCurrentLocation();
    }, (1000 * 60 * 5));
  }

  StopTracking() {
    this.DisableTracking().then((disabled: boolean) => {
      if (disabled) {
        clearInterval(this.intervalId);
        this.IsTrackingEnabled = false;
      }
    });
  }

  DisableTracking() {
    return new Promise((resolve, reject) => {
      Storage.remove({ key: 'TrackingEnabled' }).then(() => {
        resolve(true);
      });
    });
  }
}
