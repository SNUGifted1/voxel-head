@echo off
echo browserify/uglifyify 작업 진행중... 잠시만 기다려 주세요.
browserify -t uglifyify index.debug.js > index.js | browserify -t uglifyify editor.debug.js > editor.js
echo 완료!
pause