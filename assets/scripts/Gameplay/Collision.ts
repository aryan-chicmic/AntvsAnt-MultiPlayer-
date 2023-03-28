import {
  _decorator,
  Component,
  Node,
  Rect,
  UITransform,
  TweenSystem,
  director,
  game,
  Prefab,
  instantiate,
  Label,
} from "cc";
import { Result } from "../ClassScripts/Result";
import { singleton } from "../ClassScripts/singleton";
import { HiveScript } from "../MapSceneComponents/HiveScript";
import { FighterAntScript } from "./FighterAntScript";

const { ccclass, property } = _decorator;

@ccclass("Collision")
export class Collision extends Component {
  @property({ type: Node })
  hiveHolder: Node = null;
  @property({ type: Prefab })
  Result: Prefab = null;
  @property({ type: Node })
  Player1Ant: Node = null;
  @property({ type: Node })
  Player2Ant: Node = null;
  AntInPlayer1: Rect = null;
  AntInPlayer2: Rect = null;
  Ant1Reference: Node = null;
  Ant2Reference: Node = null;
  IsAlive: Boolean = true;
  Hive: Rect = null;
  HiveofPlayerB: Rect = null;
  HiveofPlayerA: Rect = null;
  SingletonObj: singleton = null;

  antCollision(): any {
    for (
      var holder_A_Ant = 0;
      holder_A_Ant < this.SingletonObj.AntsHolder_A.children.length;
      holder_A_Ant++
    ) {
      this.AntInPlayer1 = this.SingletonObj.AntsHolder_A.children[holder_A_Ant]
        .getComponent(UITransform)
        .getBoundingBoxToWorld();
      for (
        var holder_B_Ant = 0;
        holder_B_Ant < this.SingletonObj.AntsHolder_B.children.length;
        holder_B_Ant++
      ) {
        this.AntInPlayer2 = this.SingletonObj.AntsHolder_B.children[holder_B_Ant]
          .getComponent(UITransform)
          .getBoundingBoxToWorld();
        if (this.AntInPlayer1.intersects(this.AntInPlayer2)) {
          //pause tween
          TweenSystem.instance.ActionManager.pauseTarget(
            this.SingletonObj.AntsHolder_A.children[holder_A_Ant]
          );
          TweenSystem.instance.ActionManager.pauseTarget(
            this.SingletonObj.AntsHolder_B.children[holder_B_Ant]
          );
          return [
            this.SingletonObj.AntsHolder_A.children[holder_A_Ant],
            this.SingletonObj.AntsHolder_B.children[holder_B_Ant],
          ];
        }
      }
    }

    return null;
  }
  checkingHiveCollision() {
    var returned_items1 = this.hiveCollisionImplementation(
      this.SingletonObj.AntsHolder_A,
      this.SingletonObj.HiveHolder_B
    );
    var returned_items2 = this.hiveCollisionImplementation(
      this.SingletonObj.AntsHolder_B,
      this.SingletonObj.HiveHolder_A
    );
    if (returned_items1 == null) {
      return returned_items2;
    }
    return returned_items1;
  }
  hiveCollisionImplementation(whichAntHolder, whichHiveHolder) {
    // console.log(whichHiveHolder);

    for (var antReference = 0; antReference < whichAntHolder.children.length; antReference++) {
      this.AntInPlayer1 = whichAntHolder.children[antReference]
        .getComponent(UITransform)
        .getBoundingBoxToWorld();
      for (
        var hiveReference = 0;
        hiveReference < whichHiveHolder.children.length;
        hiveReference++
      ) {
        this.HiveofPlayerB = whichHiveHolder.children[hiveReference]
          .getComponent(UITransform)
          .getBoundingBoxToWorld();

        if (this.AntInPlayer1.intersects(this.HiveofPlayerB)) {
          return [
            whichAntHolder.children[antReference],
            whichHiveHolder.children[hiveReference],
            whichHiveHolder,
          ];
        }
      }
    }

    return null;
  }

