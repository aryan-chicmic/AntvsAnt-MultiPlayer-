import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("HiveScript")
export class HiveScript extends Component {
  Health: Number = 0;
  Damage: Number = 0;
  Shield: Number = 0;

  
  addSpecs(Health: Number, Damage: Number, Shield: Number) {
    this.Health = Health;
    this.Damage = Damage;
    this.Shield = Shield;
  }
  start() {}

  update(deltaTime: number) {}
}
