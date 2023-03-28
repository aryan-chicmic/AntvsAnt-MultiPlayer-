/**
 * @description main singleton class
 */
import {
  _decorator,
  Component,
  Node,
  resources,
  AudioClip,
  Prefab,
  TiledMap,
  error,
  Sprite,
  SpriteFrame,
  TiledMapAsset,
  Label,
  ProgressBar,
  director,
  game,
} from "cc";
import AntvsAnt from "../AntvsAnt/PhotonClass";
import { antTypeButton } from "../MapSceneComponents/antTypeButton";
import { PLAYER } from "./constants";
const { ccclass, property } = _decorator;

@ccclass("singleton")
export class singleton extends Component {
  private static instance: singleton = null;

  // static variables
  private hiveHolder_A: Node = null;
  private hiveHolder_B: Node = null;
  private canvasNode: Node = null;
  private antsHolder_A: Node = null;
  private antsHolder_B: Node = null;
  private pathDeciderNodeA: Node = null;
  private pathDeciderNodeB: Node = null;
  private antsHolder: Node = null;
  private mapComponents: Node = null;
  private antPath: string;
  private coins1: Node = null;
  private coins2: Node = null;
  private coinHolder: Node = null;
  private AudioClipArray: AudioClip[] = [];
  private SpriteFrameArray: SpriteFrame[] = [];
  private TiledMapAssetArray: TiledMapAsset[] = [];
  static Map: TiledMap;
  private hiveCountA: Number = 0;
  private hiveCountB: Number = 0;
  mapButton: string = "";
  maximumCoins = 300;
  private percenatge: number = 0;
  private progresBar: Node = null;
  private PercentageNumber: Label = null;
  private Photonobj: AntvsAnt = null;

  multiplayer: boolean = false;
  script: antTypeButton;
  whichActor;
  private singleton() {}
  static getInstance(): singleton {
    if (!singleton.instance) {
      singleton.instance = new singleton();
    }
    return singleton.instance;
  }
  get photonobj(): AntvsAnt {
    // console.log("this------>get", this.Photonobj);
    return this.Photonobj;
  }
  set photonobj(photon: AntvsAnt) {
    this.Photonobj = photon;
    //  console.log("this------>set", photon);
  }
  get percentageNumber(): Label {
    return this.PercentageNumber;
  }
  set percentageNumber(percenatgelabel: Label) {
    this.PercentageNumber = percenatgelabel;
  }
  get progressbar(): Node {
    return this.progresBar;
  }
  set progressbar(bar: Node) {
    this.progresBar = bar;
  }
  get HiveHolder_A(): Node {
    return this.hiveHolder_A;
  }
  set HiveHolder_A(value: Node) {
    this.hiveHolder_A = value;
  }
  get HiveHolder_B(): Node {
    return this.hiveHolder_B;
  }
  set HiveHolder_B(value: Node) {
    this.hiveHolder_B = value;
  }
  get CoinHolder(): Node {
    return this.coinHolder;
  }
  set CoinHolder(value: Node) {
    this.coinHolder = value;
  }
  get Coins1(): Node {
    return this.coins1;
  }
  set Coins1(value: Node) {
    this.coins1 = value;
  }
  get Coins2(): Node {
    return this.coins2;
  }
  set Coins2(value: Node) {
    this.coins2 = value;
  }
  get AntsHolder(): Node {
    return this.antsHolder;
  }
  set AntsHolder(value: Node) {
    this.antsHolder = value;
  }
  get PathDeciderNodeA(): Node {
    return this.pathDeciderNodeA;
  }
  set PathDeciderNodeA(value: Node) {
    this.pathDeciderNodeA = value;
  }
  get PathDeciderNodeB(): Node {
    return this.pathDeciderNodeB;
  }
  set PathDeciderNodeB(value: Node) {
    this.pathDeciderNodeB = value;
  }
  get CanvasNode(): Node {
    return this.canvasNode;
  }
  set CanvasNode(value: Node) {
    this.canvasNode = value;
  }
  get AntsHolder_A(): Node {
    return this.antsHolder_A;
  }
  set AntsHolder_A(value: Node) {
    this.antsHolder_A = value;
  }

  get AntsHolder_B(): Node {
    return this.antsHolder_B;
  }
  set AntsHolder_B(value: Node) {
    this.antsHolder_B = value;
  }
  get MapComponents(): Node {
    return this.mapComponents;
  }
  set MapComponents(value: Node) {
    this.mapComponents = value;
  }

