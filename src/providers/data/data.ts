import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import "rxjs/add/operator/map";
import { Coin } from "../../interface/coins";
import { settings } from "../../interface/settings.interface";
import "rxjs/add/operator/retry";

@Injectable()
export class DataProvider {
  public settings: settings;
  public img: Object = {};
  public marketList: string[] = [
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
  ];
  constructor(private http: HttpClient, private storage: Storage) {
    this.marketList.sort();
    this.getSettings().then(val => {
      if (!val) this.setSettings();
      else {
        this.settings = val;
      }
    });
  }

  getCoins() {
    let d: Coin[];
    return this.http
      .get<Coin[]>(`https://api.coinmarketcap.com/v1/ticker/?convert=USD`)
      .map(response => {
        d = response;
        d.sort((a: Coin, b: Coin): number => {
          return parseFloat(b[`price_usd`]) - parseFloat(a[`price_usd`]);
        });
        this.getImages().then(val => {
          d.forEach(e => {
            e.ImageUrl = val[e.symbol];
          });
          return d;
        });
        this.storage.get("coins").then(val => {
          if (!val) {
            this.storage.set("coins", d);
          }
        });
        return d;
      });
  }
  getCoin(id: string) {
    return this.http
      .get<Coin>(`https://api.coinmarketcap.com/v1/ticker/${id}/`)
      .map(res => res[0]);
  }
  getChartData(fsym, interval, market = "CCCAGG") {
    let data = [];
    let time = [];
    let candle = [];
    return this.http
      .get<any>(
        `https://min-api.cryptocompare.com/data/${interval}?aggregate=1&e=${market}&extraParams=CryptoCompare&fsym=${fsym}&limit=${
          this.settings.chart.dataPoints
        }&tryConversion=false&tsym=USD`
      )
      .map(response => {
        let d = response.Data;
        d.forEach(element => {
          element.time = new Date(parseFloat(element["time"]) * 1000);
          candle.push({
            time: element.time,
            open: element.open,
            close: element.close,
            high: element.high,
            low: element.low
          });
          element.time =
            element.time.getHours() + ":" + element.time.getMinutes();
          time.push(element.time);

          data.push(element.open);
        });
        return { time: time, data: data, candle: candle };
      });
  }

  getMarketList() {
    return this.marketList;
  }

  getMarket(coin: string, url) {
    let data;
    coin = coin.toLowerCase();
    return this.http.get<any>(url + `${coin}-usd`).map(res => {
      if (res["success"] == true) {
        data = res["ticker"]["markets"];
        data.map(e => {
          e.price = parseFloat(e.price).toFixed(2);
          e.volume = parseFloat(e.volume).toFixed(2);
          return e;
        });
        return data;
      } else {
        return [];
      }
    });
  }
  updateSettings(setting: settings) {
    this.settings = setting;
    return this.storage.set("settings", setting);
  }
  setSettings() {
    let set = {
      chart: {
        candleChart: true,
        lineChart: true,
        dataPoints: 20
      },
      defaultMarket: "CCCAGG",
    };
    this.storage.set("settings", set).then(() => (this.settings = set));
  }
  getSettings() {
    return this.storage.get("settings");
  }
  getImages() {
    return this.storage.get("img");
  }
  setImages() {
    return this.http
      .get<any>("https://min-api.cryptocompare.com/data/all/coinlist")
      .map(res => {
        res = res.Data;
        let key: string[] = Object.keys(res);
        key.forEach(e => {
          this.img[e] = res[e]["ImageUrl"];
        });
        this.storage.set("img", this.img);
        return this.img;
      });
  }

  getExchangeRates() {
    return this.http
      .get("https://api.fixer.io/latest?base=USD")
      .map(res => res["rates"]);
  }

  getFav() {
    return this.storage.get("favCoin");
  }

  storeFav(favCoin) {
    return this.storage.remove("favCoin").then(() => {
      return this.storage.set("favCoin", favCoin);
    });
  }
}
