import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";
import { HttpClientModule } from "@angular/common/http";

import { MyApp } from "./app.component";
import { StatusBar } from "@ionic-native/status-bar";
import { DataProvider } from "../providers/data/data";
import { IonicStorageModule } from "@ionic/storage";
import { ScreenOrientation } from "@ionic-native/screen-orientation";
import { AdMobFree } from "@ionic-native/admob-free";

@NgModule({
  declarations: [MyApp],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp],
  providers: [
    StatusBar,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    DataProvider,
    ScreenOrientation,
    AdMobFree
  ]
})
export class AppModule {}
