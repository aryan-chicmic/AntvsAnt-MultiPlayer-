import {
  _decorator,
  Component,
  Node,
  game,
  director,
  AudioSource,
  Prefab,
  instantiate,
  Label,
  Scheduler,
  TweenSystem,
} from "cc";
import { coinUpdater } from "../MapSceneComponents/coinUpdater";
import AudioControllerObject from "./AudioController";
import { MultiPlayerEvent, PLAYER } from "./constants";
import { singleton } from "./singleton";
const { ccclass, property } = _decorator;

@ccclass("menuButton")
export class menuButton extends Component {
  @property({ type: Node })
  SettingPopUp: Node = null;

  @property({ type: Node })
  Coinhandler: Node = null;
  AgainClickedSettingButton: boolean = false;
  SingletonObject: singleton = null;
  actor: number;
  seconds = 20;
  sec: string = "";
  check: boolean = false;
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
      if (this.seconds > 0) {
        this.schedule(this.timeCounter, 0.5);
      }
      console.log("Game paused Menu Showed");
      if (!this.check) {
        this.gamePause();
      }
    } else {
      this.SettingPopUp.active = false;
      this.AgainClickedSettingButton = false;
      console.log("Game Resumed");
      this.gameResume();
    }
  }
  /**
   * Resume the Game After clicking Resume Button
   */
  gameResume() {
    this.SingletonObject.photonobj.raiseEvent(MultiPlayerEvent.GameResume, "Game Resume by", {
      targetActors: [this.actor],
    });
    this.buttonClickedSoundEffect("buttonClickSound");

    this.SettingPopUp.active = false;
    this.AgainClickedSettingButton = false;
    this.SingletonObject.Coins1.getComponent(coinUpdater).updationStart();
    this.SingletonObject.Coins2.getComponent(coinUpdater).updationStart();
    this.SingletonObject.AntsHolder_B.children.forEach((element) => {
      TweenSystem.instance.ActionManager.resumeTarget(element);
    });
    this.SingletonObject.AntsHolder_A.children.forEach((element) => {
      TweenSystem.instance.ActionManager.resumeTarget(element);
    });
  }
  gamePause() {
    if (this.actor == 1) {
      this.SingletonObject.photonobj.raiseEvent(MultiPlayerEvent.GamePauseCounter, "PauseCounter", {
        targetActors: [this.actor],
      });

      this.SingletonObject.PauseCounter_B -= 1;
      this.SettingPopUp.getChildByName("PauseNode").children.length -= 1;
    } else {
      this.SingletonObject.photonobj.raiseEvent(MultiPlayerEvent.GamePauseCounter, "PauseCounter", {
        targetActors: [this.actor],
      });

      this.SingletonObject.PauseCounter_A -= 1;
      this.SettingPopUp.getChildByName("PauseNode").children.length -= 1;
    }
    console.log(this.SingletonObject.PauseCounter_A, this.SingletonObject.PauseCounter_B);

    this.SingletonObject.photonobj.raiseEvent(MultiPlayerEvent.GamePause, "Game Pause by", {
      targetActors: [this.actor],
    });
    this.seconds = 20;
    console.log("UNSCHEDULER");
    // console.log(this.SingletonObject.tweenHolder);

    this.SingletonObject.AntsHolder_B.children.forEach((element) => {
      TweenSystem.instance.ActionManager.pauseTarget(element);
    });
    this.SingletonObject.AntsHolder_A.children.forEach((element) => {
      TweenSystem.instance.ActionManager.pauseTarget(element);
    });

    this.SingletonObject.Coins1.getComponent(coinUpdater).unscheduling();
    this.SingletonObject.Coins2.getComponent(coinUpdater).unscheduling();
  }
  timeCounter() {
    if (this.seconds > 0) {
      this.seconds -= 1;
      // console.log(this.seconds);

      this.SettingPopUp.getChildByName("Timer").getComponent(Label).string = `${this.seconds}`;
    }
    if (this.seconds == 0) {
      this.gameResume();
      this.seconds = -1;
    }
  }

  // if (!this.SingletonObj.multiplayer) {

  update(deltaTime: number) {
    // console.log(
    //   this.SingletonObject.AntPlayer,
    //   this.actor,
    //   this.SingletonObject.PauseCounter_A,
    //   this.SingletonObject.PauseCounter_B,
    //   this.SingletonObject.multiplayer,
    //   this.check
    // );

    if (this.actor == 2 && this.SingletonObject.PauseCounter_A <= 0) {
      // console.log("IN UPDATE");

      this.check = true;
      // this.SettingPopUp.getChildByName("Resume").active = false;
    }
    if (
      this.actor == 1 &&
      this.SingletonObject.PauseCounter_B <= 0 &&
      !this.SingletonObject.multiplayer
    ) {
      this.check = true;
      // this.SettingPopUp.getChildByName("Resume").active = false;
    }
  }
  restartGame() {
    this.buttonClickedSoundEffect("buttonClickSound");
    this.node.destroy();
    director.resume();
    director.loadScene("MAP");
  }
}
