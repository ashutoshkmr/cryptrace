import { Component, ViewChild } from "@angular/core";
import { Nav, Platform } from "ionic-angular";
import { StatusBar } from "@ionic-native/status-bar";
@Component({
  templateUrl: "app.html"
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage: any = "HomePage";
  pages: Array<{ title: string; component: string; icon: string }>;
  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
  ) {
    this.initializeApp();
    this.pages = [
      { title: "Coins", component: "HomePage", icon: "home" },
      { title: "Favourites", component: "FavoutitesPage", icon: "star" },
      {
        title: "Exchange Calculator",
        component: "ExchangeCalculatorPage",
        icon: "swap"
      },
      { title: "Settings", component: "SettingsPage", icon: "settings" }
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
    });
  }
  openPage(page) {
    if (page.component == "HomePage") {
      this.nav.setRoot(page.component);
    } else {
      this.nav.push(page.component);
    }
  }
}
