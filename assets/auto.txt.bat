@echo off
echo browserify/uglifyify �۾� ������... ��ø� ��ٷ� �ּ���.
browserify -t uglifyify index.debug.js > index.js | browserify -t uglifyify editor.debug.js > editor.js
echo �Ϸ�!
pause