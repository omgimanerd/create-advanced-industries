#!/usr/bin/env python3
'''Builds the modpack's client and server zipfile from the current minecraft/
directory contents.'''

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
    'kubejs/config/probe*',
    'kubejs/probe*',
    'kubejs/startup_scripts/@recipes',
    '*__pycache__',
    '*.py',
    '*.committed',
    '*.bak',
    '*.gitignore'
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
    'kubejs/config/probe*',
    'kubejs/probe*',
    'mods/probejs*',
    'mods/Xaeros*',
    '*__pycache__',
    '*.py',
    '*.committed',
    '*.bak',
    '*.gitignore'
]

# Resource packs which must be included.
RESOURCEPACK_MANIFEST = [
    # https://www.curseforge.com/minecraft/texture-packs/create-new-age-retexture
    {
        "fileID": 5864882,
        "projectID": 1068890,
        "required": True
    },
    # https://www.curseforge.com/minecraft/texture-packs/create-advanced-industries-main-menu
    {
        "fileID": 6365115,
        "projectID": 1231605,
        "required": True
    }
]

EXCLUDE_MANIFEST = [
    'probejs.pw.toml',
    'reforgedplay-mod.pw.toml'
]

FILE_DIR = pathlib.Path(__file__).parent.absolute()


def generate_manifest(template_path: pathlib.Path, mods_path: pathlib.Path,
                      version_: str) -> dict:
    '''Generates the manifest.json from the template manifest and mods
    directory. Does not package resource packs. CurseForge resource packs should
    be hardcoded into the manifest template.

    Args:
      template_path: The path to the manifest_template.json file to use as
        a template.
      mods_path: The path to the mods/ directory.
      version_: The version string to encode into the manifest template.

    Returns:
      The manifest as a JSON-serializable dictionary.
    '''
    with open(template_path, encoding='utf-8') as template_f:
        manifest = json.load(template_f)
    manifest['version'] = version_
    files = []
    for filename in mods_path.glob('*.toml'):
        if filename.name in EXCLUDE_MANIFEST:
            print(f'Excluding {filename.name} from manifest.json')
            continue
        with open(filename, 'r', encoding='utf-8') as mod_toml_f:
            data = toml.loads(mod_toml_f.read())
        files.append({
            'fileID': data['update']['curseforge']['file-id'],
            'projectID': data['update']['curseforge']['project-id'],
            'required': True
        })
    for obj in RESOURCEPACK_MANIFEST:
        files.append(obj)
    manifest['files'] += files
    return manifest


def copy_pack_files(
        mc_dir: pathlib.Path,
        destination: pathlib.Path,
        include: list[str],
        exclude: list[str]):
    '''Copies all the include patterns into destination, excluding any files
    that match the exclusion pattern.

    Args:
        mc_dir: the absolute path to the minecraft/ directory to start searching
          from
        destination: the absolute path to the destination directory to copy
          files to
        include: list of directories and files to include, relative to mc_dir
        exclude: patterns for directories or files to exclude, relative to
          mc_dir
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


if __name__ == '__main__':
    # Get the version from args or git tag. This is just for naming and for
    # generating the manifest.
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
    print('Wiped tmp directory')
    TMP_DIR_CLIENT = TMP_DIR / 'client'
    TMP_DIR_SERVER = TMP_DIR / 'server'

    # Clear output directory
    OUTPUT_DIR = FILE_DIR / 'output'
    if OUTPUT_DIR.exists():
        shutil.rmtree(OUTPUT_DIR.absolute())
    OUTPUT_DIR.mkdir()
    print('Wiped output directory')

    MC_DIR = FILE_DIR.parent / 'minecraft'

    # Client zip
    print('Packaging client modpack...')
    # Client zip files need to go inside an 'overrides' subdirectory
    copy_pack_files(MC_DIR, TMP_DIR_CLIENT / 'overrides',
                    INCLUDE_CLIENT, EXCLUDE_CLIENT)
    # Write the manifest.json, which must be copied into the root of the modpack
    with open(TMP_DIR_CLIENT / 'manifest.json', 'w+',
              encoding='utf-8') as f:
        json.dump(generate_manifest(
            FILE_DIR / 'manifest_template.json', MC_DIR / 'mods/.index',
            version), f, indent=2, sort_keys=True)
    # Package the modpack files into a zip file
    shutil.make_archive(
        OUTPUT_DIR / OUTPUT_PREFIX, 'zip',
        root_dir=TMP_DIR_CLIENT.absolute())
    print('Finished packaging', f'{OUTPUT_PREFIX}.zip')

    # Server zip
    print('Packaging server zipfile')
    copy_pack_files(MC_DIR, TMP_DIR_SERVER,
                    INCLUDE_SERVER, EXCLUDE_SERVER)
    shutil.make_archive(
        OUTPUT_DIR / f'{OUTPUT_PREFIX}-server', 'zip',
        root_dir=TMP_DIR_SERVER.absolute())
    print('Finished packaging', f'{OUTPUT_PREFIX}-server.zip')
