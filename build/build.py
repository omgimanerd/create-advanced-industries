#!/usr/bin/env python3

import fnmatch
import json
import pathlib
import shutil
import subprocess
import sys
import toml

# Relative to minecraft/
INCLUDE = [
    'config',
    'defaultconfigs',
    'kubejs',
    'resourcepacks',
]

EXCLUDE = [
    'kubejs/probe*',
    'config/jei/world*',
    'config/embeddium-fingerprint.json',
    '*__pycache__',
    '*.committed',
    '*.bak'
]


def generate_manifest(template_path: pathlib.Path, mods_path: pathlib.Path,
                      version: str):
    '''Generates the manifest.json from the template manifest and mods
    directory'''
    with open(template_path) as f:
        manifest = json.load(f)
    manifest['version'] = version
    files = []
    for f in mods_path.glob('*.toml'):
        with open(f, 'r') as f_:
            data = toml.loads(f_.read())
        files.append({
            'fileID': data['update']['curseforge']['file-id'],
            'projectID': data['update']['curseforge']['project-id'],
            'required': True
        })
    manifest['files'] = files
    return manifest


if __name__ == '__main__':
    FILE_DIR = pathlib.Path(__file__).parent.absolute()

    # Get the version from args or git tag.
    if len(sys.argv) == 2:
        version = sys.argv[1]
    p = subprocess.run(
        ['git', 'describe', '--tags', '--abbrev=0'],
        cwd=pathlib.Path(__file__).parent.absolute(), capture_output=True)
    version = p.stdout.strip().decode('utf-8')

    # Reset the TMP_DIR
    TMP_DIR = FILE_DIR / 'tmp'
    if TMP_DIR.exists():
        shutil.rmtree(TMP_DIR.absolute())
    TMP_DIR.mkdir(exist_ok=True)
    OVERRIDES_DIR = TMP_DIR / 'overrides'

    # Clear output directory
    OUTPUT_DIR = FILE_DIR / 'output'
    if OUTPUT_DIR.exists():
        shutil.rmtree(OUTPUT_DIR.absolute())
    OUTPUT_DIR.mkdir()

    MC_DIR = FILE_DIR.parent / 'minecraft'

    # Argument to shutil.copytree's ignore kwargs
    def ignore_callback(path, names):
        # Resolve all paths relative to the minecraft directory
        path = pathlib.Path(path).relative_to(MC_DIR)

        def should_exclude(name):
            for pattern in EXCLUDE:
                if fnmatch.fnmatch(path / name, pattern):
                    return True
            return False

        return list(filter(should_exclude, names))

    # Copy over all necessary directories for the modpack.
    for folder in INCLUDE:
        shutil.copytree((MC_DIR / folder).absolute(),
                        (OVERRIDES_DIR / folder).absolute(), ignore=ignore_callback, dirs_exist_ok=True)

    # Generate manifest.json
    manifest = generate_manifest(
        FILE_DIR / 'manifest_template.json', MC_DIR / 'mods/.index', version)
    with open(TMP_DIR / 'manifest.json', 'w+') as f:
        json.dump(manifest, f, indent=2, sort_keys=True)

    # Build zip archive
    zipfile = f'create-advanced-industries-{version}'
    shutil.make_archive(
        OUTPUT_DIR / zipfile, 'zip', TMP_DIR.absolute(), '.')

    print(f'Successfully packaged {zipfile}.zip')
