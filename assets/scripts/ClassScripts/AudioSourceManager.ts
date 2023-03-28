import { _decorator, Component, Node, AudioSource } from "cc";
import AudioControllerObject from "./AudioController";
const { ccclass, property } = _decorator;

@ccclass("AudioSourceManager")
export class AudioSourceManager extends Component {
  @property(AudioSource)
  soundEffects: AudioSource = null!;

  @property(AudioSource)
  music: AudioSource = null!;

  start() {}

  initAudioSource() {
    // console.log(this.music);

    AudioControllerObject.initAudioSources(this.music, this.soundEffects);
  }

  update(deltaTime: number) {}
}
