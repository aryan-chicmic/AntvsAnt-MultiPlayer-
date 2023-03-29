/**
 * @description Initial Map Button Setter and their working
 */
import { _decorator, Component, Node, director, Label, UITransform } from "cc";
import AntvsAnt from "../AntvsAnt/PhotonClass";
import AudioControllerObject from "../ClassScripts/AudioController";
import { MultiPlayerEvent } from "../ClassScripts/constants";
import { singleton } from "../ClassScripts/singleton";

const { ccclass, property } = _decorator;

@ccclass("MapButtonSetter")
export class MapButtonSetter extends Component {
  @property({ type: Label })
  label: Label = null;
  mapNumber: Number = 0;
  MapButtonName = "";
  SERVER: AntvsAnt = null;
  singletonObject: singleton;
  onLoad() {
    this.singletonObject = singleton.getInstance();
    this.SERVER = this.singletonObject.photonobj;
  }
  start() {}
  buttonClickedSoundEffect(ClipName: string) {
    let audio = this.singletonObject.getAudioFile(ClipName);
    AudioControllerObject.playSoundEffetcs(audio);
  }
  /**
   * @description Initial Map Buttons position setter
   * @param Parent
   * @param mapbuttoncount
   */
  setButtonPosition(Parent: Node, mapbuttoncount: number) {
    this.node.getComponent(UITransform).setAnchorPoint(0.5, 0.5);
    this.label.getComponent(UITransform).setAnchorPoint(0.5, 0.5);
    this.label.getComponent(UITransform).setContentSize(550, 100);
    this.label.getComponent(Label).fontSize = 80;
    this.node.setPosition(55, 70 - 300 * mapbuttoncount);
    this.node.getChildByName("Label").setPosition(40, 35);
    this.node.getComponent(UITransform).setContentSize(600, 300);
    this.label.string = `Map${mapbuttoncount}`;
    Parent.addChild(this.node);
  }
  /**
   * @description onClicking of respective Map button
   */
  onClickofMapButton() {
    if (this.singletonObject.multiplayer == true) {
      this.SERVER.connectToServer();
      this.singletonObject.Loader.active = true;
    }
    this.singletonObject.SingletonMapButtonCollector.active = false;
    this.buttonClickedSoundEffect("buttonClickSound");
    this.MapButtonName = this.label.string;
    this.singletonObject.MapAssigner = this.MapButtonName;
    this.multiplayerEventRaise();
    this.loadMap();
  }

  multiplayerEventRaise() {
    let OtherActor;
    if (this.singletonObject.whichActor == 1) {
      OtherActor = 2;
    } else {
      OtherActor = 1;
    }
    this.singletonObject.photonobj.raiseEvent(
      MultiPlayerEvent.PlayerWait,
      "Waiting for Other Player",
      { targetActors: [this.singletonObject.whichActor] }
    );

    this.singletonObject.photonobj.raiseEvent(
      MultiPlayerEvent.PlayerWait,
      "Waiting for Other Player",
      { targetActors: [OtherActor] }
    );
  }
  loadMap() {
    if (this.singletonObject.multiplayer == false) {
      director.loadScene("MAP");
    }
  }
  update(deltaTime: number) {}
}
