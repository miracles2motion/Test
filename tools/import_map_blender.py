#!/usr/bin/env python3
"""
Imports a Doodle Strike map OBJ + Metadata into the live Blender session via socket.
"""

import sys
import os
import json

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

from blender_bridge import execute_code, get_scene_info

def build_blender_import_script(map_key, obj_path, meta_path):
    # Forward slashes for Blender Python
    clean_obj = os.path.abspath(obj_path).replace('\\', '/')
    clean_meta = os.path.abspath(meta_path).replace('\\', '/')

    script = f"""
import bpy
import json
import os
import math
from mathutils import Vector, Euler

# 1. Clear existing objects
bpy.ops.object.select_all(action='DESELECT')
for obj in list(bpy.data.objects):
    bpy.data.objects.remove(obj, do_unlink=True)

# 2. Create map collection
coll_name = "{map_key.upper()}_MAP"
map_coll = bpy.data.collections.get(coll_name)
if not map_coll:
    map_coll = bpy.data.collections.new(coll_name)
    bpy.context.scene.collection.children.link(map_coll)

bpy.context.view_layer.active_layer_collection = bpy.context.view_layer.layer_collection.children[coll_name]

# 3. Import OBJ geometry
obj_file = r'{clean_obj}'
if hasattr(bpy.ops.wm, 'obj_import'):
    bpy.ops.wm.obj_import(filepath=obj_file)
else:
    bpy.ops.import_scene.obj(filepath=obj_file)

imported_objs = list(bpy.context.selected_objects)
print(f"Imported {{len(imported_objs)}} objects for {map_key}.")

# Setup Materials with Doodle Strike Biro Colors
def get_or_create_mat(name, hex_color, roughness=0.8):
    mat = bpy.data.materials.get(name)
    if not mat:
        mat = bpy.data.materials.new(name=name)
        mat.use_nodes = True
        nodes = mat.node_tree.nodes
        bsdf = nodes.get("Principled BSDF")
        if bsdf:
            # Convert hex to RGBA
            h = hex_color.lstrip('#')
            rgb = tuple(int(h[i:i+2], 16)/255.0 for i in (0, 2, 4))
            bsdf.inputs["Base Color"].default_value = (rgb[0], rgb[1], rgb[2], 1.0)
            if "Roughness" in bsdf.inputs:
                bsdf.inputs["Roughness"].default_value = roughness
    return mat

mat_paper = get_or_create_mat("Ink_Paper", "#f6f3e7", 0.95)
mat_blue  = get_or_create_mat("Ink_Blue",  "#1a30c0", 0.7)
mat_orange = get_or_create_mat("Ink_Orange", "#e05010", 0.6)
mat_green = get_or_create_mat("Ink_Green", "#1b7a3e", 0.7)
mat_black = get_or_create_mat("Ink_Black", "#151518", 0.8)
mat_red   = get_or_create_mat("Ink_Red",   "#d01818", 0.5)

# Assign ink materials & smooth shading
for i, obj in enumerate(imported_objs):
    obj.name = f"{map_key.upper()}_Mesh_{{i+1}}"
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.shade_smooth()
    if not obj.data.materials:
        # Alternate materials based on index or naming
        if i % 3 == 0:
            obj.data.materials.append(mat_blue)
        elif i % 3 == 1:
            obj.data.materials.append(mat_black)
        else:
            obj.data.materials.append(mat_orange)

# 4. Import Metadata & Spawn Tactical Markers
meta_file = r'{clean_meta}'
with open(meta_file, 'r', encoding='utf-8') as f:
    meta = json.load(f)

# Marker Collection
marker_coll = bpy.data.collections.new("00_TACTICAL_MARKERS")
map_coll.children.link(marker_coll)

# Spawn Grapple Rings (Golden Toruses)
mat_gold = get_or_create_mat("Marker_Grapple", "#ffd700", 0.3)
for idx, ring in enumerate(meta.get('rings', [])):
    bpy.ops.mesh.primitive_torus_add(
        major_radius=0.7, minor_radius=0.12,
        location=(ring['x'], -ring['z'], ring['y'])
    )
    r_obj = bpy.context.active_object
    r_obj.name = "Ring_" + str(idx + 1)
    r_obj.data.materials.append(mat_gold)
    if r_obj.name not in marker_coll.objects:
        marker_coll.objects.link(r_obj)
    if r_obj.name in bpy.context.scene.collection.objects:
        bpy.context.scene.collection.objects.unlink(r_obj)

# Spawn Player Start & Team Spawns (Green Pins)
mat_spawn = get_or_create_mat("Marker_Spawn", "#00ff66", 0.4)
ps = meta.get('playerStart', dict(x=0, y=0.5, z=42))
bpy.ops.mesh.primitive_cylinder_add(
    radius=0.4, depth=1.8,
    location=(ps['x'], -ps['z'], ps['y'] + 0.9)
)
p_obj = bpy.context.active_object
p_obj.name = "Player_Start"
p_obj.data.materials.append(mat_spawn)
if p_obj.name not in marker_coll.objects:
    marker_coll.objects.link(p_obj)
if p_obj.name in bpy.context.scene.collection.objects:
    bpy.context.scene.collection.objects.unlink(p_obj)

# 5. Add Sunlight & Camera
bpy.ops.object.light_add(type='SUN', location=(30, -30, 45))
sun = bpy.context.active_object
sun.data.energy = 3.5
sun.rotation_euler = Euler((math.radians(45), math.radians(15), math.radians(45)), 'XYZ')

bpy.ops.object.camera_add(location=(0, -85, 45))
cam = bpy.context.active_object
cam.rotation_euler = Euler((math.radians(60), 0, 0), 'XYZ')
bpy.context.scene.camera = cam

# Select all objects so the user can easily see and manipulate the level
bpy.ops.object.select_all(action='SELECT')

print(f"Map [{{meta.get('name')}}] successfully reconstructed in Blender!")
"""
    return script

def main():
    map_key = sys.argv[1] if len(sys.argv) > 1 else 'classroom'
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    obj_path = os.path.join(root_dir, 'assets', 'models', f'{map_key}.obj')
    meta_path = os.path.join(root_dir, 'assets', 'models', f'{map_key}_meta.json')

    if not os.path.exists(obj_path) or not os.path.exists(meta_path):
        print(f"❌ Map files for [{map_key}] not found. Run load_map_to_blender.js first.")
        sys.exit(1)

    print(f"📡 Sending [{map_key.upper()}] reconstruction script to Blender socket...")
    script = build_blender_import_script(map_key, obj_path, meta_path)
    res = execute_code(script)

    if res.get('status') == 'success':
        print("✅ Blender Output:\n", res.get('result', {}).get('result', ''))
    else:
        print("❌ Blender Execution Error:\n", res.get('message', ''))
        sys.exit(1)

if __name__ == '__main__':
    main()
