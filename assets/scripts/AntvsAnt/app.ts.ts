// <reference path="Photon/Photon-Javascript_SDK.d.ts"/>

import cloudAppInfo from "./cloud-app-info";
// fetching app info global variable while in global context
var DemoWss = cloudAppInfo["default"] && cloudAppInfo["default"]["Wss"];
var DemoAppId =
  cloudAppInfo["default"] && cloudAppInfo["default"]["AppId"]
    ? cloudAppInfo["default"]["AppId"]
    : "7f112f40-1f4b-491d-abfb-f9e38cb5ac8f";
var DemoAppVersion =
  cloudAppInfo["default"] && cloudAppInfo["default"]["AppVersion"]
    ? cloudAppInfo["default"]["AppVersion"]
    : "1.0";
var DemoMasterServer =
  cloudAppInfo["default"] && cloudAppInfo["default"]["MasterServer"]
    ? cloudAppInfo["default"]["MasterServer"]
    : null;
var NameServer =
  cloudAppInfo["default"] && cloudAppInfo["default"]["NameServer"]
    ? cloudAppInfo["default"]["NameServer"]
    : null;
var Region = cloudAppInfo["default"] && cloudAppInfo["default"]["Region"];
var ConnectOnStart = true;

export default class AntvsAnt extends Photon.LoadBalancing.LoadBalancingClient {
  private static instance: AntvsAnt = null;

  logger = new Exitgames.Common.Logger("Demo:");

  private USERCOLORS = [
    "#FF0000",
    "#00AA00",
    "#0000FF",
    "#FFFF00",
    "#00FFFF",
    "#FF00FF",
  ];

  constructor() {
    super(
      DemoWss ? Photon.ConnectionProtocol.Wss : Photon.ConnectionProtocol.Ws,
      DemoAppId,
      DemoAppVersion
    );

    this.logger.info(
      "Photon Version: " +
        Photon.Version +
        (Photon.IsEmscriptenBuild ? "-em" : "")
    );

    console.log(
      this.logger.format(
        "Init",
        this.getNameServerAddress(),
        DemoAppId,
        DemoAppVersion
      )
    );
    this.logger.info(
      "Init",
      this.getNameServerAddress(),
      DemoAppId,
      DemoAppVersion
    );
    this.setLogLevel(Exitgames.Common.Logger.Level.INFO);

    this.myActor().setCustomProperty("color", this.USERCOLORS[0]);
  }
  connectToServer() {
    if (ConnectOnStart) {
      console.log("in the connectOnstart");

      if (DemoMasterServer) {
        this.setMasterServerAddress(DemoMasterServer);
        this.connect();
      }
      if (NameServer) {
        this.setNameServerAddress(NameServer);
        this.connectToRegionMaster(Region || "IN");
      } else {
        this.connectToRegionMaster(Region || "IN");
        //this.connectToNameServer({ region: "EU", lobbyType: Photon.LoadBalancing.Constants.LobbyType.Default });
      }
    }
  }
  start() {
    // connect if no fb auth required
  }
  onError(errorCode: number, errorMsg: string) {
    console.log("Error " + errorCode + ": " + errorMsg);
  }

  onStateChange(state: number) {
    console.log("State change", state);

    // "namespace" import for static members shorter acceess
    var LBC = Photon.LoadBalancing.LoadBalancingClient;

    // var stateText = document.getElementById("statetxt");
    // stateText.textContent = LBC.StateToName(state);
    // this.updateRoomButtons();
    // this.updateRoomInfo();
  }

  onJoinRoom() {
    console.log("Game " + this.myRoom().name + " joined");
    // this.updateRoomInfo();
  }
  onActorJoin(actor: Photon.LoadBalancing.Actor) {
    console.log("actor " + actor.actorNr + " joined");
    // this.updateRoomInfo();
  }
  onActorLeave(actor: Photon.LoadBalancing.Actor) {
    console.log("actor " + actor.actorNr + " left");
    // this.updateRoomInfo();
  }
}
