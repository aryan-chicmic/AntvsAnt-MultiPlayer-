import { _decorator, Component, Node, Label, UITransform, Vec3 } from "cc";
import { singleton } from "./singleton";
const { ccclass, property } = _decorator;

@ccclass("conversion")
export class conversion extends Component {
  SingletonObj: any;

  onLoad() {
    this.SingletonObj = singleton.getInstance();
  }
  start() {}

  convertingToNodeAR(pathObj, MapObject) {
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

    var positiontoCan = this.SingletonObj.CanvasNode.getComponent(UITransform).convertToNodeSpaceAR(
      new Vec3(worlPosOfBtn.x, worlPosOfBtn.y)
    );
    return positiontoCan;
  }
  update(deltaTime: number) {}
}
