"""
MacBook Pro 14 v2 — Blender Python model
Accurate geometry using bmesh, proper UV, HDRI lighting, GLB export
"""
import bpy, bmesh, math, os, sys

BASE = "/Users/kikai/clawd/projects/micro-businesses"
SCREENSHOT = f"{BASE}/assets/screenshots/02-draft-hero.png"
HDR_PATH = f"{BASE}/assets/hdri/studio.hdr"
OUTPUT_IMG = "/tmp/macbook-v2.jpg"
OUTPUT_GLB = f"{BASE}/assets/models/macbook-v2.glb"

def clear():
    bpy.ops.wm.read_factory_settings(use_empty=True)

def make_mat_aluminum(name="Aluminum", color=(0.35, 0.35, 0.36)):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs['Base Color'].default_value = (*color, 1)
    bsdf.inputs['Metallic'].default_value = 1.0
    bsdf.inputs['Roughness'].default_value = 0.14
    bsdf.inputs['Anisotropic'].default_value = 0.25
    bsdf.inputs['Anisotropic Rotation'].default_value = 0.0
    bsdf.inputs['IOR'].default_value = 1.5
    return mat

def make_mat_screen(img_path):
    mat = bpy.data.materials.new("Screen")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()

    out = nodes.new('ShaderNodeOutputMaterial')
    mix = nodes.new('ShaderNodeMixShader')
    mix.inputs['Fac'].default_value = 0.92

    # Emission (screen content)
    emit = nodes.new('ShaderNodeEmission')
    emit.inputs['Strength'].default_value = 3.5

    # Glossy (screen glare)
    gloss = nodes.new('ShaderNodeBsdfGlossy')
    gloss.inputs['Roughness'].default_value = 0.04
    gloss.inputs['Color'].default_value = (0.9, 0.9, 1.0, 1)

    # Texture
    tex = nodes.new('ShaderNodeTexImage')
    if os.path.exists(img_path):
        img = bpy.data.images.load(img_path)
        img.colorspace_settings.name = 'sRGB'
        tex.image = img
    else:
        tex_color = nodes.new('ShaderNodeRGB')
        tex_color.outputs[0].default_value = (0.05, 0.05, 0.15, 1)

    coord = nodes.new('ShaderNodeTexCoord')

    links.new(tex.inputs['Vector'], coord.outputs['UV'])
    links.new(emit.inputs['Color'], tex.outputs['Color'])
    links.new(mix.inputs[1], emit.outputs['Emission'])
    links.new(mix.inputs[2], gloss.outputs['BSDF'])
    links.new(out.inputs['Surface'], mix.outputs['Shader'])
    return mat

def make_mat_bezel():
    mat = bpy.data.materials.new("Bezel")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs['Base Color'].default_value = (0.02, 0.02, 0.02, 1)
    bsdf.inputs['Metallic'].default_value = 0.0
    bsdf.inputs['Roughness'].default_value = 0.6
    return mat

def make_mat_rubber():
    mat = bpy.data.materials.new("Rubber")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs['Base Color'].default_value = (0.01, 0.01, 0.01, 1)
    bsdf.inputs['Roughness'].default_value = 0.95
    bsdf.inputs['Metallic'].default_value = 0.0
    return mat

def bmesh_box(w, d, h_front, h_back, bevel=0.002, segments=3):
    """Create a tapered box (thicker at back) with beveled edges"""
    bm = bmesh.new()
    hw, hd = w/2, d/2

    verts = [
        bm.verts.new((-hw, -hd, 0)),
        bm.verts.new(( hw, -hd, 0)),
        bm.verts.new(( hw,  hd, 0)),
        bm.verts.new((-hw,  hd, 0)),
        bm.verts.new((-hw, -hd, h_front)),
        bm.verts.new(( hw, -hd, h_front)),
        bm.verts.new(( hw,  hd, h_back)),
        bm.verts.new((-hw,  hd, h_back)),
    ]
    bm.verts.ensure_lookup_table()

    faces_idx = [
        [0,3,2,1], [4,5,6,7],
        [0,1,5,4], [3,7,6,2],
        [0,4,7,3], [1,2,6,5],
    ]
    for fi in faces_idx:
        bm.faces.new([verts[i] for i in fi])

    bm.edges.ensure_lookup_table()
    bmesh.ops.bevel(bm, geom=list(bm.edges), offset=bevel,
                    segments=segments, affect='EDGES', profile=0.6)
    return bm

def add_obj(bm, name):
    mesh = bpy.data.meshes.new(name)
    bm.to_mesh(mesh)
    bm.free()
    
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    bpy.context.view_layer.objects.active = obj
    return obj

# ── Dimensions (meters) ───────────────────────────────────────────
W   = 0.3126   # width
D   = 0.2212   # depth
H_B = 0.0155   # base height (back, at hinge)
H_F = 0.0048   # base height (front, tapered)
LID_T = 0.005  # lid thickness
HINGE_Z = H_B  # hinge at back top
LID_ANGLE = math.radians(110)  # lid open angle

