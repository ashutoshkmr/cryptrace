import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { settings } from "../../interface/settings.interface";
import { DataProvider } from "../../providers/data/data";
@IonicPage()
@Component({
  selector: "page-settings",
  templateUrl: "settings.html"
})
export class SettingsPage {
  public DataPoints: number;
  public lineChart: boolean;
  public candleChart: boolean;
  public settings: settings;
  public defaultMarket: string = "CCCAGG";
  public marketList = [
    "Cryptsy",
    "BTCChina",
    "Bitstamp",
    "BTER",
    "OKCoin",
    "Coinbase",
    "Poloniex",
    "Cexio",
    "BTCE",
    "BitTrex",
    "Kraken",
    "Bitfinex",
    "Yacuna",
    "LocalBitcoins",
    "Yunbi",
    "itBit",
    "HitBTC",
    "btcXchange",
    "BTC38",
    "Coinfloor",
    "Huobi",
    "CCCAGG",
    "LakeBTC",
    "ANXBTC",
    "Bit2C",
    "Coinsetter",
    "CCEX",
    "Coinse",
    "MonetaGo",
    "Gatecoin",
    "Gemini",
    "CCEDK",
    "Cryptopia",
    "Exmo",
    "Yobit",
    "Korbit",
    "BitBay",
    "BTCMarkets",
    "Coincheck",
    "QuadrigaCX",
    "BitSquare",
    "Vaultoro",
    "MercadoBitcoin",
    "Bitso",
    "Unocoin",
    "BTCXIndia",
    "Paymium",
    "TheRockTrading",
    "bitFlyer",
    "Quoine",
    "Luno",
    "EtherDelta",
    "bitFlyerFX",
    "TuxExchange",
    "CryptoX",
    "Liqui",
    "MtGox",
    "BitMarket",
    "LiveCoin",
    "Coinone",
    "Tidex",
    "Bleutrade",
    "EthexIndia",
    "Bithumb",
    "CHBTC",
    "ViaBTC",
    "Jubi",
    "Zaif",
    "Novaexchange",
    "WavesDEX",
    "Binance",
    "Lykke",
    "Remitano",
    "Coinroom",
    "Abucoins",
    "BXinth",
    "Gateio",
    "HuobiPro",
    "OKEX"
  ].sort();
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private _data: DataProvider
  ) {
    this._data.getSettings().then(val => {
      this.settings = val;
      this.DataPoints = this.settings.chart.dataPoints;
      this.candleChart = this.settings.chart.candleChart;
      this.lineChart = this.settings.chart.lineChart;
      this.defaultMarket = this.settings.defaultMarket;
    });
  }

  updateSettings() {
    this.settings.chart.dataPoints = this.DataPoints;
    this.settings.chart.lineChart = this.lineChart;
    this.settings.chart.candleChart = this.candleChart;
    this.settings.defaultMarket = this.defaultMarket;
    this._data.updateSettings(this.settings).then(() =>
      this.navCtrl.goToRoot({ animate: true }).catch(() => {
        this._data.setSettings();
      })
    );
  }

  cancel() {
    this.navCtrl.goToRoot({ animate: true });
  }

  ionViewDidLoad() {}
}
