/**
 * @description Initial Map Buttons Creation
 */
import { _decorator, Component, Node, instantiate, Prefab, Size, Button } from "cc";
import AntvsAnt from "../AntvsAnt/PhotonClass";
import AudioControllerObject from "../ClassScripts/AudioController";
import { singleton } from "../ClassScripts/singleton";
import { MapButtonSetter } from "./MapButtonSetter";

const { ccclass, property } = _decorator;

@ccclass("MapButtonCreation")
export class MapButtonCreation extends Component {
  @property({ type: Prefab })
  mapButtonPrefab: Prefab = null;
  @property({ type: Node })
  mapButtonCollector: Node;
  @property({ type: Node })
  player1_node: Node;
  @property({ type: Node })
  player2_node: Node;
  @property({ type: Node })
  help_node: Node;
  @property({ type: Node })
  quit_node: Node;
  @property({ type: Node })
  loader: Node;
  @property({ type: Prefab })
  HomepageOne = null;

  //Variable
  button: Node = null;
  countofMaps: number = 3;
  SingletonObject: singleton = null;
  SERVER: AntvsAnt = null;
  onLoad() {
    //   this.onClickedPlayerOneButton();
  }

  buttonClickedSoundEffect(ClipName: string) {
    let audio = this.SingletonObject.getAudioFile(ClipName);
    AudioControllerObject.playSoundEffetcs(audio);
  }
  start() {
    this.SingletonObject = singleton.getInstance();
    this.SingletonObject.Loader = this.loader;
    this.SingletonObject.TwoPlayer = this.player2_node;

    this.loader.active = false;
    this.SERVER = this.SingletonObject.photonobj;
  }
  /**
   * @description on clicking button for Player1
   */
  onClickedPlayerOneButton() {
    //console.log("photon class", this.SERVER);
    this.SERVER.connectToServer();
    this.SingletonObject.multiplayer = true;
    this.loader.active = true;
    this.player2_node.getComponent(Button).interactable = false;
    console.log("Player One Under process");
    this.buttonClickedSoundEffect("buttonClickSound");
  }
  /**sssss
   * @description on clicking button for Player2 -> making of map choosing buttons
   */
  mapButtonCreator() {
    console.log("Player 2 Button Clicked");
    this.player1_node.active = false;
    this.player2_node.active = false;
    this.help_node.active = false;
    this.quit_node.active = false;
    this.loader.active = true;
    this.buttonClickedSoundEffect("buttonClickSound");
    this.SERVER.raiseEvent(2, "Player 2 Button Clicked", {
      targetActors: [this.SERVER.Actor],
    });

    this.loader.active = false;

    for (var mapbuttoncount = 1; mapbuttoncount <= this.countofMaps; mapbuttoncount++) {
      this.button = instantiate(this.mapButtonPrefab);

      this.button
        .getComponent(MapButtonSetter)
        .setButtonPosition(this.mapButtonCollector, mapbuttoncount);
    }
  }

  onClickHelpButton() {
    console.log("Help Button Clicked");
    this.buttonClickedSoundEffect("buttonClickSound");
    let HelpPage = instantiate(this.HomepageOne);
    this.node.addChild(HelpPage);
  }

  update(deltaTime: number) {}
}
