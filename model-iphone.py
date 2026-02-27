"""
Blender Python script to model an iPhone 15 Pro and export as GLB.
Run: blender --background --python model-iphone.py
"""
import bpy
import bmesh
import math
import os

# Clear scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()
for mesh in bpy.data.meshes:
    bpy.data.meshes.remove(mesh)
for mat in bpy.data.materials:
    bpy.data.materials.remove(mat)

# Dimensions in meters
W = 0.0706    # width
H = 0.1466    # height  
D = 0.00825   # depth/thickness
CORNER_R = 0.008  # corner radius
BEVEL_R = 0.001

# ---- Materials ----
def make_titanium():
    mat = bpy.data.materials.new("Titanium")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs['Base Color'].default_value = (0.22, 0.21, 0.20, 1)
    bsdf.inputs['Metallic'].default_value = 1.0
    bsdf.inputs['Roughness'].default_value = 0.25
    return mat

def make_glass_back():
    mat = bpy.data.materials.new("GlassBack")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs['Base Color'].default_value = (0.18, 0.18, 0.19, 1)
    bsdf.inputs['Metallic'].default_value = 0.0
    bsdf.inputs['Roughness'].default_value = 0.1
    bsdf.inputs['Coat Weight'].default_value = 1.0
    bsdf.inputs['Coat Roughness'].default_value = 0.05
    return mat

def make_screen():
    mat = bpy.data.materials.new("Screen")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs['Base Color'].default_value = (0.05, 0.1, 0.2, 1)
    bsdf.inputs['Emission Color'].default_value = (0.05, 0.1, 0.2, 1)
    bsdf.inputs['Emission Strength'].default_value = 2.0
    bsdf.inputs['Roughness'].default_value = 0.02
    return mat

def make_camera_lens():
    mat = bpy.data.materials.new("CameraLens")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs['Base Color'].default_value = (0.01, 0.01, 0.02, 1)
    bsdf.inputs['Metallic'].default_value = 0.0
    bsdf.inputs['Roughness'].default_value = 0.0
    bsdf.inputs['IOR'].default_value = 1.8
    return mat

def make_dark():
    mat = bpy.data.materials.new("Dark")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs['Base Color'].default_value = (0.01, 0.01, 0.01, 1)
    bsdf.inputs['Roughness'].default_value = 0.5
    return mat

mat_titanium = make_titanium()
mat_glass = make_glass_back()
mat_screen = make_screen()
mat_lens = make_camera_lens()
mat_dark = make_dark()

# ---- BODY ----
# Rounded rectangle body
bpy.ops.mesh.primitive_cube_add(size=1)
obj_body = bpy.context.active_object
obj_body.name = "Body"
obj_body.scale = (W, H, D)
bpy.ops.object.transform_apply(scale=True)
obj_body.data.materials.append(mat_titanium)

# Bevel for rounded corners
mod = obj_body.modifiers.new("Bevel", 'BEVEL')
mod.width = CORNER_R
mod.segments = 8
mod.limit_method = 'ANGLE'
mod.angle_limit = math.radians(60)
bpy.context.view_layer.objects.active = obj_body
bpy.ops.object.modifier_apply(modifier=mod.name)

# Additional subtle bevel on all edges
mod = obj_body.modifiers.new("Bevel2", 'BEVEL')
mod.width = BEVEL_R * 0.5
mod.segments = 3
mod.limit_method = 'ANGLE'
mod.angle_limit = math.radians(30)
bpy.ops.object.modifier_apply(modifier=mod.name)

# ---- SCREEN ----
SCREEN_BEZEL = 0.003
bpy.ops.mesh.primitive_plane_add(size=1)
obj_screen = bpy.context.active_object
obj_screen.name = "Screen"
obj_screen.scale = (W - 2*SCREEN_BEZEL, H - 2*SCREEN_BEZEL, 1)
obj_screen.location = (0, 0, D/2 + 0.0001)
bpy.ops.object.transform_apply(scale=True)
obj_screen.data.materials.append(mat_screen)

