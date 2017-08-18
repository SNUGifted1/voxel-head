#voxel-warriors
this project aims to develop a game with voxel based graphics and a gameplay similar to capture the flag.

##play
since this game is purely multiplayer based, it is required to join a server. you can therefore simply navigate to [www.voxel-warriors.com](http://www.voxel-warriors.com/) in order to find a list of active servers. it is also possible to setup a new server, what is further described below.

<p align="center"><img src="http://content.coderect.com/VoxRect/Website/ScreenshotThumb.png" alt="ScreenshotThumb"></p>

##server
make sure to have `node` and `npm` installed. otherwise navigate to [nodejs.org](https://nodejs.org/) in order to download the latest binaries.

a prebuilt version of the server is being provided and can be [downloaded](http://content.coderect.com/VoxRect/Website/VoxRect.zip) accordingly. after unpacking it, go ahead and navigate to the root folder of the archive. before `node` is being used to start the server, the dependencies can then be installed by calling `npm` within a console.

```
npm install
```

```
node VoxRect.js
```

several preferences of the game can furthermore be changed within `VoxConf.js`. to change the port on which the server is listening, open `NodeConf.js` and change the following line appropriately.

```javascript
NodeConf.intExpressPort = 15897;
```

to keep the server up and running, using `forever` is recommended. it can globally be installed through `npm` within a console and can then simply be utilized to start the server and keep it running. it is therefore no longer necessary to call `node` directly.

```
npm install forever -g
```

```
forever VoxRect.js
```

##development
make sure to be able to start a server as described in the previous section. since there is no actual compilation step, this is also everything that is required in order to develop the server.

in order to apply changes of the client and the editor, the code has to be combined with `browserify` and `uglifyify` however. these packages can globally be installed through `npm` within a console.

```
npm install browserify -g
```

```
npm install uglifyify -g
```

after `browserify` and `uglifyify` are available, the batch files can be used in order to perform the required combination.

##architecture
in order to gain a quick overview of the architecture, the following diagram can be consulted. since it is only a sketch, it does not follow a specific format.

<p align="center"><img src="http://content.coderect.com/VoxRect/Website/Architecture.png" alt="Architecture"></p>

`NoteRect.js` is a basic library that is also being used in other projects. it is therefore quite generic and developers can probably just ignore it.

`VoxRect.js` is the webserver that handles all the communication between the clients. in order to appear in the list of active servers, it furthermore frequently reports to the master server.

`index.debug.js` is the client, which is being delivered when accessing the server. the connection to the server is continually kept alive, in order to keep the state of the game up to date.

`editor.debug.js` is a very basic editor, which is being used to create the maps. it is necessary to access this component via the server, since the images are otherwise linked incorrectly.

##dependencies
since the project consists of several components and each component has individual dependencies, they are being listed separately.

###`VoxRect.js`
* `node` / `npm`
* `schemapack`
* `socket.io`
* `express`

###`index.debug.js`
* `node` / `npm`
* `schemapack`
* `socket.io`
* `voxel-engine` / `voxel-highlight` / `minecraft-skin`
* `browserify` / `uglify-js`
* `jquery` / `moment`
* `bootstrap`

###`editor.debug.js`
* `node` / `npm`
* `schemapack`
* `voxel-engine` / `voxel-highlight` / `minecraft-skin`
* `browserify` / `uglify-js`
* `jquery` / `moment`
* `bootstrap`

###`libPhysics.debug.js`
* `gpp`

##images
* [joedeluxe](http://www.minecraftforum.net/forums/mapping-and-modding/resource-packs/1244027-64x-1-7-2-traditional-beauty/)
* [mrtomcinns](http://www.minecraftskins.com/skin/3371575/slime-warrior/)

##license
please refer to the appropriate file within this repository.

##자바말
이런 위의 기본적인 기능에 자바말이 추가되었습니다.<br>
현재 Voxel 자바말에서 쓸 수 있는 명령어는 다음과 같습니다.
```
/do [명령]
```
명령을 실행합니다.
```
/do_숫자 [명령]
```
명령을 실행하되, 함수는 숫자 만큼 해체합니다.
```
/promise [함(변)수명] [값]
```
함수 또는 변수를 약속합니다.<br>
값이 숫자인 경우 변수로 약속되고, 아니면 함수로 약속됩니다.<br>
함수명 또는 변수명은 한 글자여야 합니다.

Voxel 자바말에서 사용할 수 있는 명령은 다음과 같습니다.
```
s
```
거북이가 앞으로 한 칸 이동한 뒤 흙을 쌓습니다.
```
S
```
거북이가 앞으로 한 칸 이동한 뒤 벽돌을 쌓습니다.
```
d
```
거북이가 아래로 한 칸 이동한 뒤 흙을 쌓습니다.
```
u
```
거북이가 위로 한 칸 이동한 뒤 흙을 쌓습니다.
```
l
```
거북이가 왼쪽으로 한 칸 이동한 뒤 흙을 쌓습니다.
```
L
```
거북이가 왼쪽으로 90° 회전합니다.
```
r
```
거북이가 오른쪽으로 한 칸 이동한 뒤 흙을 쌓습니다.
```
R
```
거북이가 오른쪽으로 90° 회전합니다.
```
c
```
거북이가 흙을 쌓습니다.
```
h
```
거북이가 흙을 쌓는 대신 블럭을 부숩니다.
```
(변수)[명령]
```
[명령]을 (변수)회 실행합니다.
```
(실행식)
```
(실행식)을 eval로 실행합니다. 괄호 안의 식이 완전한 변수가 아닌 경우 실행식으로 간주됩니다.
```
[ ]
```
[는 현재 거북이의 위치와 방향을 저장하고, ]는 그것을 불러옵니다.<br>
여러 개 사용할 수도 있습니다.
```
< >
```
< >는 안의 내용을 앞의 숫자만큼 반복합니다.<br>
예) 5\<su\> = 5s5u<br>
기능 구현을 위해 만들어진 임시 명령입니다. 실제로 존재하는지는 불명
```
(##(블럭 이름))
```
거북이가 설치하는 블럭의 이름을 바꿉니다.
예) (\#\#voxelBrick)
##자바말 드론
개인용 드론도 지원됩니다.<br>
드론 관련 명령어는 다음과 같습니다.
```
/makeDrone
```
드론을 생성합니다. 드론이 있으면 안 됩니다.
```
/removeDrone
```
드론을 제거합니다. 드론이 없으면 안 됩니다.
```
/drone_숫자 (자바말)
```
자바말을 드론에 실행합니다. 자바말 관련은 위쪽을 보면 됩니다.