  hive_ant_health(anthiveCollision) {
    var Ant = anthiveCollision[0];
    var Hive = anthiveCollision[1];
    var whichHiveHolder = anthiveCollision[2].name;
    // console.log(whichHiveHolder);
    console.log(Ant, Hive, whichHiveHolder);

    let antHealth = Ant.getComponent(FighterAntScript).getHealth();
    let antDamage = Ant.getComponent(FighterAntScript).Damage;
    let antShield = Ant.getComponent(FighterAntScript).Shield;
    let hiveHealth = Hive.getComponent(HiveScript).Health;
    let hiveDamage = Hive.getComponent(HiveScript).Damage;
    let hiveShield = Hive.getComponent(HiveScript).Shield;
    antHealth -= hiveDamage + antShield;
    hiveHealth -= antDamage + hiveShield;
    Ant.getComponent(FighterAntScript).Health = antHealth;
    Hive.getComponent(HiveScript).Health = hiveHealth;
    var countofA_hive = this.SingletonObj.HiveHolder_A.children.length;
    var countofB_hive = this.SingletonObj.HiveHolder_B.children.length;
    if (antHealth <= 0) {
      Ant.destroy();
    } else if (hiveHealth <= 0) {
      // Hive.destroy();
      if (
        whichHiveHolder == "hive_Holder_A" &&
        this.SingletonObj.HiveHolder_A.children.length > 0
      ) {
        // this.SingletonObj.HiveHolder_A.children.length -= 1;
        countofA_hive -= 1;
        console.log(whichHiveHolder, "if Statement");

        Hive.destroy();
      } else if (
        whichHiveHolder == "hive_Holder_B" &&
        this.SingletonObj.HiveHolder_B.children.length > 0
      ) {
        // this.SingletonObj.HiveHolder_B.children.length -= 1;
        countofB_hive -= 1;
        console.log(whichHiveHolder, "else if Statement");
        Hive.destroy();
        // this.SingletonObj.HiveCountB = this.SingletonObj.HiveHolder_B.children.length - 1;
      }
    }
    if (countofA_hive == 0 || countofB_hive == 0) {
      var resultvariable = instantiate(this.Result);
      resultvariable.setPosition(0, 0);
      this.SingletonObj.CanvasNode.addChild(resultvariable);

      if (countofA_hive == 0) {
        resultvariable.getComponent(Result).updateResult("PLAYER B");
      } else if (countofB_hive == 0) {
        resultvariable.getComponent(Result).updateResult("PLAYER A");
      }

      director.pause();
      // game.end();
    }
    // console.log("A", countofAhive);
    // console.log("B", countofBhive);
    // this.SingletonObj.
    // console.log("whichHive", whichHiveHolder);

    if (Ant != null) {
      TweenSystem.instance.ActionManager.resumeTarget(Ant);
    }
  }
  AntHealth(returnedNodes) {
    let healthOfAnt1 = returnedNodes[0].getComponent(FighterAntScript).getHealth();
    let healthOfAnt2 = returnedNodes[1].getComponent(FighterAntScript).getHealth();
    console.log("IntialAnt1", healthOfAnt1, "Ant2", healthOfAnt2);

    healthOfAnt1 -=
      returnedNodes[1].getComponent(FighterAntScript).Damage +
      returnedNodes[0].getComponent(FighterAntScript).Shield;
    healthOfAnt2 -=
      returnedNodes[0].getComponent(FighterAntScript).Damage +
      returnedNodes[1].getComponent(FighterAntScript).Shield;

    returnedNodes[0].getComponent(FighterAntScript).Health = healthOfAnt1;
    returnedNodes[1].getComponent(FighterAntScript).Health = healthOfAnt2;
    console.log("Ant1", healthOfAnt1, "Ant2", healthOfAnt2);

    if (healthOfAnt1 <= 0) {
      returnedNodes[0].destroy();

      if (returnedNodes[1] != null) {
        TweenSystem.instance.ActionManager.resumeTarget(returnedNodes[1]);
      }
    }
    if (healthOfAnt2 <= 0) {
      returnedNodes[1].destroy();

      if (returnedNodes[0] != null) {
        TweenSystem.instance.ActionManager.resumeTarget(returnedNodes[0]);
      }
    }
  }

  onLoad() {
    this.SingletonObj = singleton.getInstance();
  }
  start() {}

  update(deltaTime: number) {
    // console.log("A", this.SingletonObj.HiveHolder_A.children.length);
    // console.log("B", this.SingletonObj.HiveHolder_B.children.length);
    if (this.SingletonObj.AntsHolder_A != null && this.SingletonObj.AntsHolder_B != null) {
      let collidedAnt = this.antCollision();
      if (collidedAnt != null) {
        this.AntHealth(collidedAnt);
      }
    }

    let anthiveCollision = this.checkingHiveCollision();

    if (anthiveCollision != null) {
      this.hive_ant_health(anthiveCollision);
    }
  }
}
