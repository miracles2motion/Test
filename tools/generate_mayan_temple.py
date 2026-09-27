#!/usr/bin/env python3
"""
Mesoamerican Mayan Temple Generator for Blender
Constructs an authentic stepped pyramid with talud-tablero tiers, axial staircase,
balustrades, serpent heads, and apex sanctuary.
Exports high-poly / beveled GLB to assets/models/mayan_temple.glb.
"""

import sys
import os
import json

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from blender_bridge import execute_code, export_glb, clear_meshes

BLENDER_SCRIPT = r"""
import bpy
import bmesh
import math
from mathutils import Vector, Euler

# 1. Clear existing mesh objects
bpy.ops.object.select_all(action='DESELECT')
for obj in list(bpy.data.objects):
    if obj.type == 'MESH':
        obj.select_set(True)
bpy.ops.object.delete()

# Helper to create beveled box
def create_beveled_box(name, size, location, bevel_width=0.15, segments=2):
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=location)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = Vector(size)
    bpy.ops.object.transform_apply(scale=True)
    
    if bevel_width > 0:
        bev = obj.modifiers.new(name="Bevel", type='BEVEL')
        bev.width = bevel_width
        bev.segments = segments
        bev.limit_method = 'ANGLE'
        bev.angle_limit = math.radians(35)
    
    # Shading
    bpy.ops.object.shade_smooth()
    return obj

# 2. Build Stepped Ziggurat Tiers (Talud-Tablero style)
tier_configs = [
    # (width_x, width_z, height, y_elevation)
    (24.0, 24.0, 1.8, 0.9),
    (20.0, 20.0, 1.8, 2.7),
    (16.0, 16.0, 1.8, 4.5),
    (12.0, 12.0, 1.8, 6.3),
    (9.0, 9.0, 1.8, 8.1),
]

tiers = []
for i, (wx, wz, h, y) in enumerate(tier_configs):
    # Main platform body
    tier = create_beveled_box(f"Pyramid_Tier_{i+1}", (wx, wz, h), (0, 0, y), bevel_width=0.18)
    tiers.append(tier)
    
    # Cantilevered cornice lip around each tier
    cornice = create_beveled_box(f"Cornice_Tier_{i+1}", (wx + 0.6, wz + 0.6, 0.25), (0, 0, y + h/2 - 0.12), bevel_width=0.08)
    tiers.append(cornice)

# 3. Apex Sanctuary / High Temple
sanctuary_base = create_beveled_box("Sanctuary_Base", (6.5, 6.5, 2.4), (0, 0, 10.2), bevel_width=0.12)
# Slanted Mayan Roofcomb
roofcomb = create_beveled_box("Sanctuary_Roofcomb", (5.2, 5.2, 1.8), (0, 0, 12.2), bevel_width=0.2)
# Roof crest
crest = create_beveled_box("Sanctuary_Crest", (2.0, 4.0, 1.2), (0, 0, 13.5), bevel_width=0.1)

# Portal / Doorway Inset (North & South)
door_cut_n = create_beveled_box("Door_Aperture_N", (1.4, 0.4, 1.8), (0, 3.1, 10.0), bevel_width=0.05)
door_cut_s = create_beveled_box("Door_Aperture_S", (1.4, 0.4, 1.8), (0, -3.1, 10.0), bevel_width=0.05)

# 4. Axial Grand Staircases (South & North faces)
def build_staircase(face_dir=1): # 1 = South (+Y), -1 = North (-Y)
    step_count = 32
    total_h = 9.0
    total_d = 12.0
    step_h = total_h / step_count
    step_d = total_d / step_count
    stair_w = 4.0
    
    for s in range(step_count):
        cur_z = (s + 0.5) * step_h
        cur_y = face_dir * (12.0 - s * step_d)
        step = create_beveled_box(f"Step_{'S' if face_dir>0 else 'N'}_{s}", (stair_w, step_d * 1.2, step_h), (0, cur_y, cur_z), bevel_width=0.04, segments=1)

    # Balustrades flanking stairs (ramps)
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 0))
    ramp = bpy.context.active_object
    ramp.name = f"Balustrade_L_{'S' if face_dir>0 else 'N'}"
    ramp.scale = Vector((0.6, 13.5, 1.0))
    ramp.rotation_euler = Euler((math.radians(face_dir * -37), 0, 0), 'XYZ')
    ramp.location = (-stair_w/2 - 0.3, face_dir * 6.0, 4.5)
    bpy.ops.object.transform_apply(scale=True, rotation=True)
    bev = ramp.modifiers.new(name="Bevel", type='BEVEL')
    bev.width = 0.1
    
    # Right balustrade
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=(0, 0, 0))
    ramp_r = bpy.context.active_object
    ramp_r.name = f"Balustrade_R_{'S' if face_dir>0 else 'N'}"
    ramp_r.scale = Vector((0.6, 13.5, 1.0))
    ramp_r.rotation_euler = Euler((math.radians(face_dir * -37), 0, 0), 'XYZ')
    ramp_r.location = (stair_w/2 + 0.3, face_dir * 6.0, 4.5)
    bpy.ops.object.transform_apply(scale=True, rotation=True)
    bev_r = ramp_r.modifiers.new(name="Bevel", type='BEVEL')
    bev_r.width = 0.1

build_staircase(face_dir=1)   # South Grand Staircase
build_staircase(face_dir=-1)  # North Staircase

# 5. Serpent Heads at foot of South Staircase
def create_serpent_head(name, loc):
    # Base jaw
    jaw = create_beveled_box(f"{name}_Jaw", (0.8, 1.4, 0.6), loc, bevel_width=0.08)
    # Snout
    snout = create_beveled_box(f"{name}_Snout", (0.7, 0.8, 0.5), (loc[0], loc[1] + 0.6, loc[2] + 0.4), bevel_width=0.08)
    # Crest / Ear feather
    crest = create_beveled_box(f"{name}_Crest", (0.9, 0.4, 0.8), (loc[0], loc[1] - 0.4, loc[2] + 0.5), bevel_width=0.06)

create_serpent_head("Serpent_Head_L", (-2.3, 12.8, 0.4))
create_serpent_head("Serpent_Head_R", (2.3, 12.8, 0.4))

# 6. Ceremonial Fire Braziers at Temple Apex
def create_brazier(name, loc):
    bpy.ops.mesh.primitive_cylinder_add(radius=0.5, depth=0.8, location=loc)
    pot = bpy.context.active_object
    pot.name = name
    bev = pot.modifiers.new(name="Bevel", type='BEVEL')
    bev.width = 0.05
    # Lip
    bpy.ops.mesh.primitive_torus_add(major_radius=0.55, minor_radius=0.08, location=(loc[0], loc[1], loc[2] + 0.4))

create_brazier("Brazier_NW", (-2.4, -2.4, 9.4))
create_brazier("Brazier_NE", (2.4, -2.4, 9.4))
create_brazier("Brazier_SW", (-2.4, 2.4, 9.4))
create_brazier("Brazier_SE", (2.4, 2.4, 9.4))

print("Mayan Stepped Temple successfully constructed in Blender!")
"""

def main():
    print("🚀 Sending Mesoamerican Mayan Temple generator to Blender...")
    res = execute_code(BLENDER_SCRIPT)
    if res.get('status') == 'success':
        print("✅ Blender Python Output:\n", res.get('result', {}).get('result', ''))
    else:
        print("❌ Blender Execution Error:\n", res.get('message', ''))
        sys.exit(1)

    # Export to assets/models/mayan_temple.glb
    output_path = os.path.abspath("assets/models/mayan_temple.glb")
    print(f"📦 Exporting temple to GLB: {output_path}...")
    exp_res = export_glb(output_path)
    if exp_res.get('status') == 'success':
        print(f"🎉 Mayan Temple successfully exported! ({os.path.getsize(output_path)} bytes)")
    else:
        print("❌ Export Error:\n", exp_res.get('message', ''))
        sys.exit(1)

if __name__ == '__main__':
    main()
