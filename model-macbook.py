"""
Blender Python script to model a MacBook Pro 14" and export as GLB.
Run: blender --background --python model-macbook.py
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

# Dimensions in meters (Blender units)
W = 0.3126   # width
D = 0.2212   # depth
H_BASE = 0.0105  # base thickness
H_LID = 0.005    # lid thickness
H_TOTAL = 0.0155
BEVEL_R = 0.002   # bevel radius
TAPER_FRONT = 0.003  # front edge thinner

# Screen dimensions
BEZEL = 0.006
SCREEN_W = W - 2 * BEZEL
SCREEN_H = D - 2 * BEZEL
NOTCH_W = 0.011
NOTCH_H = 0.005

# ---- Materials ----
def make_aluminum(name="Aluminum", color=(0.13, 0.13, 0.14)):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs['Base Color'].default_value = (*color, 1)
    bsdf.inputs['Metallic'].default_value = 1.0
    bsdf.inputs['Roughness'].default_value = 0.15
    return mat

def make_dark(name="DarkGray", color=(0.02, 0.02, 0.02)):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs['Base Color'].default_value = (*color, 1)
    bsdf.inputs['Metallic'].default_value = 0.0
    bsdf.inputs['Roughness'].default_value = 0.8
    return mat

def make_screen_mat(screenshot_path=None):
    mat = bpy.data.materials.new("Screen")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    bsdf = nodes["Principled BSDF"]
    
    # Make it emissive so it glows
    bsdf.inputs['Emission Strength'].default_value = 3.0
    bsdf.inputs['Roughness'].default_value = 0.05
    bsdf.inputs['Metallic'].default_value = 0.0
    
    if screenshot_path and os.path.exists(screenshot_path):
        tex = nodes.new('ShaderNodeTexImage')
        tex.image = bpy.data.images.load(screenshot_path)
        links.new(tex.outputs['Color'], bsdf.inputs['Base Color'])
        links.new(tex.outputs['Color'], bsdf.inputs['Emission Color'])
    else:
        # Default blue-ish screen color
        bsdf.inputs['Base Color'].default_value = (0.1, 0.15, 0.3, 1)
        bsdf.inputs['Emission Color'].default_value = (0.1, 0.15, 0.3, 1)
    
    return mat

def make_trackpad_mat():
    mat = bpy.data.materials.new("Trackpad")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs['Base Color'].default_value = (0.11, 0.11, 0.12, 1)
    bsdf.inputs['Metallic'].default_value = 0.8
    bsdf.inputs['Roughness'].default_value = 0.1
    return mat

# Create materials
mat_aluminum = make_aluminum()
mat_dark = make_dark()
mat_keyboard = make_dark("Keyboard", (0.015, 0.015, 0.015))
mat_trackpad = make_trackpad_mat()

# Find a screenshot to use
screenshot_dir = "/Users/kikai/clawd/projects/micro-businesses/assets/screenshots"
screenshot = None
for f in sorted(os.listdir(screenshot_dir)):
    if f.endswith('.png'):
        screenshot = os.path.join(screenshot_dir, f)
        break
mat_screen = make_screen_mat(screenshot)

# ---- BASE BODY ----
# Create tapered base using bmesh
bm = bmesh.new()

# Front edge is thinner, back is full height
# 8 vertices for a tapered box
h_front = TAPER_FRONT
h_back = H_BASE

verts = [
    # Bottom face
    bm.verts.new((-W/2, -D/2, 0)),        # 0 front-left bottom
    bm.verts.new((W/2, -D/2, 0)),         # 1 front-right bottom
    bm.verts.new((W/2, D/2, 0)),          # 2 back-right bottom
    bm.verts.new((-W/2, D/2, 0)),         # 3 back-left bottom
    # Top face (tapered)
    bm.verts.new((-W/2, -D/2, h_front)),  # 4 front-left top
    bm.verts.new((W/2, -D/2, h_front)),   # 5 front-right top
    bm.verts.new((W/2, D/2, h_back)),     # 6 back-right top
    bm.verts.new((-W/2, D/2, h_back)),    # 7 back-left top
]

# Create faces
bm.faces.new([verts[0], verts[1], verts[2], verts[3]])  # bottom
bm.faces.new([verts[4], verts[7], verts[6], verts[5]])  # top
bm.faces.new([verts[0], verts[4], verts[5], verts[1]])  # front
bm.faces.new([verts[2], verts[6], verts[7], verts[3]])  # back
bm.faces.new([verts[0], verts[3], verts[7], verts[4]])  # left
bm.faces.new([verts[1], verts[5], verts[6], verts[2]])  # right

mesh_base = bpy.data.meshes.new("Base")
bm.to_mesh(mesh_base)
bm.free()

obj_base = bpy.data.objects.new("Base", mesh_base)
bpy.context.collection.objects.link(obj_base)
obj_base.data.materials.append(mat_aluminum)

# Bevel modifier for rounded edges
bpy.context.view_layer.objects.active = obj_base
mod = obj_base.modifiers.new("Bevel", 'BEVEL')
mod.width = BEVEL_R
mod.segments = 4
mod.limit_method = 'ANGLE'

# Subdivision for smoothness
mod2 = obj_base.modifiers.new("Subsurf", 'SUBSURF')
mod2.levels = 1
mod2.render_levels = 2

# Apply modifiers
bpy.ops.object.select_all(action='DESELECT')
obj_base.select_set(True)
bpy.context.view_layer.objects.active = obj_base
for mod in obj_base.modifiers:
    bpy.ops.object.modifier_apply(modifier=mod.name)

# ---- KEYBOARD DEPRESSION ----
KB_W = W * 0.75
KB_D = D * 0.35
KB_DEPTH = 0.001
kb_y_offset = D * 0.08  # slightly toward back

bpy.ops.mesh.primitive_cube_add(size=1)
obj_kb = bpy.context.active_object
obj_kb.name = "Keyboard"
obj_kb.scale = (KB_W, KB_D, KB_DEPTH)
obj_kb.location = (0, kb_y_offset, H_BASE - KB_DEPTH/2)
bpy.ops.object.transform_apply(scale=True)
obj_kb.data.materials.append(mat_keyboard)

# Bevel the keyboard edges
mod = obj_kb.modifiers.new("Bevel", 'BEVEL')
mod.width = 0.001
mod.segments = 3
bpy.ops.object.modifier_apply(modifier=mod.name)

# ---- TRACKPAD ----
TP_W = W * 0.35
TP_D = D * 0.22
TP_H = 0.0003

bpy.ops.mesh.primitive_cube_add(size=1)
obj_tp = bpy.context.active_object
obj_tp.name = "Trackpad"
obj_tp.scale = (TP_W, TP_D, TP_H)
obj_tp.location = (0, -D * 0.18, H_BASE + TP_H/2 - 0.0001)
bpy.ops.object.transform_apply(scale=True)
obj_tp.data.materials.append(mat_trackpad)

mod = obj_tp.modifiers.new("Bevel", 'BEVEL')
mod.width = 0.0008
mod.segments = 3
bpy.ops.object.modifier_apply(modifier=mod.name)

# ---- LID ----
# Lid is opened at ~110 degrees from base
LID_ANGLE = math.radians(110)

bm = bmesh.new()
# Lid as a flat slab
verts = [
    bm.verts.new((-W/2, 0, 0)),
    bm.verts.new((W/2, 0, 0)),
    bm.verts.new((W/2, D, 0)),
    bm.verts.new((-W/2, D, 0)),
    bm.verts.new((-W/2, 0, H_LID)),
    bm.verts.new((W/2, 0, H_LID)),
    bm.verts.new((W/2, D, H_LID)),
    bm.verts.new((-W/2, D, H_LID)),
]

bm.faces.new([verts[0], verts[1], verts[2], verts[3]])
bm.faces.new([verts[4], verts[7], verts[6], verts[5]])
bm.faces.new([verts[0], verts[4], verts[5], verts[1]])
bm.faces.new([verts[2], verts[6], verts[7], verts[3]])
bm.faces.new([verts[0], verts[3], verts[7], verts[4]])
bm.faces.new([verts[1], verts[5], verts[6], verts[2]])

mesh_lid = bpy.data.meshes.new("Lid")
bm.to_mesh(mesh_lid)
bm.free()

obj_lid = bpy.data.objects.new("Lid", mesh_lid)
bpy.context.collection.objects.link(obj_lid)
obj_lid.data.materials.append(mat_aluminum)

# Bevel
bpy.context.view_layer.objects.active = obj_lid
obj_lid.select_set(True)
mod = obj_lid.modifiers.new("Bevel", 'BEVEL')
mod.width = BEVEL_R * 0.8
mod.segments = 4
mod.limit_method = 'ANGLE'
bpy.ops.object.modifier_apply(modifier=mod.name)

# Position lid: hinge at back of base, rotate open
obj_lid.location = (0, D/2, H_BASE)
obj_lid.rotation_euler = (-(math.pi - LID_ANGLE), 0, 0)

# ---- SCREEN SURFACE (on the inside of the lid) ----
bpy.ops.mesh.primitive_plane_add(size=1)
obj_screen = bpy.context.active_object
obj_screen.name = "Screen"
obj_screen.scale = (SCREEN_W, SCREEN_H, 1)
bpy.ops.object.transform_apply(scale=True)

# Parent to lid so it follows rotation
obj_screen.parent = obj_lid
# Position on the inside face of the lid
# The inside face is the bottom (z=0) of the lid mesh
# In lid's local space: centered in XY, at z=-0.0001 (just below surface)
obj_screen.location = (0, D/2, -0.0001)

obj_screen.data.materials.append(mat_screen)

# UV unwrap the screen for texture
bpy.context.view_layer.objects.active = obj_screen
obj_screen.select_set(True)
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.uv.unwrap(method='ANGLE_BASED')
bpy.ops.object.mode_set(mode='OBJECT')

# ---- SCREEN BEZEL (dark border around screen) ----
bpy.ops.mesh.primitive_plane_add(size=1)
obj_bezel = bpy.context.active_object
obj_bezel.name = "Bezel"
obj_bezel.scale = (W * 0.98, D * 0.98, 1)
bpy.ops.object.transform_apply(scale=True)
obj_bezel.parent = obj_lid
obj_bezel.location = (0, D/2, -0.0002)
obj_bezel.data.materials.append(mat_dark)

# ---- NOTCH ----
# Small dark rectangle at top center of screen  
bpy.ops.mesh.primitive_cube_add(size=1)
obj_notch = bpy.context.active_object
obj_notch.name = "Notch"
obj_notch.scale = (NOTCH_W, NOTCH_H, 0.001)
bpy.ops.object.transform_apply(scale=True)
obj_notch.parent = obj_lid
obj_notch.location = (0, D - BEZEL - NOTCH_H/2, -0.00005)
obj_notch.data.materials.append(mat_dark)

# ---- EXPORT ----
out_path = "/Users/kikai/clawd/projects/micro-businesses/assets/models/macbook.glb"

# Select all objects
bpy.ops.object.select_all(action='SELECT')

bpy.ops.export_scene.gltf(
    filepath=out_path,
    export_format='GLB',
)

print(f"Exported MacBook model to {out_path}")
print(f"File size: {os.path.getsize(out_path) / 1024:.1f} KB")
