#!/bin/bash
cd "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cp templates.csv ../data/lookups/win_template.csv

echo "size: $(ls -la templates.csv | tr -s ' ' | cut -f 5 -d' ')" > ../data/lookups/win_template.yml
echo "rows:$(cat templates.csv | wc -l | tr -s ' ')" >> ../data/lookups/win_template.yml
