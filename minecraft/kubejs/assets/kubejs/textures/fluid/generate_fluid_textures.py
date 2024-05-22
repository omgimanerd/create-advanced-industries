#!/usr/bin/env python3

from PIL import Image
from os import path

from transforms import RGBTransform


def get_path(p):
    loc = __file__
    parent_dir = path.dirname(loc)
    return path.join(parent_dir, p)


METAL_FLUIDS = {
    "molten_iron.png": (90, 3, 3),
    "molten_copper.png": (163, 59, 31),
    "molten_gold.png": (236, 209, 41),
    "molten_zinc.png": (174, 189, 168),
    "molten_brass.png": (209, 156, 57),
    "molten_lead.png": (38, 38, 83),
    "molten_silver.png": (168, 184, 191),
    "molten_glass.png": (206, 231, 230),
    "molten_quartz.png": (158, 153, 153),
    "molten_diamond.png": (30, 194, 195),
    "molten_emerald.png": (22, 189, 110),
    "molten_lapis.png": (44, 92, 200),
    "molten_redstone.png": (135, 21, 21)
}


if __name__ == '__main__':

    template_fluid_img = Image.open(
        get_path('template_fluid.png')).convert('RGB')
    with open(get_path('template_fluid.png.mcmeta')) as f:
        template_fluid_mcmeta = f.read()

    for (imagename, color) in METAL_FLUIDS.items():
        img = RGBTransform().mix_with(color, factor=0.9).applied_to(
            template_fluid_img)
        img.save(get_path(imagename))
        with open(get_path(f'{imagename}.mcmeta'), 'w') as f:
            f.write(template_fluid_mcmeta)
