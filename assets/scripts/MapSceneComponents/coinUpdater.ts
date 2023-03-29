/**
 * @description updating coins on a label
 */
import { _decorator, Component, Node, Label, Prefab, instantiate } from "cc";
import { PLAYER } from "../ClassScripts/constants";
import { singleton } from "../ClassScripts/singleton";

const { ccclass, property } = _decorator;

@ccclass("coinUpdater")
export class coinUpdater extends Component {
  @property({ type: Label })
  coinLabel: Label = null;
  coins1: number = 0;
  coins2: number = 0;
  maximumCoins = 300;
  coinlabel1: string = "";
  coinlabel2: string = "";
  coin1Obj = null;
  coin2Obj = null;
  singletonObj: singleton = null;

  onLoad() {
    this.singletonObj = singleton.getInstance();
  }
  updationStart() {
    if (this.coins1 < this.maximumCoins) {
      this.schedule(this.coinUpdateFunc, 0.1);
    }
  }
  start() {}
  coinUpdateFunc() {
    // if (whichCoins == this.coins1) {
    this.coinlabel1 = this.coinLabel.getComponent(Label).string;
    if (this.coinlabel1 != null && this.coins1 < this.maximumCoins) {
      this.coins1 += 5;
      this.coinlabel1 = `${this.coins1}`;
      this.coinLabel.getComponent(Label).string = `${this.coins1}`;
      // }
    }
  }
  unscheduling() {
    console.log("in unschedule");

    this.unschedule(this.coinUpdateFunc);
  }
  coinDeduction(CoinAlloted: number) {
    this.coins1 -= CoinAlloted;
    this.coinlabel1 = `${this.coins1}`;
    this.coinLabel.getComponent(Label).string = `${this.coins1}`;
  }

  checkCoin(CoinAlloted: number): boolean {
    if (CoinAlloted >= parseInt(this.coinlabel1)) {
      return false;
    } else {
      return true;
    }
  }

  update(deltaTime: number) {}
}
