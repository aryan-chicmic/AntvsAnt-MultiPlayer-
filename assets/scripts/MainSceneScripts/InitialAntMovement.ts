/**
 * @description initial screen ant movements and initial position set
 */

import {
  _decorator,
  Component,
  Node,
  tween,
  Vec3,
  Prefab,
  instantiate,
  UITransform,
  Vec2,
  Tween,
  TweenSystem,
} from "cc";
const { ccclass, property } = _decorator;

@ccclass("InitialAntMovement")
export class InitialAntMovement extends Component {
  finalPosX = 0;
  finalPosY = 0;
  tweenComp: Tween<Node> = null;

  start() {}
  /**
   * @description movement of intial ants
   */
  startMovement() {
    this.finalPosX =
      Math.floor(
        Math.random() * this.node.parent.getComponent(UITransform).width * 0.5
      ) * Math.pow(-1, Math.round(Math.random()));
    if (this.node.position.y > 0) {
      this.finalPosY = Math.floor(
        Math.random() -
          (this.node.parent.getComponent(UITransform).height * 0.5 + 17)
      );
    } else {
      this.finalPosY = Math.floor(
        Math.random() +
          (this.node.parent.getComponent(UITransform).height * 0.5 + 17)
      );
    }

    let delta_x = this.finalPosX - this.node.position.x;
    let delta_y = this.finalPosY - this.node.position.y;
    let Angle = Math.atan2(delta_y, delta_x);
    Angle = (Angle * 180) / Math.PI;

    this.node.angle = Angle - 90;
    setTimeout(() => {
      this.tweenComp = tween(this.node)
        .to(10, {
          position: new Vec3(this.finalPosX, this.finalPosY),
        })

        .start();
    }, 10);
  }
  /**
   * @description setting intial position of ants on initial screen for movement
   * @param parent
   */
  setInitialPosition(parent: Node) {
    let initialPosX =
      Math.floor(Math.random() * 720) * Math.pow(-1, Math.round(Math.random()));
    let initialPosY =
      Math.floor(Math.random() * 1280) *
      Math.pow(-1, Math.round(Math.random()));

    this.node.setPosition(initialPosX, initialPosY, 0);
    parent.addChild(this.node);
  }

  update(deltaTime: number) {
    if (
      !this.node
        .getParent()
        .getComponent(UITransform)
        .getBoundingBox()
        .contains(new Vec2(this.node.position.x, this.node.position.y))
    ) {
      try {
        this.tweenComp.stop();
      } catch (error) {
        console.log("ANT ERROR");
      }
      // TweenSystem.instance.ActionManager.pauseTarget(this.tweenComp.stop());
      this.startMovement();
    }
  }
}
