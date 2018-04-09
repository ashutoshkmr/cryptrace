import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { DataProvider } from "../../providers/data/data";
import { Storage } from "@ionic/storage";
import { Coin } from "../../interface/coins";
/**
 * Generated class for the ExchangeCalculatorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-exchange-calculator",
  templateUrl: "exchange-calculator.html"
})
export class ExchangeCalculatorPage {
  public exchangeRates;
  public coin;
  public coins: Coin[] = [];
  public currencies = [];
  public currency: string;
  public coinAmount : string;
  public curencyAmount : string;
  constructor(
    private storage: Storage,
    public navCtrl: NavController,
    public navParams: NavParams,
    private _data: DataProvider
  ) {
    this._data.getExchangeRates().subscribe(result => {
      this.exchangeRates = result;
      this.currencies = Object.keys(result).sort();
    });
    this.storage.get("coins").then(val => {
      this.coins = val;
    });
  }
  changeCurrencyAmount(){
  this.curencyAmount  = (parseFloat(this.coinAmount) * parseFloat(this.coin.price_usd) * parseFloat(this.exchangeRates[this.currency])).toString();
  if(this.curencyAmount == 'NaN'){
    this.curencyAmount ='';
  }
  }
  changeCoinAmount() {
    this.coinAmount  = ((parseFloat(this.curencyAmount) / parseFloat(this.exchangeRates[this.currency]))/parseFloat(this.coin.price_usd)).toString();
    if(this.coinAmount == 'NaN'){
      this.coinAmount ='';
    }
  }

  ionViewDidLoad() {}
}
