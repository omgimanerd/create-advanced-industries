#!/usr/bin/env python3

import re


def main():
    def sort_criteria(mod_name):
        # Ensure that Vanilla Minecraft comes first.
        if mod_name == 'Minecraft':
            return '0'
        return re.sub(r'[Cc]reate[\s:]*', 'Create ', mod_name).upper()

    mods = None
    with open('ingredient-list-mod-sort-order.ini') as f:
        mods = f.read().strip().split('\n')
    mods = sorted(mods, key=sort_criteria)
    with open('ingredient-list-mod-sort-order.ini', 'w') as f:
        f.write('\n'.join(mods) + '\n')
    print('New sort order:')
    print('\n'.join(mods))


if __name__ == '__main__':
    main()
