//Add Sprite to Ant button
//Ant Path Location

import {
  _decorator,
  Component,
  Node,
  Label,
  SpriteFrame,
  Sprite,
  JsonAsset,
  resources,
  TiledMap,
  TiledMapAsset,
  Input,
  Prefab,
  instantiate,
  UITransform,
  Vec3,
  Button,
  tween,
  Tween,
} from "cc";
const { ccclass, property } = _decorator;
import { PathSelectorButton } from "./PathSelectorButton";
import { coinUpdater } from "./coinUpdater";
import { PLAYER } from "../ClassScripts/constants";
import { singleton } from "../ClassScripts/singleton";
import { AntGenerateManager } from "../Gameplay/AntGenerateManager";
import { FighterAntScript } from "../Gameplay/FighterAntScript";

@ccclass("antTypeButton")
export class antTypeButton extends Component {
  //property
  @property({ type: Label })
  coinLabel: Label = null;
  @property({ type: Sprite })
  antSprite: Sprite = null;
  @property({ type: JsonAsset })
  AntInformation: JsonAsset = null;
  @property({ type: Prefab })
  PathSelectButton: Prefab = null;
  //AntGenerateNode
  @property({ type: Prefab })
  AntGen: Prefab = null;
  @property({ type: Prefab })
  CoinSufficientPopUp: Prefab = null;
  //Globalvariable
  GeneratedAnt: Node = null;
  AntPlayer: PLAYER = PLAYER.NONE;
  SingletonObj: singleton = null;
  Map: TiledMap = null;
  AntAlldetails = null;
  PathSelected: string = null;
  actor = null;

  onLoad() {
    this.SingletonObj = singleton.getInstance();
  }

  /**
   * @description Adding Script on Add Choose Button
   * @param newNode: Node
   * @param antbuttoncount :number
   * @param Player : PLAYER which player
   */
  addSprites(newNode: Node, antbuttoncount: Number, Player: PLAYER) {
    this.AntPlayer = Player;
    let dataLoader: any = this.AntInformation.json;
    dataLoader = dataLoader.AntSpecs;
    for (let index = 0; index < dataLoader.length; index++) {
      if (index == antbuttoncount) {
        this.antSprite.getComponent(Sprite).spriteFrame =
          this.SingletonObj.getSpriteFrame(dataLoader[index].Sprite);
        this.coinLabel.string = dataLoader[index].CoinAlloted;
        newNode.name = dataLoader[index].AntName;
      }
    }
  }
  /**
   * tells which player Side Path Decider Button pop up
   */
  playerPathButton() {
    if (this.AntPlayer == PLAYER.PLAYER1) {
      this.antPathDeciderButton(this.AntPlayer, "A");
    } else if (this.AntPlayer == PLAYER.PLAYER2)
      this.antPathDeciderButton(this.AntPlayer, "B");
  }
  /**
   * Instantiate Path Decider Location Button At Different Path,
   * Path Selected from Map
   */
  antPathDeciderButton(player: PLAYER, side: string) {
    let Map: TiledMap = singleton.Map;
    let numberofobject = Map.getComponent(TiledMap).getObjectGroups().length;
    for (
      var objectcount = 1;
      objectcount <= numberofobject - 2;
      objectcount++
    ) {
      let pathObj = Map.getComponent(TiledMap).getObjectGroup(
        `PathObj${objectcount}`
      );

      var positiontoCan = this.conversion(
        pathObj,
        `Button${objectcount}${side}`
      );
      var buttonclick = instantiate(this.PathSelectButton);
      buttonclick.setPosition(positiontoCan);
      buttonclick
        .getChildByName("Name")
        .getComponent(Label).string = `PathObj${objectcount}`;
      if (
        player == PLAYER.PLAYER1 &&
        this.SingletonObj.PathDeciderNodeA.children.length < numberofobject - 2
      ) {
        this.SingletonObj.PathDeciderNodeA.addChild(buttonclick);
      } else if (
        player == PLAYER.PLAYER2 &&
        this.SingletonObj.PathDeciderNodeB.children.length < numberofobject - 2
      ) {
        this.SingletonObj.PathDeciderNodeB.addChild(buttonclick);
      }
      if (this.AntPlayer == PLAYER.PLAYER1) {
        this.SingletonObj.PathDeciderNodeA.children[objectcount - 1]
          .getComponent(Button)
          .clickEvents.pop();
        this.SingletonObj.PathDeciderNodeA.children[objectcount - 1]
          .getComponent(PathSelectorButton)
          .pathSelected(this.node);
      } else if (this.AntPlayer == PLAYER.PLAYER2) {
        this.SingletonObj.PathDeciderNodeB.children[objectcount - 1]
          .getComponent(Button)
          .clickEvents.pop();
        this.SingletonObj.PathDeciderNodeB.children[objectcount - 1]
          .getComponent(PathSelectorButton)
          .pathSelected(this.node);
      }
    }
  }

