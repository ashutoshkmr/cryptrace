import { Component, ViewChild } from "@angular/core";
import {
  IonicPage,
  NavController,
  Content,
  LoadingController
} from "ionic-angular";
import { DataProvider } from "../../providers/data/data";
import { Coin } from "../../interface/coins";
import * as $ from "jquery";
import { AdMobFree, AdMobFreeBannerConfig } from "@ionic-native/admob-free";

@IonicPage()
@Component({
  selector: "page-home",
  templateUrl: "home.html"
})
export class HomePage {
  public coins: Coin[] = [];
  public items: Coin[] = [];
  public shouldShowCancel = true;
  public loading;
  public x;
  public err = "clear";
  public searchQuery: string;
  @ViewChild(Content) content: Content;
  constructor(
    public navCtrl: NavController,
    private _data: DataProvider,
    public loadingCtrl: LoadingController,
    private admobFree: AdMobFree
  ) {
    this.loading = this.loadingCtrl.create({
      content: "Loading..."
    });
    this.loading.present();
    this._data.getImages().then(val => {
      if (!val) {
        this._data.setImages().subscribe(res => {
          this.getData();
        });
      } else {
        this.getData();
      }
    });

    // this.showBanner();
  }

  showBanner() {
    let bannerConfig: AdMobFreeBannerConfig = {
      id: "ca-app-pub-3460960854060123/3442834455",
      autoShow: true,
      isTesting :true
    };

    this.admobFree.banner.config(bannerConfig);

    this.admobFree.banner
      .prepare()
      .then(() => {
        // success
      })
      .catch(e => (this.err = e));
  }

  doRefresh(refresher) {
    this.getData()
      .then(() => {
        setTimeout(() => refresher.complete(), 1000);
      })
      .catch(e => {});
  }
  async getData() {
    await this._data.getCoins().subscribe(result => {
      this.coins = result;
      this.loading.dismiss();
      return;
    });
  }

  coindetail(coin) {
    this.navCtrl.push("CoinDetailPage", { data: coin });
  }

  getItems(ev: any) {
    this.x = $(".ion-md-arrow-back");
    this.x.addClass("dark");
    this.items = this.coins;
    let val = ev.target.value;
    if (val && val.trim() != "") {
      this.items = this.items.filter(item => {
        return item["symbol"].toLowerCase().indexOf(val.toLowerCase()) > -1;
      });
    }
  }

  onCancel(ev: any) {
    this.items = [];
    this.searchQuery = '';
    this.x.removeClass("dark");
  }
  scrollToTop() {
    this.content.scrollToTop();
  }
  ionViewWillLeave() {
    try {
      this.x.removeClass("dark");
    } catch (error) {}
  }
}
