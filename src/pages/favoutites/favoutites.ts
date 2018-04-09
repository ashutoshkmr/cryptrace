import { Component } from "@angular/core";
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  ItemSliding,
  Item,
} from "ionic-angular";
import { DataProvider } from "../../providers/data/data";

@IonicPage()
@Component({
  selector: "page-favoutites",
  templateUrl: "favoutites.html"
})
export class FavoutitesPage {
  public favCoin;
  public key;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _data: DataProvider,
    private toastCtrl: ToastController
  ) {
    this._data.getFav().then(val => {
      if (val) {
        this.key = Object.keys(val);
        this.favCoin = val;
      }
    });
  }
  gotoCoinDetailsPage(c) {
    this.navCtrl.push("CoinDetailPage", {
      data: { id: c, img: this.favCoin[c].Img }
    });
  }
  delete(c) {
    delete this.favCoin[c];
    this.key = Object.keys(this.favCoin);
    this._data.storeFav(this.favCoin).then(val => {
      this.favCoin = val;
      this.key = Object.keys(val);
      this.toastCtrl
        .create({
          message: `${c} Removed`,
          cssClass: "center",
          duration: 1500,
          position: "bottom"
        })
        .present();
    });
  }

  open(slidingItem: ItemSliding, item: Item) {
    slidingItem.setElementClass("active-sliding", true);
    slidingItem.setElementClass("active-slide", true);
    slidingItem.setElementClass("active-options-right", true);
    item.setElementClass("slideFavItem", true);
  }
  close(slidingItem: ItemSliding, item: Item) {
    slidingItem.close();
    slidingItem.setElementClass("active-sliding", false);
    slidingItem.setElementClass("active-slide", false);
    slidingItem.setElementClass("active-options-right", false);
    item.setElementClass("slideFavItem", false);
  }
  ionViewDidLoad() {}
}
