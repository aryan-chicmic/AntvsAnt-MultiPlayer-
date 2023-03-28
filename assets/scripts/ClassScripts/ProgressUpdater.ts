import {
  _decorator,
  Component,
  Node,
  director,
  Label,
  SpriteFrame,
  ParticleAsset,
  ParticleSystem2D,
  Vec2,
  tween,
  Vec3,
  ProgressBar,
} from "cc";
import { singleton } from "./singleton";
const { ccclass, property } = _decorator;

@ccclass("ProgressUpdater")
export class ProgressUpdater extends Component {
  @property({ type: Node })
  progressBar: Node = null;
  @property({ type: Label })
  PercentageNumber: Label = null;
  @property({ type: Node })
  rays: Node = null;
  @property({ type: Node })
  particle: Node = null;
  @property({ type: Node })
  LoadingType = null;
  //Variable
  progress: number = 0;
  Load: Boolean = false;
  SingletonObject: singleton = null;
  onLoad() {}
  onCompleteAudioLoad = () => {
    console.log("Call back After Audio");
    this.LoadingType.getComponent(Label).string = "Sprite Loading";
    this.loadSpriteResource("sprites");
  };
  onCompleteSpriteLoad = () => {
    console.log("Call back After Sprite Load");
    this.LoadingType.getComponent(Label).string = "Maps Loading";
    this.loadTiledMapResources("TiledMapData");
  };
  onCompleteTileMapLoad = () => {
    console.log("All resources Loaded");
    this.Load = true;
    this.progressBarChecker();
  };
  start() {
    this.SingletonObject = singleton.getInstance();
    this.rays.active = false;
    this.particle.active = false;
    this.SingletonObject.progressbar = this.progressBar;
    this.SingletonObject.percentageNumber = this.PercentageNumber;
    this.LoadingType.getComponent(Label).string = "Audio Loading";
    setTimeout(() => {
      this.loadAudioResource("sounds");
    }, 1000);
  }
  /**
   * @description Load Tile Resource
   * @param String:path of  TileMap Resource folder
   *
   */
  loadTiledMapResources(Path: string) {
    this.SingletonObject.loadTiledMapData(Path, this.onCompleteTileMapLoad);
  }
  /**
   * @description Load Tile Resource
   * @param String:path of  Sprite Resource folder
   *
   */
  loadSpriteResource(Path: string) {
    this.SingletonObject.loadSpriteFrame(Path, this.onCompleteSpriteLoad);
  }
  /**
   * @description Load Music Resource
   * @param String:path of  Audio Resource folder
   *
   */
  loadAudioResource(Path: string) {
    this.SingletonObject.loadAudioFiles(Path, this.onCompleteAudioLoad);
  }
  /**
   * @description Loading Percantage
   */
  progressBarChecker() {
    if (this.Load == true) {
      this.rays.active = true;
      this.particle.active = true;
      setTimeout(() => {
        director.loadScene("MAIN");
      }, 500);
    }
  }
  update(deltaTime: number) {}
}
