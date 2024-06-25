<p align="center">
  <img src="minecraft/icon5.png" width="600" />
</p>

## Preface

If you enjoyed Create: Above and Beyond, Create: Astral, Create: Arcane
Engineering then you'll probably enjoy this pack.

As a Factorio player, there were many elements of those packs that I absolutely
loved and I wanted to design my own. I stand on the shoulders of giants and
this would absolutely not exist without the amazing work they've done to inspire
me.


## Summary

There are 6 [TBD] chapters of quest progression that work very similarly, in
which each chapter unlocks a mechanism which gates higher tier technology.
Everything has been balanced to work primarily around Create and its addons.


## Contributing

GitHub repository structure is intended for use with the Prism Launcher. I
haven't fully figured out to best integrate this with source control.

As best as I can tell, the least obnoxious way.
  - Drag zip file in, create modpack instance in folder Create
  - git clone git@github.com:omgimanerd/create-modpack tmp/
  - mv tmp/.git Create
  - rm -rf tmp/
  - cd Create/
  - git checkout .

Since quark-common.toml and packetfixer.properties keep modifying themselves,
the actual configs are committed, rather a static copy is kept, so you will
need to copy them.

```
cp minecraft/configs/packetfixer.properties.committed minecraft/configs/packetfixer.properties
cp minecraft/configs/quark-common.toml.committed minecraft/configs/quark-common.toml
```


## Packaging for release from Prism
Notes mostly for me.

- Tag release in git
- Export as curseforge zip
  - Tick `defaultconfigs/`, `kubejs/`, `icon.png`
  - Untick `options.txt`, `config/jei/world`


## Author(s)
  - omgimanerd


## License
  - [Mozilla Public License 2.0](LICENSE)
