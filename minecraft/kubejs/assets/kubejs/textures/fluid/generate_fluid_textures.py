#!/usr/bin/env python3

from PIL import Image
from os import path

from transforms import RGBTransform


def get_path(p):
    loc = __file__
    parent_dir = path.dirname(loc)
    return path.join(parent_dir, p)


METAL_FLUIDS = {
    "molten_iron": (90, 3, 3),  # 5a0303
    "molten_copper": (163, 59, 31),  # a33b1f
    "molten_gold": (236, 209, 41),  # ecd129
    "molten_zinc": (174, 189, 168),  # aebda8
    "molten_tin": (68, 105, 124),  # 44697c
    "molten_lead": (38, 38, 83),  # 262653
    "molten_silver": (168, 184, 191),  # a8b8bf
    "molten_nickel": (219, 207, 150),  # dbcf96

    "molten_brass": (209, 156, 57),  # d19c39
    "molten_invar": (132, 148, 148),  # 849494
    "molten_enderium": (12, 92, 124),  # 0c5c7c
    "molten_signalum": (162, 15, 0),  # a20f00
    "molten_constantan": (164, 100, 36),  # a46424
    "molten_lumium": (251, 243, 192),  # fbf3c0
    "molten_electrum": (188, 164, 76),  # bca44c
    "molten_bronze": (140, 68, 36),  # 8c4424
    "molten_netherite": (58, 57, 47),  # 44392f

    "molten_glass": (206, 231, 230),  # cee7e6
    "molten_quartz": (158, 153, 153),  # 9e9999
    "molten_diamond": (30, 194, 195),  # 1ec2c3
    "molten_emerald": (22, 189, 110),  # 16bd6e
    "molten_lapis": (44, 92, 200),  # 2c5cc8
    "molten_redstone": (135, 21, 21)  # 871515
}


if __name__ == '__main__':

    template_fluid_still_img = Image.open(
        get_path('template_fluid_still.png')).convert('RGB')
    with open(get_path('template_fluid_still.png.mcmeta')) as f:
        template_fluid_still_mcmeta = f.read()
    template_fluid_flow_img = Image.open(
        get_path('template_fluid_flow.png')).convert('RGB')
    with open(get_path('template_fluid_flow.png.mcmeta')) as f:
        template_fluid_flow_mcmeta = f.read()

    for (imagename, color) in METAL_FLUIDS.items():
        still_img = RGBTransform().mix_with(color, factor=0.8).applied_to(
            template_fluid_still_img)
        still_img.save(get_path(f'{imagename}_still.png'))

        with open(get_path(f'{imagename}_still.png.mcmeta'), 'w') as f:
            f.write(template_fluid_still_mcmeta)

        flow_img = RGBTransform().mix_with(color, factor=0.8).applied_to(
            template_fluid_flow_img)
        flow_img.save(get_path(f'{imagename}_flow.png'))

        with open(get_path(f'{imagename}_flow.png.mcmeta'), 'w') as f:
            f.write(template_fluid_flow_mcmeta)
