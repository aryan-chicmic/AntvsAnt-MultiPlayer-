import { _decorator, Component, Node, Label } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Result")
export class Result extends Component {
  @property({ type: Label })
  winnerLabel: Label = null;
  start() {}
  updateResult(winner: string) {
    this.winnerLabel.string = winner;
    console.log(winner);
    console.log(this.winnerLabel);
  }
  update(deltaTime: number) {}
}