  /**
   * @description Callback come from Path Location Decider Button Selected
   * @param event
   * @param customEventData Carries Path Name of Path Location Button
   */
  selectedPathByPlayer = (event: Event, customEventData: string) => {
    // console.log("Callback From Location Button");
    this.PathSelected = customEventData;
    // console.log("user selected path", customEventData);
    let actorplayer;
    console.log("------------", this.SingletonObj.whichActor);
    if (this.SingletonObj.whichActor == 1) {
      actorplayer = 2;
    } else {
      actorplayer = 1;
    }
    this.SingletonObj.photonobj.raiseEvent(4, this.PathSelected, {
      targetActors: [actorplayer],
    });

    this.antGenerationAfterPathDecided();
  };

  /**
   *
   * @description Ant Generated After Path of Ant Decided According to Player Side
   */
  antGenerationAfterPathDecided() {
    if (this.AntPlayer == PLAYER.PLAYER1) {
      this.SingletonObj.PathDeciderNodeA.destroy();
    } else if (this.AntPlayer == PLAYER.PLAYER2) {
      this.SingletonObj.PathDeciderNodeB.destroy();
    }

    let antName;
    let TimeToCoverChangeInY;
    let spriteName;
    let Health;
    let Damage;
    let CoinAlloted;
    let Shield;
    console.log("json file", this.AntInformation);
    let dataLoader: any = this.AntInformation.json;
    dataLoader = dataLoader.AntSpecs;
    let Name = this.AntAlldetails;
    for (let index = 0; index < dataLoader.length; index++) {
      if (dataLoader[index].AntName == Name) {
        antName = dataLoader[index].AntName;
        TimeToCoverChangeInY = dataLoader[index].TimeToCoverChangeInY;
        Health = dataLoader[index].Health;
        Damage = dataLoader[index].Damage;
        CoinAlloted = dataLoader[index].CoinAlloted;
        Shield = dataLoader[index].Shield;
        spriteName = this.SingletonObj.getSpriteFrame(dataLoader[index].Sprite);
      }
    }

    let AntCheck = AntGenerateManager.getInstance();
    this.GeneratedAnt = AntCheck.checkpool(this.AntGen);
    this.GeneratedAnt.getComponent(FighterAntScript).AddSpecs(
      antName,
      TimeToCoverChangeInY,
      spriteName,
      Health,
      Damage,
      CoinAlloted,
      Shield,
      this.AntPlayer
    );

    this.GeneratedAnt.getComponent(UITransform).setContentSize(125, 150);
    let Position = this.generatedAntPosition();
    this.GeneratedAnt.setPosition(Position);
    this.playerAntSide(this.AntPlayer, this.GeneratedAnt);
    // console.log(this.SingletonObj.CoinHolder);
    /**
     * @description checking whether we have sufficient coins
     */
    if (this.AntPlayer == PLAYER.PLAYER1) {
      var isSufficientCoins =
        this.SingletonObj.Coins1.getComponent(coinUpdater).checkCoin(
          CoinAlloted
        );
      if (!isSufficientCoins) {
        var coinsufficientPopUp = instantiate(this.CoinSufficientPopUp);
        coinsufficientPopUp.setPosition(0, 0);
        this.SingletonObj.CanvasNode.addChild(coinsufficientPopUp);
        setTimeout(() => {
          coinsufficientPopUp.destroy();
        }, 1000);
      }
    }
    // if (!this.SingletonObj.multiplayer) {
    if (this.AntPlayer == PLAYER.PLAYER2) {
      var isSufficientCoins =
        this.SingletonObj.Coins2.getComponent(coinUpdater).checkCoin(
          CoinAlloted
        );
      if (!isSufficientCoins && !this.SingletonObj.multiplayer) {
        var coinsufficientPopUp = instantiate(this.CoinSufficientPopUp);
        coinsufficientPopUp.setPosition(0, 0);
        this.SingletonObj.CanvasNode.addChild(coinsufficientPopUp);
        setTimeout(() => {
          coinsufficientPopUp.destroy();
        }, 1000);
      }
    }

    if (this.AntPlayer == PLAYER.PLAYER1 && isSufficientCoins) {
      this.settingUpAnt(this.AntPlayer, CoinAlloted);
    }
    if (this.AntPlayer == PLAYER.PLAYER2 && isSufficientCoins) {
      this.settingUpAnt(this.AntPlayer, CoinAlloted);
    }
  }
  /**
   * @description if we have sufficient coins then adding as child to a particular ant holder and making ant move
   */
  settingUpAnt(whichPlayer: PLAYER, CoinAlloted: any) {
    if (whichPlayer == PLAYER.PLAYER1) {
      var antHolder = this.SingletonObj.AntsHolder_A;
      var whichCoinLabel = this.SingletonObj.Coins1;
    } else if (whichPlayer == PLAYER.PLAYER2) {
      antHolder = this.SingletonObj.AntsHolder_B;
      whichCoinLabel = this.SingletonObj.Coins2;
    }
    antHolder.addChild(this.GeneratedAnt);
    whichCoinLabel.getComponent(coinUpdater).coinDeduction(CoinAlloted);
    this.GeneratedAnt.getComponent(FighterAntScript).antMovement(
      this.PathSelected,
      whichPlayer
    );
  }
  /**
   *
   * @description Functions Call when Ant Choosen Option Clicked
   */
  antGenerateButtonClicked(AntDetails) {
    this.AntAlldetails = AntDetails.target._name;
    if (this.SingletonObj.whichActor == 1) {
      this.actor = 2;
    } else {
      this.actor = 1;
    }
    this.SingletonObj.photonobj.raiseEvent(3, this.AntAlldetails, {
      targetActors: [this.actor],
    });
    if (
      this.AntPlayer == PLAYER.PLAYER1 &&
      this.SingletonObj.PathDeciderNodeA.name != "PathDeciderNodeA"
    ) {
      var newNode = this.SingletonObj.PathDeciderNodeA;
      newNode = new Node("PathDeciderNodeA");
      this.SingletonObj.PathDeciderNodeA = newNode;
      this.SingletonObj.MapComponents.addChild(
        this.SingletonObj.PathDeciderNodeA
      );
    } else if (
      this.AntPlayer == PLAYER.PLAYER2 &&
      this.SingletonObj.PathDeciderNodeB.name != "PathDeciderNodeB"
    ) {
      var newNode1 = this.SingletonObj.PathDeciderNodeB;
      newNode1 = new Node("PathDeciderNodeB");
      this.SingletonObj.PathDeciderNodeB = newNode1;
      this.SingletonObj.MapComponents.addChild(
        this.SingletonObj.PathDeciderNodeB
      );
    }

    this.playerPathButton();
  }
  /**
   *@description Return the Ant Position , to Set position According to Player Side
   * @returns Vec3 Ant Position According to Player Side
   */
  generatedAntPosition(): Vec3 {
    var pathObjGroup = singleton.Map.getObjectGroup(
      `PathObj${this.PathSelected[7]}`
    );
    if (this.AntPlayer == PLAYER.PLAYER1) {
      // var groupObj = pathObjGroup.getObject(`${this.PathSelected[7]}A`);

      var positiontoCanvas = this.conversion(
        pathObjGroup,
        `${this.PathSelected[7]}A`
      );
      console.log("pooossition", positiontoCanvas);
    } else if (this.AntPlayer == PLAYER.PLAYER2) {
      var positiontoCanvas = this.conversion(
        pathObjGroup,
        `${this.PathSelected[7]}B`
      );
      // var groupObj = pathObjGroup.getObject(`${this.PathSelected[7]}B`);
    }

    return positiontoCanvas;
  }
  /**
   * @description if player 2 rotate ant face
   * @param Player Which Player
   * @param GeneratedAnt Ant Node
   */
  playerAntSide(Player: PLAYER, GeneratedAnt: Node) {
    if (this.AntPlayer == PLAYER.PLAYER2) {
      GeneratedAnt.angle = 180;
    }
  }
  /**
   * @description Checking for ant collision and its further coding
   */

  start() {
    this.SingletonObj.script = this;
  }
  conversion(pathObj, MapObject) {
    var button_pos = pathObj.getObject(MapObject);
    let worlPosOfBtn = pathObj.node
      .getComponent(UITransform)
      .convertToWorldSpaceAR(
        new Vec3(
          button_pos.x - pathObj.node.getComponent(UITransform).width * 0.5,
          button_pos.y - pathObj.node.getComponent(UITransform).height * 0.5,
          0
        )
      );

    var positiontoCan = this.SingletonObj.CanvasNode.getComponent(
      UITransform
    ).convertToNodeSpaceAR(new Vec3(worlPosOfBtn.x, worlPosOfBtn.y));
    return positiontoCan;
  }
  update(deltaTime: number) {}
}
