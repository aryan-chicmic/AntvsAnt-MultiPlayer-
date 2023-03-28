/**
 * @description updating coins on a label
 */
import { _decorator, Component, Node, Label, Prefab, instantiate } from "cc";
import { PLAYER } from "../ClassScripts/constants";
import { singleton } from "../ClassScripts/singleton";

const { ccclass, property } = _decorator;

@ccclass("coinUpdater")
export class coinUpdater extends Component {
  // @property({ type: Prefab })
  // coinPrefab1: Prefab = null;
  // @property({ type: Prefab })
  // coinPrefab2: Prefab = null;
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
    // this.singletonObj.Coins1 = parseInt(this.coinlabel1);
    // this.singletonObj.Coins2 = parseInt(this.coinlabel2);
  }

  start() {
    if (this.coins1 < this.maximumCoins) {
      this.schedule(() => {
        this.coinUpdateFunc(this.coins1);
      }, 0.1);
    }
  }
  coinUpdateFunc(whichCoins: number) {
    if (whichCoins == this.coins1) {
      this.coinlabel1 = this.coinLabel.getComponent(Label).string;
      if (this.coinlabel1 != null && this.coins1 < this.maximumCoins) {
        this.coins1 += 5;
        this.coinlabel1 = `${this.coins1}`;
        this.coinLabel.getComponent(Label).string = `${this.coins1}`;
      }
    }
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
