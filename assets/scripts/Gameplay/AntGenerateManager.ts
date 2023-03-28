//Ant Noodpool Singleton
import {
  _decorator,
  Component,
  Node,
  NodePool,
  Prefab,
  instantiate,
  SpriteFrame,
} from "cc";

const { ccclass, property } = _decorator;

@ccclass("AntGenerateManager")
export class AntGenerateManager extends Component {
  private static _instance: AntGenerateManager = null;
  AntPool: NodePool = new NodePool();
  private AntGenerateManager() {}
  static getInstance(): AntGenerateManager {
    if (!this._instance) {
      this._instance = new AntGenerateManager();
    }
    return AntGenerateManager._instance;
  }
  checkpool(AntGen: Prefab): Node {
    if (this.AntPool.size() == 0) {
      let Ant = instantiate(AntGen);
      this.AntPool.put(Ant);
    }
    return this.AntPool.get();
  }
  start() {}

  update(deltaTime: number) {}
}