clear()
al_mat    = make_mat_aluminum()
bezel_mat = make_mat_bezel()
screen_mat = make_mat_screen(SCREENSHOT)
rubber_mat = make_mat_rubber()

# ── BASE ─────────────────────────────────────────────────────────
bm_base = bmesh_box(W, D, H_F, H_B, bevel=0.003, segments=3)
base = add_obj(bm_base, "Base")
base.data.materials.append(al_mat)

# Keyboard depression (boolean-like indent via scaled plane)
bpy.ops.mesh.primitive_plane_add(size=1, location=(0, -0.01, H_B*0.85))
kbd = bpy.context.active_object
kbd.scale = (W*0.75, D*0.55, 1)
bpy.ops.object.transform_apply(scale=True)
kbd_mat = make_mat_aluminum("KB_Surface", (0.28, 0.28, 0.29))
kbd.data.materials.append(kbd_mat)

# Trackpad
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -D*0.28, H_B*0.82))
tp = bpy.context.active_object
tp.scale = (W*0.26, D*0.22, 0.001)
bpy.ops.object.transform_apply(scale=True)
tp_mat = make_mat_aluminum("Trackpad", (0.30, 0.30, 0.31))
tp.data.materials.append(tp_mat)

# Rubber feet (4 corners)
for fx, fy in [(-0.12, -0.09), (0.12, -0.09), (-0.12, 0.09), (0.12, 0.09)]:
    bpy.ops.mesh.primitive_cylinder_add(radius=0.005, depth=0.002,
        location=(fx, fy, -0.001))
    foot = bpy.context.active_object
    foot.data.materials.append(rubber_mat)

# ── HINGE CYLINDERS ──────────────────────────────────────────────
for hx in [-0.05, 0.05]:
    bpy.ops.mesh.primitive_cylinder_add(radius=0.004, depth=0.018,
        location=(hx, D/2 - 0.005, H_B))
    hinge = bpy.context.active_object
    hinge.rotation_euler = (0, math.radians(90), 0)
    hinge.data.materials.append(al_mat)

# ── LID ──────────────────────────────────────────────────────────
# Lid pivots around back edge at height H_B
# In open position: rotated ~110deg from closed (laying flat)
bm_lid = bmesh_box(W, D, LID_T, LID_T, bevel=0.002, segments=3)
lid = add_obj(bm_lid, "Lid")
lid.data.materials.append(al_mat)

# Position lid: hinge at back, open to ~110 degrees
# Lid back edge = base back edge = (0, D/2, H_B)
lid_d = D  # lid depth same as base depth

# Rotation math: lid rotates about Y axis at (y=D/2, z=H_B)
# At 110 deg open: lid tilts back
pivot_y = D/2
pivot_z = H_B

# Lid extends "upward" when open
# Offset from pivot to lid center
lid_cx = 0
lid_cy = pivot_y - (lid_d/2) * math.cos(LID_ANGLE - math.pi/2)
lid_cz = pivot_z + (lid_d/2) * math.sin(LID_ANGLE - math.pi/2)

lid.location = (lid_cx, lid_cy, lid_cz)
lid.rotation_euler = (-(math.pi - LID_ANGLE), 0, 0)

# ── BEZEL (inside lid, border around screen) ─────────────────────
bpy.ops.mesh.primitive_plane_add(size=1)
bezel = bpy.context.active_object
bezel.name = "Bezel"
bezel.scale = (W - 0.008, D - 0.012, 1)
bpy.ops.object.transform_apply(scale=True)
bezel.data.materials.append(bezel_mat)
# Place at lid face position
bezel.location = (lid_cx, lid_cy + (D/2 - 0.001) * math.cos(LID_ANGLE - math.pi/2) * 0.01,
                  lid_cz + LID_T/2 + 0.0001)
bezel.rotation_euler = (-(math.pi - LID_ANGLE), 0, 0)

# ── SCREEN (emission plane) ───────────────────────────────────────
bpy.ops.mesh.primitive_plane_add(size=1)
screen = bpy.context.active_object
screen.name = "Screen"
# Screen is 16:10, inset from bezel by ~6mm each side
sw = W - 0.024
sh = (W - 0.024) * (10/16)
screen.scale = (sw, sh, 1)
bpy.ops.object.transform_apply(scale=True)

# UV unwrap (important for texture)
bpy.ops.object.mode_set(mode='EDIT')
bpy.ops.mesh.select_all(action='SELECT')
bpy.ops.uv.reset()
bpy.ops.object.mode_set(mode='OBJECT')

screen.data.materials.append(screen_mat)
# Place screen at same position as bezel but slightly in front
screen_offset = 0.0015
scr_y = lid_cy + screen_offset * math.cos(LID_ANGLE - math.pi/2) * (-1)
scr_z = lid_cz + LID_T/2 + screen_offset
screen.location = (lid_cx, scr_y - 0.008, scr_z + 0.003)
screen.rotation_euler = (-(math.pi - LID_ANGLE), 0, 0)