  set MapAssigner(mapName: string) {
    this.mapButton = mapName;
  }
  get MapAssigner() {
    return this.mapButton;
  }
  set AntPath(path: string) {
    this.antPath = path;
  }
  get AntPath(): string {
    return this.antPath;
  }
  set HiveCountA(count: Number) {
    this.hiveCountA = count;
  }
  get HiveCountA(): Number {
    return this.hiveCountA;
  }
  set HiveCountB(count: Number) {
    this.hiveCountB = count;
  }
  get HiveCountB(): Number {
    return this.hiveCountB;
  }
  public loadAudioFiles(path: string, onCompleteAudioLoad: Function) {
    resources.loadDir(
      path,
      AudioClip,
      (finishedAudio, totalAudio) => {
        //on progress

        this.percenatge = Math.trunc((finishedAudio / totalAudio) * 100);
        this.PercentageNumber.string = this.percenatge.toString();
        this.progressbar.getComponent(ProgressBar).progress = this.percenatge;
        // console.log(
        //   "finish",
        //   finishedAudio,
        //   "total",
        //   totalAudio,
        //   "percantage ------>",
        //   this.percenatge,
        //   "%"
        // );
      },
      (error, AudioClip) => {
        //on complete
        this.AudioClipArray = AudioClip;

        onCompleteAudioLoad();
      }
    );
  }
  public getAudioFile(AudioClipName: string): AudioClip {
    if (this.AudioClipArray) {
      let clip = this.AudioClipArray.find((clip) => {
        if (clip.name == AudioClipName) {
          return clip;
        }
      });
      return clip || null;
    }
  }

  public loadSpriteFrame(path: string, onCompleteSpriteLoad: Function) {
    this.PercentageNumber.string = "0";
    resources.loadDir(
      path,
      SpriteFrame,
      (finishedsprite, totalsprite) => {
        //on progress

        this.percenatge = Math.trunc((finishedsprite / totalsprite) * 100);
        this.PercentageNumber.string = this.percenatge.toString();
        this.progressbar.getComponent(ProgressBar).progress = this.percenatge;
        // console.log(
        //   "finish",
        //   finishedsprite,
        //   "total",
        //   totalsprite,
        //   "percantage ------>",
        //   this.percenatge,
        //   "%"
        // );
      },
      (error, SpriteFrames) => {
        //on complete
        this.SpriteFrameArray = SpriteFrames;
        onCompleteSpriteLoad();
      }
    );
  }
  public getSpriteFrame(SpriteFrameName: string): SpriteFrame {
    if (this.AudioClipArray) {
      let spriteframe = this.SpriteFrameArray.find((SpriteFrame) => {
        if (SpriteFrame.name == SpriteFrameName) {
          return SpriteFrame;
        }
      });
      return spriteframe || null;
    }
  }

  public loadTiledMapData(path: string, onCompleteTileMapLoad: Function) {
    this.PercentageNumber.string = "0";
    resources.loadDir(
      path,
      TiledMapAsset,
      (finishedMap, totalMap) => {
        //on progress

        this.percenatge = Math.trunc((finishedMap / totalMap) * 100);
        this.PercentageNumber.string = this.percenatge.toString();
        this.progressbar.getComponent(ProgressBar).progress = this.percenatge;
        // console.log(
        //   "finish",
        //   finishedMap,
        //   "total",
        //   totalMap,
        //   "percantage ------>",
        //   this.percenatge,
        //   "%"
        // );
      },
      (error, Maps) => {
        //on complete
        this.TiledMapAssetArray = Maps;
        onCompleteTileMapLoad();
      }
    );
  }
  public getMapAsset(MapName: string): TiledMapAsset {
    if (this.TiledMapAssetArray) {
      let map = this.TiledMapAssetArray.find((Map) => {
        if (Map.name == MapName) {
          return Map;
        }
      });
      return map || null;
    }
  }

  quitGame() {
    director.resume();
    director.loadScene("MAIN");
  }
  start() {}

  update(deltaTime: number) {}

  multiplayerScript(antplayer, pathselect, antdetails) {
    console.log("In singleton multiplayer");
    if (antplayer == 1) {
      this.script.AntPlayer = PLAYER.PLAYER1;
    } else {
      this.script.AntPlayer = PLAYER.PLAYER2;
    }
    this.script.PathSelected = pathselect;
    this.script.AntAlldetails = antdetails;
    this.script.antGenerationAfterPathDecided();
  }

  gamePause() {
    director.pause();
  }
  gameResume() {
    director.resume();
  }
}
