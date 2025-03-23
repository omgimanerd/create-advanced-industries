#!/usr/bin/env python3
'''Builds the modpack's client and server zipfile.
'''

import fnmatch
import json
import os
import pathlib
import shutil
import subprocess
import sys
import toml

# Relative to minecraft/
INCLUDE_CLIENT = [
    'config',
    'defaultconfigs',
    'kubejs',
    # Curseforge resource packs should be added to manifest_template.json as
    # manual project IDs and files.
    'resourcepacks',
    'icon.png'
]

EXCLUDE_CLIENT = [
    'config/adaptive_performance_tweaks/spawn/*',
    'config/ars_elemental/glyph_*.toml',
    'config/ars_nouveau/glyph_*.toml',

    'config/jei/world*',
    'config/embeddium-fingerprint.json',
    'config/xaerominimap*',
    'config/xaeroworldmap*',
    'kubejs/probe*',
    'kubejs/startup_scripts/@recipes',
    '*__pycache__',
    '*.committed',
    '*.bak'
]

INCLUDE_SERVER = [
    'config',
    'defaultconfigs',
    'kubejs',
    'mods',
    'icon.png',
    'server.properties',
    'start.sh',
    'variables.txt'
]

EXCLUDE_SERVER = [
    'config/jei/world/*',
    'config/fancymenu/*',
    'config/embeddium-fingerprint.json',
    'config/xaerominimap*',
    'config/xaeroworldmap*',
    'kubejs/probe*',
    'mods/probejs*',
    'mods/Xaeros*',
    '*__pycache__',
    '*.committed',
    '*.bak'
]

FILE_DIR = pathlib.Path(__file__).parent.absolute()


def generate_manifest(template_path: pathlib.Path, mods_path: pathlib.Path,
                      version_: str):
    '''Generates the manifest.json from the template manifest and mods
    directory. Does not package resource packs. CurseForge resource packs should
    be hardcoded into the manifest template.

    Args:
      template_path: The path to the manifest_template.json file to use as
        a template.
      mods_path: The path to the mods/ directory.
      version_: The version string to encode into the manifest template.
    '''
    with open(template_path, encoding='utf-8') as f:
        manifest = json.load(f)
    manifest['version'] = version_
    files = []
    for f in mods_path.glob('*.toml'):
        with open(f, 'r', encoding='utf-8') as f_:
            data = toml.loads(f_.read())
        files.append({
            'fileID': data['update']['curseforge']['file-id'],
            'projectID': data['update']['curseforge']['project-id'],
            'required': True
        })
    manifest['files'] += files
    return manifest


def copy_pack_files(include: list[str], exclude: list[str],
                    destination: pathlib.Path, mc_dir: pathlib.Path,
                    version_: str):
    '''Copies all the include patterns into destination, excluding any files
    that match the exclusion pattern.

    Args:
        include: list of directories and files to include, relative to mc_dir
        exclude: patterns for directories or files to exclude, relative to
          mc_dir
        destination: the absolute path to the destination directory to copy
          files to
        mc_dir: the absolute path to the minecraft/ directory to start searching
          from
    '''
    # Argument to shutil.copytree's ignore kwargs
    def ignore_callback(path, names):
        # Resolve all paths relative to the minecraft directory
        path = pathlib.Path(path).relative_to(mc_dir)

        def should_exclude(name):
            for pattern in exclude:
                if fnmatch.fnmatch(path / name, pattern):
                    return True
            return False
        return list(filter(should_exclude, names))

    def copy_callback(src, dst, *args, **kwargs):
        print(f'Copying {src.replace(str(mc_dir), "")}')
        return shutil.copy2(src, dst, *args, **kwargs)

    # Copy over all necessary files for the modpack.
    for pattern in include:
        target = mc_dir / pattern
        subdir = destination / pattern
        if target.is_dir():
            shutil.copytree(target.absolute(), subdir.absolute(),
                            ignore=ignore_callback, copy_function=copy_callback,
                            dirs_exist_ok=True)
        else:
            os.makedirs(subdir.parent, exist_ok=True)
            shutil.copyfile(target.absolute(), subdir)
            print(f'Copying {target.absolute().relative_to(mc_dir)}')
    print('Finished copying files...')

    # Generate manifest.json
    manifest = generate_manifest(
        FILE_DIR / 'manifest_template.json', mc_dir / 'mods/.index', version_)
    with open(destination / 'manifest.json', 'w+', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2, sort_keys=True)


if __name__ == '__main__':
    # Get the version from args or git tag.
    if len(sys.argv) == 2:
        version = sys.argv[1]
    p = subprocess.run(
        ['git', 'describe', '--tags', '--abbrev=0'],
        cwd=pathlib.Path(__file__).parent.absolute(), capture_output=True,
        check=False)
    version = p.stdout.strip().decode('utf-8')
    OUTPUT_PREFIX = f'create-advanced-industries-{version}'

    # Reset the TMP_DIR
    TMP_DIR = FILE_DIR / 'tmp'
    if TMP_DIR.exists():
        shutil.rmtree(TMP_DIR.absolute())
    TMP_DIR.mkdir(exist_ok=True)
    OVERRIDES_DIR = TMP_DIR / 'overrides'
    print('Wiped tmp directory')

    # Clear output directory
    OUTPUT_DIR = FILE_DIR / 'output'
    if OUTPUT_DIR.exists():
        shutil.rmtree(OUTPUT_DIR.absolute())
    OUTPUT_DIR.mkdir()
    print('Wiped output directory')

    MC_DIR = FILE_DIR.parent / 'minecraft'

    # Client zip
    print('Packaging client zipfile')
    tmpDir = TMP_DIR / 'client'
    copy_pack_files(INCLUDE_CLIENT, EXCLUDE_CLIENT, tmpDir, MC_DIR, version)
    shutil.make_archive(
        OUTPUT_DIR / OUTPUT_PREFIX, 'zip', tmpDir.absolute(), '.')

    # Server zip
    print('Packaging server zipfile')
    tmpDir = TMP_DIR / 'server'
    copy_pack_files(INCLUDE_SERVER, EXCLUDE_SERVER, tmpDir, MC_DIR, version)
    shutil.make_archive(
        OUTPUT_DIR / f'{OUTPUT_PREFIX}-server', 'zip', tmpDir.absolute(), '.')
