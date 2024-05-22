#!/usr/bin/env python3

from PIL import Image
from os import path

from transforms import RGBTransform


def get_path(p):
    loc = __file__
    parent_dir = path.dirname(loc)
    return path.join(parent_dir, p)


METAL_FLUIDS = {
    "molten_iron": (90, 3, 3),
    "molten_copper": (163, 59, 31),
    "molten_gold": (236, 209, 41),
    "molten_zinc": (174, 189, 168),
    "molten_brass": (209, 156, 57),
    "molten_lead": (38, 38, 83),
    "molten_silver": (168, 184, 191),
    "molten_glass": (206, 231, 230),
    "molten_quartz": (158, 153, 153),
    "molten_diamond": (30, 194, 195),
    "molten_emerald": (22, 189, 110),
    "molten_lapis": (44, 92, 200),
    "molten_redstone": (135, 21, 21)
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
        still_img = RGBTransform().mix_with(color, factor=0.9).applied_to(
            template_fluid_still_img)
        still_img.save(get_path(f'{imagename}_still.png'))

        with open(get_path(f'{imagename}_still.png.mcmeta'), 'w') as f:
            f.write(template_fluid_still_mcmeta)

        flow_img = RGBTransform().mix_with(color, factor=0.9).applied_to(
            template_fluid_flow_img)
        flow_img.save(get_path(f'{imagename}_flow.png'))

        with open(get_path(f'{imagename}_flow.png.mcmeta'), 'w') as f:
            f.write(template_fluid_flow_mcmeta)
