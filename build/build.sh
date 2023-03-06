#!/bin/bash
cd "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

npm install

git clone --depth 1 --filter=blob:none --sparse git@github.com:nasbench/EVTX-ETW-Resources.git
cd EVTX-ETW-Resources || exit

MANIFEST="Windows11/22H2/W11_22H2_Pro_20230221_22621.1265"
git sparse-checkout set "ETWProvidersManifests/${MANIFEST}/WEPExplorer"
cd ..

ln -sn EVTX-ETW-Resources/ETWProvidersManifests/${MANIFEST}/WEPExplorer source

node compile.js $MANIFEST
