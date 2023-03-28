//Background music
// Ant Instantiate At Start Scene
import {
  _decorator,
  Component,
  Node,
  instantiate,
  Prefab,
  AudioClip,
  AudioSource,
  resources,
} from "cc";
import AudioControllerObject from "../ClassScripts/AudioController";
import { AudioSourceManager } from "../ClassScripts/AudioSourceManager";
import { singleton } from "../ClassScripts/singleton";

import { InitialAntMovement } from "./InitialAntMovement";

const { ccclass, property } = _decorator;

@ccclass("IntialAntsMaker")
export class IntialAntsMaker extends Component {
  //properties
  @property({ type: Prefab })
  antPrefab: Prefab = null;
  @property({ type: Node })
  antNode: Node;
  @property({ type: Node })
  loader: Node = null;
  @property({ type: Node })
  audiosource = null;
  @property({ type: Node })
  player1: Node = null;
  // Variable
  SingletonObject: singleton = null;
  /**
   * @description Play Background Music/Audio
   * @param ClipName Name of Clip to play
   */
  backgroundAudioClip(ClipName: string) {
    let audio = this.SingletonObject.getAudioFile(ClipName);

    AudioControllerObject.playMusic(audio);
  }
  /**
   * @description instance of ant is made here
   * @returns antObject
   */
  makeAnt() {
    let antObject = instantiate(this.antPrefab);
    return antObject;
  }
  start() {
    this.audiosource.getComponent(AudioSourceManager).initAudioSource();
    this.SingletonObject = singleton.getInstance();
    this.backgroundAudioClip("Wallpaper");

    this.loader.active = false;

    for (var i = 0; i < Math.floor(Math.random() * 2) + 10; i++) {
      var newAnt = this.makeAnt();

      newAnt.getComponent(InitialAntMovement).setInitialPosition(this.node);
      newAnt.getComponent(InitialAntMovement).startMovement();
    }
  }

  update(deltaTime: number) {}
}
