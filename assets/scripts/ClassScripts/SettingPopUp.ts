import { _decorator, Component, Node, director, game } from "cc";
import AudioControllerObject from "./AudioController";
import { singleton } from "./singleton";
const { ccclass, property } = _decorator;

@ccclass("SettingPopUp")
export class SettingPopUp extends Component {
  AgainClickedSettingButton: boolean = false;
  SingletonObject: singleton = null;
  start() {
    this.SingletonObject = singleton.getInstance();
  }

  update(deltaTime: number) {}
}
