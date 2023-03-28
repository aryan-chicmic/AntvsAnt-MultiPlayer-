// import {
//   _decorator,
//   Component,
//   Node,
//   game,
//   director,
//   AudioSource,
//   Prefab,
//   instantiate,
// } from "cc";
// import AudioControllerObject from "./AudioController";
// import { singleton } from "./singleton";
// const { ccclass, property } = _decorator;

// @ccclass("menuButton")
// export class menuButton extends Component {
//   @property({ type: Node })
//   SettingPopUp: Node = null;
//   // @property({ type: Node })
//   // audiosource = null;
//   AgainClickedSettingButton: boolean = false;
//   SingletonObject: singleton = null;
//   settingPopUp: Node = null;
//   onLoad() {}
//   start() {
//     this.SingletonObject = singleton.getInstance();
//   }

//   buttonClickedSoundEffect(ClipName: string) {
//     let audio = this.SingletonObject.getAudioFile(ClipName);
//     console.log(audio);
//     AudioControllerObject.playSoundEffetcs(audio);
//   }

//   /**
//    * @description back to previous page from help pase
//    *
//    */
//   onClickBackButton() {
//     this.buttonClickedSoundEffect("buttonClickSound");
//     console.log("Back Button Clicked");
//     this.node.destroy();
//     console.log("Help Page Destroyed");
//   }

//   /**
//    * Open Up Menu Option
//    * Close the Menu Option if Open
//    */
//   menuButtonFunctionality() {
//     this.buttonClickedSoundEffect("buttonClickSound");
//     if (this.AgainClickedSettingButton == false) {
//       this.AgainClickedSettingButton = true;
//       this.SettingPopUp.active = true;
//       // this.settingPopUp = instantiate(this.SettingPopUp);
//       // this.settingPopUp.setPosition(100, 400);
//       // this.SingletonObject.CanvasNode.addChild(this.settingPopUp);
//       // console.log(this.node);

//       console.log("Game paused Menu Showed");
//       director.pause();
//     } else {
//       this.SettingPopUp.active = false;
//       // this.settingPopUp.destroy();
//       this.AgainClickedSettingButton = false;
//       console.log("Game Resumed");
//       director.resume();
//     }
//   }

//   /**
//    * Resume the Game After clicking Resume Button
//    */
//   resumeGame() {
//     console.log("After Clicking Resume Button");
//     this.buttonClickedSoundEffect("buttonClickSound");
//     director.resume();
//     this.node.destroy();
//     this.SettingPopUp.active = false;
//     this.AgainClickedSettingButton = false;
//   }
//   /**
//    * return to Landing Page
//    */
//   onClickMainMenu() {
//     this.buttonClickedSoundEffect("buttonClickSound");
//     this.node.destroy();
//     director.resume();
//     director.loadScene("MAIN");
//   }
//   /**
//    * Game Ends Quit Browser
//    */
//   quitGame() {
//     // this.buttonClickedSoundEffect("buttonClickSound");
//     console.log("end");
//     game.end();
//   }

//   update(deltaTime: number) {}
// }
import { _decorator, Component, Node, game, director, AudioSource } from "cc";
import AudioControllerObject from "./AudioController";
import { singleton } from "./singleton";
const { ccclass, property } = _decorator;

@ccclass("menuButton")
export class menuButton extends Component {
  @property({ type: Node })
  SettingPopUp: Node = null;
  AgainClickedSettingButton: boolean = false;
  SingletonObject: singleton = null;
  actor: number;
  onLoad() {}
  start() {
    this.SingletonObject = singleton.getInstance();

    if (this.SingletonObject.photonobj.Actor == 1) {
      this.actor = 2;
    } else {
      this.actor = 1;
    }
  }

  buttonClickedSoundEffect(ClipName: string) {
    let audio = this.SingletonObject.getAudioFile(ClipName);
    AudioControllerObject.playSoundEffetcs(audio);
  }
  /**
   * Resume the Game After clicking Resume Button
   */
  resumeGame() {
    // console.log("After Clicking Resume Button");

    this.buttonClickedSoundEffect("buttonClickSound");
    this.SingletonObject.photonobj.raiseEvent(7, "Game Resume by", {
      targetActors: [this.actor],
    });
    director.resume();
    this.SettingPopUp.active = false;
    this.AgainClickedSettingButton = false;
  }
  /**
   * @description back to previous page from help pase
   *
   */
  onClickBackButton() {
    this.buttonClickedSoundEffect("buttonClickSound");
    console.log("Back Button Clicked");
    this.node.destroy();
    console.log("Help Page Destroyed");
  }
  /**
   * return to Landing Page
   */
  onClickMainMenu() {
    this.buttonClickedSoundEffect("buttonClickSound");
    director.resume();
    director.loadScene("MAIN");
    this.SingletonObject.photonobj.disconnect();
  }
  /**
   * Game Ends Quit Browser
   */
  quitGame() {
    this.buttonClickedSoundEffect("buttonClickSound");
    console.log("end");
    game.end();
  }
  /**
   * Open Up Menu Option
   * Close the Menu Option if Open
   */
  menuButtonFunctionality() {
    this.buttonClickedSoundEffect("buttonClickSound");

    if (this.AgainClickedSettingButton == false) {
      this.AgainClickedSettingButton = true;
      this.SettingPopUp.active = true;
      console.log("Game paused Menu Showed");
      director.pause();
      this.SingletonObject.photonobj.raiseEvent(6, "Game Pause by", {
        targetActors: [this.actor],
      });
    } else {
      this.SettingPopUp.active = false;
      this.AgainClickedSettingButton = false;
      console.log("Game Resumed");
      this.SingletonObject.photonobj.raiseEvent(7, "Game Resume by", {
        targetActors: [this.actor],
      });
      director.resume();
    }
  }
  update(deltaTime: number) {}
  restartGame() {
    this.buttonClickedSoundEffect("buttonClickSound");
    this.node.destroy();
    director.resume();
    director.loadScene("MAP");
  }
}
