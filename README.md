# voxel-warriors
This project aims to develop a game with voxel-based graphics and a gameplay similar to capture the flag.

## play
Since this game is purely multiplayer based, it is required to join a server. You can therefore simply navigate to [www.voxel-warriors.com](http://www.voxel-warriors.com/) in order to find a list of active servers. It is also possible to setup a new server, what is further described below.

<p align="center"><img src="http://content.sniklaus.com/VoxRect/Website/ScreenshotThumb.png" alt="ScreenshotThumb"></p>

## server
Make sure to have `node` and `npm` installed. Otherwise, navigate to [nodejs.org](https://nodejs.org/) in order to download the latest binaries.

A prebuilt version of the server is being provided and can be [downloaded](http://content.sniklaus.com/VoxRect/Website/VoxRect.zip) accordingly. After unpacking it, go ahead and navigate to the root folder of the archive. Before `node` is being used to start the server, the dependencies can then be installed by calling `npm` within a console.

```
npm install
```

```
node VoxRect.js
```

several preferences of the game can furthermore be changed within `VoxConf.js`. To change the port on which the server is listening, open `NodeConf.js` and change the following line appropriately.

```javascript
NodeConf.intExpressPort = 15897;
```

To keep the server up and running, using `forever` is recommended. It can globally be installed through `npm` within a console and can then simply be utilized to start the server and keep it running. It is therefore no longer necessary to call `node` directly.

```
npm install forever -g
```

```
forever VoxRect.js
```

## development
Make sure to be able to start a server as described in the previous section. Since there is no actual compilation step, this is also everything that is required in order to develop the server.

In order to apply changes to the client and the editor, the code has to be combined with `browserify` and `uglifyify` however. These packages can globally be installed through `npm` within a console.

```
npm install browserify -g
```

```
npm install uglifyify -g
```

After `browserify` and `uglifyify` are available, the batch files can be used in order to perform the required combination.

## architecture
In order to gain a quick overview of the architecture, the following diagram can be consulted. Since it is only a sketch, it does not follow a specific format.

<p align="center"><img src="http://content.sniklaus.com/VoxRect/Website/Architecture.png" alt="Architecture"></p>

`NoteRect.js` is a basic library that is also being used in other projects. It is therefore quite generic and developers can probably just ignore it.

`VoxRect.js` is the webserver that handles all the communication between the clients. In order to appear in the list of active servers, it furthermore frequently reports to the master server.

`index.debug.js` is the client, which is being delivered when accessing the server. The connection to the server is continually kept alive, in order to keep the state of the game up to date.

`editor.debug.js` is a very basic editor, which is being used to create the maps. It is necessary to access this component via the server since the images are otherwise linked incorrectly.

## dependencies
Since the project consists of several components and each component has individual dependencies, they are being listed separately.

### `VoxRect.js`
* `node` / `npm`
* `schemapack`
* `socket.io`
* `express`

### `index.debug.js`
* `node` / `npm`
* `schemapack`
* `socket.io`
* `voxel-engine` / `voxel-highlight` / `minecraft-skin`
* `browserify` / `uglify-js`
* `jquery` / `moment`
* `bootstrap`

### `editor.debug.js`
* `node` / `npm`
* `schemapack`
* `voxel-engine` / `voxel-highlight` / `minecraft-skin`
* `browserify` / `uglify-js`
* `jquery` / `moment`
* `bootstrap`

### `libPhysics.debug.js`
* `gpp`

## images
* [joedeluxe](http://www.minecraftforum.net/forums/mapping-and-modding/resource-packs/1244027-64x-1-7-2-traditional-beauty/)
* [mrtomcinns](http://www.minecraftskins.com/skin/3371575/slime-warrior/)

## license
Please refer to the appropriate file within this repository.