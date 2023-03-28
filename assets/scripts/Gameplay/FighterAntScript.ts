import {
  _decorator,
  Component,
  Node,
  Sprite,
  SpriteFrame,
  Prefab,
  Button,
  TiledMap,
  instantiate,
  TiledMapAsset,
  tween,
  UITransform,
  Vec3,
  Tween,
  Rect,
} from "cc";
import { PLAYER } from "../ClassScripts/constants";
import { singleton } from "../ClassScripts/singleton";

const { ccclass, property } = _decorator;

@ccclass("FighterAntScript")
export class FighterAntScript extends Component {
  //property
  @property({ type: Prefab })
  coinUpdater: Prefab;

  AntTween: Tween<Node> = null;

  //VARIABLE
  AntName: string = null;
  TimeToCoverChangeInY: number = null;
  SpriteName: SpriteFrame = null;
  Health: number = null;
  Damage: number = null;
  CoinAlloted: number = null;
  Shield: number = null;
  WhichPlayer: PLAYER = PLAYER.NONE;
  singletonObj: singleton = null;
  coins1: number;
  coins2: number;
  checker: number = 0;
  PathSelected: string = "";
  GeneratedAnt: Node = null;
  AntPlayer: PLAYER = PLAYER.NONE;
  returnedNodes: Node[] = null;
  generatedAntRect: Rect;
  otherAntsRect: Rect;

  onLoad() {
    this.singletonObj = singleton.getInstance();
  }
  /**
   *
   * @param AntName Name of Ant String
   * @param TimeToCoverChangeInY in Number
   * @param sprite in Sprite
   * @param Health in Number
   * @param Damage in Number
   * @param CoinAlloted in number
   * @param Shield in Number
   * @param whichplayer in Enum Player
   */
  AddSpecs(
    AntName: string,
    TimeToCoverChangeInY: number,
    sprite: SpriteFrame,
    Health: number,
    Damage: number,
    CoinAlloted: number,
    Shield: number,
    whichplayer: PLAYER
  ) {
    this.AntName = AntName;
    this.TimeToCoverChangeInY = TimeToCoverChangeInY;
    this.SpriteName = sprite;
    this.node.getComponent(Sprite).spriteFrame = this.SpriteName;
    this.Health = Health;
    this.Damage = Damage;
    this.CoinAlloted = CoinAlloted;
    this.Shield = Shield;
    this.WhichPlayer = whichplayer;
  }
  getHealth() {
    return this.Health;
  }

  antMovement(pathSelected, antPlayer) {
    this.AntPlayer = antPlayer;
    this.GeneratedAnt = this.node;

    this.PathSelected = pathSelected;
    var pathObjGroup = singleton.Map.getObjectGroup(this.PathSelected);
    var pathObjects = pathObjGroup.getObjects();
    let Object = pathObjects.filter((objectname) => {
      let ButtonNameA = "Button" + this.PathSelected[7] + "A";
      let ButtonNameB = "Button" + this.PathSelected[7] + "B";

      return objectname.name != ButtonNameA && objectname.name != ButtonNameB;
    });
    let positionArray = [];

    for (let element = 0; element < Object.length; element++) {
      let worldpost = pathObjGroup.node
        .getComponent(UITransform)
        .convertToWorldSpaceAR(
          new Vec3(
            Object[element].x -
              pathObjGroup.node.getComponent(UITransform).width * 0.5,
            Object[element].y -
              pathObjGroup.node.getComponent(UITransform).height * 0.5,
            0
          )
        );

      var pos_one = this.singletonObj.CanvasNode.getComponent(
        UITransform
      ).convertToNodeSpaceAR(new Vec3(worldpost));
      let TurnPositionAndAngle = {
        POSITION: pos_one,
        TurnAngle: Object[element].Rotation,
      };
      positionArray.push(TurnPositionAndAngle);
    }

    this.AntTween = tween(this.node);

    if (this.AntPlayer == PLAYER.PLAYER1) {
      this.antTweenMovement(positionArray);
    } else if (this.AntPlayer == PLAYER.PLAYER2) {
      positionArray.reverse();
      this.antTweenMovement(positionArray);
    }
    this.AntTween.start();
    this.checker = 1;
  }
  /**
   * @description Apply tween to every position of  Ant for movement
   * @param positionArray Array of Path Positions from which Ant Passes
   */
  antTweenMovement(positionArray) {
    let Old_Position = positionArray.pop().POSITION;
    for (let i = positionArray.length - 1; i >= 0; i--) {
      let NewPosition = positionArray[i].POSITION;
      let TotalDistance = this.distanceBetweenPosition(
        Old_Position,
        NewPosition
      );

      let Time =
        TotalDistance /
        this.GeneratedAnt.getComponent(FighterAntScript).TimeToCoverChangeInY;

      this.AntTween.to(Time, {
        position: new Vec3(NewPosition),
      }).call(() => {
        if (this.AntPlayer == PLAYER.PLAYER2) {
          this.GeneratedAnt.angle =
            this.GeneratedAnt.angle + positionArray[i].TurnAngle;
        } else if (this.AntPlayer == PLAYER.PLAYER1) {
          this.GeneratedAnt.angle =
            this.GeneratedAnt.angle - positionArray[i].TurnAngle;
        }
      });

      Old_Position = NewPosition;
    }
  }
  /**
   * @description distance between old and new position
   * @param Old_Position Vec3 old position of Ant
   * @param newPosition  Vec3 new Position of Ant
   * @returns Number distance between old and new position
   */
  distanceBetweenPosition(Old_Position: Vec3, newPosition: Vec3): number {
    let Xaxis = Math.pow(Old_Position.x - newPosition.x, 2);
    let Yaxis = Math.pow(Old_Position.y - newPosition.y, 2);
    let distance = Math.sqrt(Xaxis + Yaxis);
    return distance;
  }

  start() {}

  update(deltaTime: number) {}
}
