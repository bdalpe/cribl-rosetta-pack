# Build Script for Rosetta Pack

Compiles Windows Logging templates. Templates can be found at https://github.com/nasbench/EVTX-ETW-Resources.

## Build

To compile the lookup from the source, use the following script:

```bash
./build.sh
```

Note: if you want to use a different system version to build the lookup, update the `MANIFEST` variable definition.

The contents of the lookup will be placed into `template.csv` inside this folder.

## Clean

To remove all build resources, use the following script.

```bash
./clean.sh
```
