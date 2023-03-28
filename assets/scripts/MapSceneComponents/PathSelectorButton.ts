import { _decorator, Component, Node, Label, EventHandler, Button } from "cc";

const { ccclass, property } = _decorator;

@ccclass("PathSelectorButton")
export class PathSelectorButton extends Component {
  onLoad() {}
  /**
   * @description Callback tells the  Selected path by user
   * @param node Reference of node from which it clicked
   */
  pathSelected(node: any) {
    let path = this.node.getChildByName("Name").getComponent(Label).string;
    const clickEventHandler = new EventHandler();
    // This node is the node to which your event handler code component belongs
    clickEventHandler.target = node;
    // This is the script class name
    clickEventHandler.component = "antTypeButton";
    clickEventHandler.handler = "selectedPathByPlayer";
    clickEventHandler.customEventData = path;

    const button = this.node.getComponent(Button);
    button.clickEvents.push(clickEventHandler);
  }
  start() {}

  update(deltaTime: number) {}
}