# ---- DYNAMIC ISLAND ----
DI_W = 0.025
DI_H = 0.008
bpy.ops.mesh.primitive_cube_add(size=1)
obj_di = bpy.context.active_object
obj_di.name = "DynamicIsland"
obj_di.scale = (DI_W, DI_H, 0.0005)
obj_di.location = (0, H/2 - 0.018, D/2 + 0.0002)
bpy.ops.object.transform_apply(scale=True)
obj_di.data.materials.append(mat_dark)

# Round the dynamic island
mod = obj_di.modifiers.new("Bevel", 'BEVEL')
mod.width = DI_H/2.5
mod.segments = 6
bpy.context.view_layer.objects.active = obj_di
bpy.ops.object.modifier_apply(modifier=mod.name)

# ---- CAMERA BUMP ----
CAM_SIZE = 0.028
CAM_H = 0.002
bpy.ops.mesh.primitive_cube_add(size=1)
obj_cam_bump = bpy.context.active_object
obj_cam_bump.name = "CameraBump"
obj_cam_bump.scale = (CAM_SIZE, CAM_SIZE, CAM_H)
obj_cam_bump.location = (-W/2 + 0.018, H/2 - 0.018, -D/2 - CAM_H/2)
bpy.ops.object.transform_apply(scale=True)
obj_cam_bump.data.materials.append(mat_glass)

# Round camera bump corners
mod = obj_cam_bump.modifiers.new("Bevel", 'BEVEL')
mod.width = 0.005
mod.segments = 6
mod.limit_method = 'ANGLE'
bpy.context.view_layer.objects.active = obj_cam_bump
bpy.ops.object.modifier_apply(modifier=mod.name)

# ---- CAMERA LENSES (3 circles) ----
lens_positions = [
    (-W/2 + 0.013, H/2 - 0.013),  # top-left
    (-W/2 + 0.023, H/2 - 0.013),  # top-right
    (-W/2 + 0.013, H/2 - 0.023),  # bottom-left
]

for i, (lx, ly) in enumerate(lens_positions):
    bpy.ops.mesh.primitive_cylinder_add(radius=0.004, depth=0.001, vertices=24)
    obj_lens = bpy.context.active_object
    obj_lens.name = f"Lens{i}"
    obj_lens.location = (lx, ly, -D/2 - CAM_H - 0.0003)
    obj_lens.data.materials.append(mat_lens)
    
    # Ring around lens
    bpy.ops.mesh.primitive_torus_add(
        major_radius=0.0045, minor_radius=0.0008,
        major_segments=32, minor_segments=8
    )
    obj_ring = bpy.context.active_object
    obj_ring.name = f"LensRing{i}"
    obj_ring.location = (lx, ly, -D/2 - CAM_H - 0.0001)
    obj_ring.data.materials.append(mat_titanium)

# ---- SIDE BUTTON (power) ----
bpy.ops.mesh.primitive_cube_add(size=1)
obj_btn = bpy.context.active_object
obj_btn.name = "PowerButton"
obj_btn.scale = (0.001, 0.015, 0.003)
obj_btn.location = (W/2 + 0.0004, H/2 - 0.045, 0)
bpy.ops.object.transform_apply(scale=True)
obj_btn.data.materials.append(mat_titanium)

mod = obj_btn.modifiers.new("Bevel", 'BEVEL')
mod.width = 0.0005
mod.segments = 3
bpy.context.view_layer.objects.active = obj_btn
bpy.ops.object.modifier_apply(modifier=mod.name)

# ---- EXPORT ----
out_path = "/Users/kikai/clawd/projects/micro-businesses/assets/models/iphone.glb"

bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(
    filepath=out_path,
    export_format='GLB',
)

print(f"Exported iPhone model to {out_path}")
print(f"File size: {os.path.getsize(out_path) / 1024:.1f} KB")
