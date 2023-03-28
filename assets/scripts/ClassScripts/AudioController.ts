/**
 * @description singleton of sounds
 */
import { _decorator, Component, Node, AudioSource, AudioClip } from "cc";
const { ccclass, property } = _decorator;

@ccclass("AudioController")
class AudioController {
  private static _instance: AudioController = null;
  private _musicAudioSource: AudioSource = null;
  private _soundEffetcAudioSource: AudioSource = null;

  static getInstance(): AudioController {
    if (!AudioController._instance) {
      AudioController._instance = new AudioController();
    }
    return AudioController._instance;
  }
  initAudioSources(
    musicAudioSource: AudioSource,
    soundEffetcsAudioSource: AudioSource
  ) {
    this._musicAudioSource = musicAudioSource;
    this._soundEffetcAudioSource = soundEffetcsAudioSource;
  }
  playMusic(clip: AudioClip) {
    this._musicAudioSource.stop();
    this._musicAudioSource.clip = clip;
    this._musicAudioSource.play();
    this._musicAudioSource.loop = true;
  }

  playSoundEffetcs(clip: AudioClip) {
    this._soundEffetcAudioSource.stop();
    this._soundEffetcAudioSource.clip = clip;
    this._soundEffetcAudioSource.play();
  }

  pauseAudio() {
    this._soundEffetcAudioSource.pause();
  }
}
const AudioControllerObject = AudioController.getInstance();
export default AudioControllerObject;
