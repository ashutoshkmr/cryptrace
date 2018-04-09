import { Component, ViewChild } from "@angular/core";
import {
  IonicPage,
  NavParams,
  NavController,
  Content,
  LoadingController,
  ToastController
} from "ionic-angular";
import { ScreenOrientation } from "@ionic-native/screen-orientation";
import { Coin } from "../../interface/coins";
import Chart from "chart.js";
import { DataProvider } from "../../providers/data/data";
import { HomePage } from "../home/home";
import { settings } from "../../interface/settings.interface";
import {
  AdMobFree,
  AdMobFreeInterstitialConfig
} from "@ionic-native/admob-free";
import * as io from "socket.io-client";
declare var CanvasJS: any;
declare var CCC: any;

@IonicPage()
@Component({
  selector: "page-coin-detail",
  templateUrl: "coin-detail.html"
})
export class CoinDetailPage {
  @ViewChild("lineCanvas") lineCanvas;

  @ViewChild(Content) content: Content;

  private socket: SocketIOClient.Socket;

  public state = false;
  lineChart: any;
  candleChart: any;
  public loading;
  public coin: Coin;
  public title;
  public symbol;
  public price;
  public volume;
  public change;
  public changeClass;
  public change24hr;
  public lastUpdate;
  public img;
  public Market = [];
  public HomePage = HomePage;
  public dataPoints: any = [];
  public setting: settings;
  public showContent: boolean = false;
  public d;
  public MarketList;
  public currentPrice = {};
  public flag;
  public realTimeChartToggle = false;
  public showInterStellar = true;
  constructor(
    public loadingCtrl: LoadingController,
    private navCtrl: NavController,
    private navParams: NavParams,
    private _data: DataProvider,
    private screenOrientation: ScreenOrientation,
    private toastCtrl: ToastController,
    private admobFree: AdMobFree
  ) {
    // Enable Loading...
    this.loading = this.loadingCtrl.create({
      content: "Loading..."
    });
    this.loading.present();
    // ============================================================================================
    this.d = this.navParams.get("data");
    this.MarketList = this._data.getMarketList();
    this._data.getSettings().then((val: settings) => {
      this.setting = val;
      if (!this.d) {
        this.loading.dismiss();
      } else {
        this.title = this.d.id;
        this.img = "https://www.cryptocompare.com" + this.d.img;
        this._data.getCoin(this.title).subscribe(result => {
          this.content.resize();
          this.coin = result;
          this.symbol = this.coin.symbol;
          this.price = this.coin.price_usd;
          this.change = this.coin.percent_change_24h.toString();
          this.changeClass = this.change[0] === "-" ? "red" : "green";
          this.volume = this.coin["24h_volume_usd"];
          this.getChartData("histohour");
          this.getMarket(this.coin.symbol);
        });
      }
    });
    // =========================================================================================
    // Eastablish socket connection and Listener
    this.socket = io.connect("https://streamer.cryptocompare.com/");
    this.socket.on("m", message => {
      let res = {};
      var messageType = message.substring(0, message.indexOf("~"));

      if (messageType == CCC.STATIC.TYPE.CURRENTAGG) {
        res = CCC.CURRENT.unpack(message);
        this.dataUnpack(res);
      }
    });
    // =============================================================================================
    setTimeout(() => {
      this.emitSubscription();
    }, 500);
    this.loading.dismiss();
  }

  dataUnpack(data) {
    let to = data["TOSYMBOL"];
    let from = data["FROMSYMBOL"];
    let tsym = CCC.STATIC.CURRENCY.getSymbol(to);
    let pair = from + to;

    if (!this.currentPrice.hasOwnProperty(pair)) {
      this.currentPrice[pair] = {};
    }

    for (var key in data) {
      this.currentPrice[pair][key] = data[key];
    }

    if (this.currentPrice[pair]["LASTTRADEID"]) {
      this.currentPrice[pair]["LASTTRADEID"] = parseInt(
        this.currentPrice[pair]["LASTTRADEID"]
      ).toFixed(0);
    }
    this.currentPrice[pair]["CHANGE24HOUR"] = CCC.convertValueToDisplay(
      tsym,
      this.currentPrice[pair]["PRICE"] - this.currentPrice[pair]["OPEN24HOUR"]
    );
    this.currentPrice[pair]["CHANGE24HOURPCT"] =
      (
        (this.currentPrice[pair]["PRICE"] -
          this.currentPrice[pair]["OPEN24HOUR"]) /
        this.currentPrice[pair]["OPEN24HOUR"] *
        100
      ).toFixed(2) + "%";
    this.updateData(this.currentPrice[pair]);
  }