# ── NOTCH (camera housing at top of screen) ───────────────────────
bpy.ops.mesh.primitive_cube_add(size=1)
notch = bpy.context.active_object
notch.scale = (0.012, 0.003, 0.005)
bpy.ops.object.transform_apply(scale=True)
notch.data.materials.append(bezel_mat)
# Position at top center of screen
notch.location = (lid_cx, scr_y - 0.01, scr_z + sh/2 - 0.003)
notch.rotation_euler = screen.rotation_euler

# ── LIGHTING ─────────────────────────────────────────────────────
if os.path.exists(HDR_PATH):
    world = bpy.data.worlds.new("World")
    world.use_nodes = True
    bpy.context.scene.world = world
    nodes = world.node_tree.nodes
    links = world.node_tree.links
    nodes.clear()
    out = nodes.new('ShaderNodeOutputWorld')
    bg = nodes.new('ShaderNodeBackground')
    bg.inputs['Strength'].default_value = 0.5
    env = nodes.new('ShaderNodeTexEnvironment')
    env.image = bpy.data.images.load(HDR_PATH)
    links.new(bg.inputs['Color'], env.outputs['Color'])
    links.new(out.inputs['Surface'], bg.outputs['Background'])
else:
    world = bpy.data.worlds.new("World")
    world.use_nodes = True
    bpy.context.scene.world = world
    world.node_tree.nodes['Background'].inputs['Color'].default_value = (0.02,0.02,0.025,1)
    world.node_tree.nodes['Background'].inputs['Strength'].default_value = 0.0

# Key light (warm, top-left)
bpy.ops.object.light_add(type='AREA', location=(-0.8, -0.5, 0.8))
key = bpy.context.active_object
key.data.energy = 120
key.data.size = 0.6
key.data.color = (1.0, 0.97, 0.92)
key.rotation_euler = (math.radians(45), 0, math.radians(-35))

# Fill (cool, right)
bpy.ops.object.light_add(type='AREA', location=(0.7, -0.3, 0.4))
fill = bpy.context.active_object
fill.data.energy = 40
fill.data.size = 0.8
fill.data.color = (0.85, 0.9, 1.0)

# Rim (back, cold)
bpy.ops.object.light_add(type='SPOT', location=(0, 0.8, 0.5))
rim = bpy.context.active_object
rim.data.energy = 80
rim.data.spot_size = math.radians(45)
rim.data.color = (0.6, 0.7, 1.0)
rim.rotation_euler = (math.radians(-50), 0, 0)

# Ground plane with reflection
bpy.ops.mesh.primitive_plane_add(size=3, location=(0, 0, -0.001))
ground = bpy.context.active_object
gmat = bpy.data.materials.new("Ground")
gmat.use_nodes = True
bsdf = gmat.node_tree.nodes["Principled BSDF"]
bsdf.inputs['Base Color'].default_value = (0.025, 0.025, 0.03, 1)
bsdf.inputs['Roughness'].default_value = 0.2
bsdf.inputs['Metallic'].default_value = 0.8
ground.data.materials.append(gmat)

# ── CAMERA ───────────────────────────────────────────────────────
bpy.ops.object.camera_add(location=(0.32, -0.52, 0.40))
cam = bpy.context.active_object
cam.name = "Camera"
cam.rotation_euler = (math.radians(58), 0, math.radians(18))
cam.data.lens = 85
cam.data.clip_start = 0.01
cam.data.dof.use_dof = True
cam.data.dof.aperture_fstop = 4.0
cam.data.dof.focus_distance = 0.62
bpy.context.scene.camera = cam

# ── RENDER ───────────────────────────────────────────────────────
scene = bpy.context.scene
scene.render.engine = 'CYCLES'

# Try Metal GPU
try:
    prefs = bpy.context.preferences.addons['cycles'].preferences
    prefs.compute_device_type = 'METAL'
    prefs.refresh_devices()
    for dev in prefs.get_devices_for_type('METAL'):
        dev.use = True
        print(f"GPU: {dev.name}")
    scene.cycles.device = 'GPU'
    print("Metal GPU enabled")
except Exception as e:
    print(f"CPU render: {e}")

scene.cycles.samples = 128
scene.cycles.use_denoising = True
try:
    scene.cycles.denoiser = 'OPENIMAGEDENOISE'
except:
    pass
scene.render.resolution_x = 2400
scene.render.resolution_y = 1350
scene.render.filepath = OUTPUT_IMG
scene.render.image_settings.file_format = 'JPEG'
scene.render.image_settings.quality = 95

print("Starting render...")
bpy.ops.render.render(write_still=True)
print(f"RENDER_DONE: {OUTPUT_IMG}")

# ── GLB EXPORT ───────────────────────────────────────────────────
os.makedirs(f"{BASE}/assets/models", exist_ok=True)
bpy.ops.export_scene.gltf(
    filepath=OUTPUT_GLB,
    export_format='GLB',
    export_materials='EXPORT',
    export_textures=True,
    export_cameras=False,
    export_lights=False
)
print(f"GLB_EXPORTED: {OUTPUT_GLB}")
