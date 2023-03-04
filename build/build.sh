#!/bin/bash
cd "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

npm install

git clone --depth 1 --filter=blob:none --sparse git@github.com:nasbench/EVTX-ETW-Resources.git
cd EVTX-ETW-Resources || exit

MANIFEST="WindowsServer/2022/WindowsServer2022_21H2_Standard_20230221_20348.1547"
git sparse-checkout set "ETWProvidersManifests/${MANIFEST}/WEPExplorer"
cd ..

ln -s EVTX-ETW-Resources/ETWProvidersManifests/${MANIFEST}/WEPExplorer source

node compile.js $MANIFEST