  updateData(data) {
    if (data.PRICE) {
      this.flag = data.FLAGS;
      this.price = data.PRICE;
      this.change = data.CHANGE24HOURPCT;
      this.changeClass = this.change[0] === "-" ? "red" : "green";
      this.volume = parseFloat(data.VOLUME24HOUR).toFixed(2);
      this.change24hr = data.CHANGE24HOUR;
      let d = new Date(parseFloat(data.LASTUPDATE) * 1000);
      let hour =
        d.getHours() < 10 ? "0" + d.getHours().toString() : d.getHours();
      let minute =
        d.getMinutes() < 10 ? "0" + d.getMinutes().toString() : d.getMinutes();
      let sec =
        d.getSeconds() < 10 ? "0" + d.getSeconds().toString() : d.getSeconds();
      this.lastUpdate = hour + ":" + minute + ":" + sec;
    }

    if (this.realTimeChartToggle) {
      this.lineChart.data.datasets.forEach(element => {
        element.label = this.price;
        element.data.shift();
        element.data.push(this.price);
      });
      this.lineChart.data.labels.shift();
      this.lineChart.data.labels.push(this.lastUpdate);
      this.lineChart.update();
    }
  }

  getChartData(interval: string) {
    this.realTimeChartToggle = false;
    this._data
      .getChartData(this.coin.symbol.toString(), interval)
      .subscribe(result => {
        if (this.setting.chart.lineChart) this.drawChart(result);
        if (this.setting.chart.candleChart) this.drawCandleChart(result.candle);
      });
  }
  drawChart(d) {
    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: "line",
      data: {
        labels: d.time,
        datasets: [
          {
            label: this.symbol,
            fill: true,
            lineTension: 0.1,
            backgroundColor: "#fff",
            borderColor: "purple",
            borderCapStyle: "butt",
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            pointBorderColor: "rgba(75,192,192,1)",
            pointBackgroundColor: "#fff",
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: d.data,
            spanGaps: true
          }
        ]
      }
    });
  }

  drawCandleChart(data) {
    data.forEach(element => {
      this.dataPoints.push({
        x: element.time,
        y: [element.open, element.close, element.high, element.low]
      });
    });

    this.candleChart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      theme: "dark1",
      exportEnabled: false,
      axisX: {
        interval: 4,
        valueFormatString: "DD/MM"
      },
      axisY: {
        includeZero: false,
        prefix: "$",
        title: "Price"
      },
      toolTip: {
        content:
          "Date: {x}<br /><strong>Price:</strong><br />Open: {y[0]}, Close: {y[3]}<br />High: {y[1]}, Low: {y[2]}"
      },
      data: [
        {
          type: "candlestick",
          dataPoints: this.dataPoints
        }
      ]
    }).render();
  }

  getMarket(coin, url = "https://api.cryptonator.com/api/full/") {
    this._data.getMarket(coin, url).subscribe(result => {
      this.Market = result;
    });
  }

  fullscreen(state) {
    this.state = state;
    state
      ? this.screenOrientation.lock(
          this.screenOrientation.ORIENTATIONS.LANDSCAPE
        )
      : this.screenOrientation.lock(
          this.screenOrientation.ORIENTATIONS.PORTRAIT
        );
    let x = document.getElementsByTagName("ion-slides")[0].clientHeight;
    this.content.resize();
    this.content.scrollTo(0, x / 2);
    this.lineChart.resize();
  }

  AddToFavourites() {
    this._data.getFav().then((val: any) => {
      val = val || {};
      let key = Object.keys(val);
      let index = key.indexOf(this.d.id);
      if (index == -1) {
        val[this.d.id] = {
          Img: this.d.img,
          notify: false,
          priceUp: null,
          priceDown: null,
          timeStamp: null,
          text: ""
        };

        this._data.storeFav(val).then(v => {
          this.toastCtrl
            .create({
              cssClass: "center",
              message: "Added to Favourities",
              position: "bottom",
              duration: 2000
            })
            .present();
        });
      } else {
        this.toastCtrl
          .create({
            cssClass: "center",
            message: "Coin Already Present in Favourities",
            position: "bottom",
            duration: 2000
          })
          .present();
      }
    });
  }

  home() {
    this.navCtrl.goToRoot({ animate: false });
  }
  emitSubscription() {
    let subs = "5~CCCAGG~" + this.symbol + "~USD";
    this.socket.emit("SubAdd", {
      subs: [subs]
    });
  }
  // life cycle hooks below
  ionViewDidLoad() {
    const config: AdMobFreeInterstitialConfig = {
      id: "ca-app-pub-3460960854060123/3801613448",
      autoShow: true
    };
    this.admobFree.interstitial.config(config);
  }
  goTOsettingsPage() {
    this.showInterStellar = false;
    this.navCtrl.push("SettingsPage");
  }
  ionViewWillLeave() {
    if (this.showInterStellar) {
      this.admobFree.interstitial.prepare();
    }
    this.socket.disconnect();
    try {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      this.d = {};
    } catch (error) {}
  }
}
