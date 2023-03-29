import { singleton } from "../ClassScripts/singleton";
// <reference path="Photon/Photon-Javascript_SDK.d.ts"/>
import cloudAppInfo from "../AntvsAnt/cloud-app-info";
import { Button } from "cc";
import { MultiPlayerEvent } from "../ClassScripts/constants";
import { coinUpdater } from "../MapSceneComponents/coinUpdater";
// fetching app info global variable while in global context

export default class AntvsAnt extends Photon.LoadBalancing.LoadBalancingClient {
  private static instance: AntvsAnt = null;
  Actor: number = null;
  logger = new Exitgames.Common.Logger("Demo:");
  details;
  leave = 0;
  MapClickCount = 0;
  constructor() {
    console.log("Constructor callss");
    super(1, "7f112f40-1f4b-491d-abfb-f9e38cb5ac8f", "1.0");
  }
  connectToServer() {
    this.connectToRegionMaster("in");
  }
  start() {
    console.log("start fun");
  }
  onError(errorCode: number, errorMsg: string) {
    console.log("Error " + errorCode + ": " + errorMsg);
  }

  onStateChange(state: number) {
    if (this.isInLobby()) {
      this.joinRandomOrCreateRoom({ expectedMaxPlayers: 2 }, undefined, {
        maxPlayers: 2,
      });
    }
  }

  onJoinRoom() {
    console.log("Game " + this.myRoom().name + " joined");
    this.Actor = this.myActor().actorNr;

    singleton.getInstance().whichActor = this.Actor;
  }

  onActorJoin(actor: Photon.LoadBalancing.Actor) {
    console.log("actor " + actor.actorNr + " joined");
    this.leave = 0;
    if (actor.actorNr == 2) {
      singleton.getInstance().Loader.active = false;
      singleton.getInstance().TwoPlayer.getComponent(Button).interactable = true;
    }
  }

  onActorLeave(actor: Photon.LoadBalancing.Actor) {
    this.otherActorLeftroom();
  }
  otherActorLeftroom() {
    if (this.leave == 0) {
      this.leave = 1;
      this.disconnect();
      singleton.getInstance().quitGame();
    }
  }
  onEvent(code: MultiPlayerEvent, content: any, actorNr: number) {
    //  console.log("code----------", code, "content", content, "actorNr", actorNr);
    switch (code) {
      case MultiPlayerEvent.AntDetail:
        console.log(content);
        this.details = content;
        break;
      case MultiPlayerEvent.PathSelected:
        console.log("path select", content, actorNr);
        singleton.getInstance().multiplayerScript(2, content, this.details);
        break;
      case MultiPlayerEvent.GamePause:
        console.log(content, actorNr);
        singleton.getInstance().gamePause();
        break;
      case MultiPlayerEvent.AntDetail:
        console.log(content);
        this.details = content;
        break;
      case MultiPlayerEvent.PathSelected:
        console.log("path select", content, actorNr);
        singleton.getInstance().multiplayerScript(2, content, this.details);
        break;
      case MultiPlayerEvent.GamePause:
        console.log(content, actorNr);
        singleton.getInstance().gamePause();
        break;
      case MultiPlayerEvent.GameResume:
        console.log(content, actorNr);
        singleton.getInstance().gameResume();
        break;

      case MultiPlayerEvent.PlayerWait:
        this.MapClickCount++;

        console.log("mapclick", this.MapClickCount, "COOOntent", content);
        if (this.MapClickCount == 2) {
          this.MapClickCount = 0;

          setTimeout(() => {
            singleton.getInstance().Coins1.getComponent(coinUpdater).updationStart();
            singleton.getInstance().Coins2.getComponent(coinUpdater).updationStart();
          }, 1000);
        }
        break;

      case MultiPlayerEvent.GamePauseCounter:
        if (actorNr == 1) {
          singleton.getInstance().PauseCounter_A -= 1;
        } else {
          singleton.getInstance().PauseCounter_B -= 1;
        }

        switch (code) {
          default:
        }
        this.logger.debug("onEvent", code, "content:", content, "actor:", actorNr);
    }
  }
}
singleton.getInstance().photonobj = new AntvsAnt();
