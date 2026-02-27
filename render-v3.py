import bpy, bmesh, math, os

import sys

# === CONFIG ===
PROJECT_DIR = "/Users/kikai/clawd/projects/micro-businesses"
# Accept command line args: screenshot_path output_path [camera_preset]
args = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
SCREENSHOT = args[0] if len(args) > 0 else os.path.join(PROJECT_DIR, "assets/screenshots/02-draft-hero.png")
OUTPUT_PATH = args[1] if len(args) > 1 else "/tmp/test-render.jpg"
CAMERA_PRESET = args[2] if len(args) > 2 else "hero"  # hero, front, left
HDRI_PATH = os.path.join(PROJECT_DIR, "assets/hdri/studio.hdr")
FAST_MODE = len(args) == 0  # fast for test, final for batch

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene

# Render settings
scene.render.engine = 'CYCLES'
try:
    prefs = bpy.context.preferences.addons['cycles'].preferences
    prefs.compute_device_type = 'METAL'
    prefs.get_devices()
    for d in prefs.devices:
        d.use = True
    scene.cycles.device = 'GPU'
except: pass

scene.cycles.samples = 128 if FAST_MODE else 256
scene.cycles.use_denoising = True
scene.render.resolution_x = 2400
scene.render.resolution_y = 1350
scene.render.filepath = OUTPUT_PATH
scene.render.image_settings.file_format = 'JPEG'
scene.render.image_settings.quality = 95

# === DIMENSIONS ===
W = 0.3126
D = 0.2212
H_BACK = 0.0155
H_FRONT = 0.0041
LID_H = 0.220
LID_T = 0.004
OPEN_ANGLE = 110  # degrees

# Hinge position
HINGE_Y = D / 2
HINGE_Z = H_BACK

# Lid angle from horizontal (measured from base surface going up and back)
# 110° open means screen tilts 20° past vertical
LID_WORLD_ANGLE = 90 - (OPEN_ANGLE - 90)  # = 70° from horizontal

# === MATERIALS ===
def make_mat(name, color, metallic=0, roughness=0.5, **kwargs):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    n = mat.node_tree.nodes; l = mat.node_tree.links; n.clear()
    out = n.new('ShaderNodeOutputMaterial')
    p = n.new('ShaderNodeBsdfPrincipled')
    p.inputs['Base Color'].default_value = (*color, 1)
    p.inputs['Metallic'].default_value = metallic
    p.inputs['Roughness'].default_value = roughness
    l.new(p.outputs[0], out.inputs[0])
    return mat

aluminum = make_mat("Aluminum", (0.65, 0.66, 0.68), metallic=0.95, roughness=0.32)
black_keys = make_mat("Keys", (0.008, 0.008, 0.008), roughness=0.35)
black_bezel = make_mat("Bezel", (0.003, 0.003, 0.003), roughness=0.08)
ground_mat = make_mat("Ground", (0.01, 0.01, 0.013), metallic=0.05, roughness=0.12)
trackpad_mat = make_mat("Trackpad", (0.08, 0.08, 0.08), metallic=0.2, roughness=0.15)

def mat_screen(img_path):
    mat = bpy.data.materials.new("Screen")
    mat.use_nodes = True
    n = mat.node_tree.nodes; l = mat.node_tree.links; n.clear()
    out = n.new('ShaderNodeOutputMaterial')
    
    # Pure emission - screen IS a light source
    emit = n.new('ShaderNodeEmission')
    emit.inputs['Strength'].default_value = 20.0
    
    tex = n.new('ShaderNodeTexImage')
    if os.path.exists(img_path):
        tex.image = bpy.data.images.load(img_path)
        print(f"Loaded screenshot: {img_path}")
    
    l.new(tex.outputs['Color'], emit.inputs['Color'])
    l.new(emit.outputs[0], out.inputs[0])
    return mat

# === GEOMETRY ===

# BASE (tapered)
def create_base():
    bm = bmesh.new()
    hw, hd = W/2, D/2
    v = [
        bm.verts.new((-hw, -hd, 0)), bm.verts.new((hw, -hd, 0)),
        bm.verts.new((hw, hd, 0)),   bm.verts.new((-hw, hd, 0)),
        bm.verts.new((-hw, -hd, H_FRONT)), bm.verts.new((hw, -hd, H_FRONT)),
        bm.verts.new((hw, hd, H_BACK)),    bm.verts.new((-hw, hd, H_BACK)),
    ]
    for f in [[0,1,2,3],[4,5,6,7],[0,1,5,4],[2,3,7,6],[0,3,7,4],[1,2,6,5]]:
        bm.faces.new([v[i] for i in f])
    bm.edges.ensure_lookup_table()
    bmesh.ops.bevel(bm, geom=list(bm.edges), offset=0.0012, segments=3, affect='EDGES')
    mesh = bpy.data.meshes.new("Base")
    bm.to_mesh(mesh); bm.free()
    obj = bpy.data.objects.new("Base", mesh)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(aluminum)
    return obj

# LID - position in world space directly
def create_lid():
    # Lid as flat slab, then position/rotate
    bm = bmesh.new()
    hw = W/2
    # Build in local space: bottom at origin, extends up in Y, thin in Z
    v = [
        bm.verts.new((-hw, 0, -LID_T/2)), bm.verts.new((hw, 0, -LID_T/2)),
        bm.verts.new((hw, LID_H, -LID_T/2)), bm.verts.new((-hw, LID_H, -LID_T/2)),
        bm.verts.new((-hw, 0, LID_T/2)),  bm.verts.new((hw, 0, LID_T/2)),
        bm.verts.new((hw, LID_H, LID_T/2)), bm.verts.new((-hw, LID_H, LID_T/2)),
    ]
    for f in [[0,1,2,3],[4,5,6,7],[0,1,5,4],[2,3,7,6],[0,3,7,4],[1,2,6,5]]:
        bm.faces.new([v[i] for i in f])
    bm.edges.ensure_lookup_table()
    bmesh.ops.bevel(bm, geom=list(bm.edges), offset=0.001, segments=2, affect='EDGES')
    mesh = bpy.data.meshes.new("Lid")
    bm.to_mesh(mesh); bm.free()
    obj = bpy.data.objects.new("Lid", mesh)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(aluminum)
    
    # Position: origin at hinge, rotate so it opens backward
    obj.location = (0, HINGE_Y, HINGE_Z)
    # In local space, lid extends in +Y. We rotate around X.
    # rotation_euler.x = 70° means lid goes 70° from horizontal toward vertical
    # (top of lid tilts back slightly at 20° past vertical)
    obj.rotation_euler.x = math.radians(LID_WORLD_ANGLE)
    return obj

# SCREEN - world space, positioned on inner face of lid
def create_screen_ws(img_path):
    # Calculate screen center in world space
    # Screen is at ~48% up the lid from hinge
    dist_up = LID_H * 0.48
    # In world space (lid rotated at LID_WORLD_ANGLE from horizontal):
    angle_rad = math.radians(LID_WORLD_ANGLE)
    screen_y = HINGE_Y + dist_up * math.cos(angle_rad)  # Y displacement
    screen_z = HINGE_Z + dist_up * math.sin(angle_rad)  # Z displacement
    
    # Offset slightly toward user (inner face of lid = -Z in lid local = toward user in world)
    # Normal to lid inner face points at angle (LID_WORLD_ANGLE - 90) from horizontal... 
    # Actually, let's just offset by LID_T/2 in the direction perpendicular to lid surface
    # Lid surface normal (inner, toward user): perpendicular to lid, pointing -Z in local
    # In world: rotated by LID_WORLD_ANGLE around X
    normal_y = -math.sin(angle_rad) * (-1)  # -Z local -> world
    normal_z = -math.cos(angle_rad) * (-1)
    # Actually simpler: inner face normal in world = (0, -sin(angle), cos(angle)) rotated...
    # Let me just use a small offset
    # Offset screen in front of lid (toward user)
    # Lid inner face normal in world: (0, -sin(angle), cos(angle))... 
    # Actually: perpendicular to lid surface, pointing toward user
    # The lid surface is at angle LID_WORLD_ANGLE from horizontal
    # Inner face normal = (0, -cos(angle), -sin(angle)) ... let me just compute it
    # Lid extends in +Y local, rotated around X by LID_WORLD_ANGLE
    # Inner face (Z- local side) normal in world:
    inner_normal_y = math.sin(angle_rad)  # points toward -Y in screen space = toward user
    inner_normal_z = -math.cos(angle_rad)
    # Wait, let me think again. Lid is a slab centered on Z=0 in local space (from -LID_T/2 to +LID_T/2).
    # The inner face is the -Z face in local space. Its normal is (0, 0, -1) local.
    # After rotation of angle_rad around X:
    # (0, 0, -1) -> (0, -(-1)*sin(angle_rad), (-1)*cos(angle_rad)) = (0, sin(angle), -cos(angle))
    # So inner normal = (0, sin(70°), -cos(70°)) = (0, 0.94, -0.34)
    # That points toward +Y and -Z ... which is AWAY from the user (user is at -Y)
    # So the OUTER face is toward the user! The +Z local face.
    # +Z local normal: (0, 0, 1) -> (0, -sin(angle), cos(angle)) = (0, -0.94, 0.34)
    # That points toward -Y and +Z, which IS toward the user!
    # So the screen should be on the +Z side of the lid, offset in the +Z local direction
    outer_normal_y = -math.sin(angle_rad)
    outer_normal_z = math.cos(angle_rad)
    offset = LID_T/2 + 0.001
    screen_y += outer_normal_y * offset
    screen_z += outer_normal_z * offset
    
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, screen_y, screen_z))
    scr = bpy.context.active_object
    scr.name = "Screen"
    
    # Scale to match actual screenshot aspect ratio (1020x544 = 1.875:1)
    screen_width = 0.305  # fill bezel edge to edge, slightly overflow for safety
    screen_height = screen_width / 1.875
    scr.scale = (screen_width, screen_height, 1)
    
    # Rotate to match lid angle - screen face should point toward user
    # Screen normal should match lid inner surface normal
    # Lid at 70° from horizontal, inner face points at (70-90) = -20° from horizontal
    # So screen rotation around X = 70° (same as lid, facing outward from inner surface)
    scr.rotation_euler.x = math.radians(LID_WORLD_ANGLE)
    
    scr.data.materials.append(mat_screen(img_path))
    print(f"Screen at Y={screen_y:.4f} Z={screen_z:.4f} rot_x={LID_WORLD_ANGLE}°")
    return scr

# BEZEL - same as screen but slightly larger and behind
def create_bezel_ws():
    dist_up = LID_H * 0.48
    angle_rad = math.radians(LID_WORLD_ANGLE)
    bz_y = HINGE_Y + dist_up * math.cos(angle_rad)
    bz_z = HINGE_Z + dist_up * math.sin(angle_rad)
    
    outer_normal_y = -math.sin(angle_rad)
    outer_normal_z = math.cos(angle_rad)
    offset = LID_T/2 + 0.0008
    bz_y += outer_normal_y * offset
    bz_z += outer_normal_z * offset
    
    bpy.ops.mesh.primitive_plane_add(size=1, location=(0, bz_y, bz_z))
    bz = bpy.context.active_object
    bz.name = "Bezel"
    # Match bezel to screen aspect + small border
    scr_w = 0.290
    scr_h = scr_w / 1.875
    bz.scale = (scr_w + 0.010, scr_h + 0.008, 1)  # NOT /2
    bz.rotation_euler.x = math.radians(LID_WORLD_ANGLE)
    bz.data.materials.append(black_bezel)
    return bz

# KEYBOARD - individual keys on base surface
def create_keyboard():
    rows = 6
    cols = 14
    key_w = 0.0165
    key_h = 0.0135
    gap = 0.0018
    total_w = cols * (key_w + gap) - gap
    total_h = rows * (key_h + gap) - gap
    start_x = -total_w / 2 + key_w / 2
    # Keys sit in upper portion of base (near hinge)
    start_y = HINGE_Y - 0.015  # start from back
    base_z = H_BACK - 0.002  # approximate top surface height near hinge area
    
    for r in range(rows):
        y = start_y - r * (key_h + gap)
        t = (y + D/2) / D
        z = H_FRONT + t * (H_BACK - H_FRONT) + 0.0001
        for c in range(cols):
            x = start_x + c * (key_w + gap)
            bpy.ops.mesh.primitive_cube_add(size=1, location=(x, y, z))
            key = bpy.context.active_object
            key.scale = (key_w/2, key_h/2, 0.0003)  # very flat keys
            key.data.materials.append(black_keys)
    
    # Spacebar (wider key at bottom)
    y = start_y - (rows) * (key_h + gap)
    t = (y + D/2) / D
    z = H_FRONT + t * (H_BACK - H_FRONT) + 0.0001
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, y, z))
    spacebar = bpy.context.active_object
    spacebar.scale = (0.055, key_h/2, 0.0003)
    spacebar.data.materials.append(black_keys)

# TRACKPAD
def create_trackpad():
    # Center of lower portion of base
    y = -D/2 + 0.065
    t = (y + D/2) / D
    z = H_FRONT + t * (H_BACK - H_FRONT) + 0.0002
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, y, z))
    tp = bpy.context.active_object
    tp.name = "Trackpad"
    tp.scale = (0.055, 0.038, 0.0003)
    tp.data.materials.append(trackpad_mat)

# === BUILD SCENE ===
print("Building scene...")
create_base()
create_lid()
create_bezel_ws()
create_screen_ws(SCREENSHOT)
create_keyboard()
create_trackpad()

# Notch (small black bump at top of screen)
notch_dist = LID_H * 0.88
notch_angle = math.radians(LID_WORLD_ANGLE)
notch_y = HINGE_Y + notch_dist * math.cos(notch_angle)
notch_z = HINGE_Z + notch_dist * math.sin(notch_angle)
outer_ny = -math.sin(notch_angle)
outer_nz = math.cos(notch_angle)
notch_y += outer_ny * (LID_T/2 + 0.0012)
notch_z += outer_nz * (LID_T/2 + 0.0012)
bpy.ops.mesh.primitive_cube_add(size=1, location=(0, notch_y, notch_z))
notch = bpy.context.active_object
notch.name = "Notch"
notch.scale = (0.012, 0.003, 0.001)
notch.rotation_euler.x = math.radians(LID_WORLD_ANGLE)
notch.data.materials.append(black_bezel)

# Ground
bpy.ops.mesh.primitive_plane_add(size=5, location=(0, 0, -0.001))
bpy.context.active_object.data.materials.append(ground_mat)

# === HDRI ===
world = bpy.data.worlds.new("W")
world.use_nodes = True
scene.world = world
wn = world.node_tree.nodes; wl = world.node_tree.links; wn.clear()
out_w = wn.new('ShaderNodeOutputWorld')
bg = wn.new('ShaderNodeBackground')
bg.inputs['Strength'].default_value = 0.3
env = wn.new('ShaderNodeTexEnvironment')
if os.path.exists(HDRI_PATH):
    env.image = bpy.data.images.load(HDRI_PATH)
    print("HDRI loaded")
mapping = wn.new('ShaderNodeMapping')
mapping.inputs['Rotation'].default_value = (0, 0, math.radians(90))
tc = wn.new('ShaderNodeTexCoord')
wl.new(tc.outputs['Generated'], mapping.inputs['Vector'])
wl.new(mapping.outputs['Vector'], env.inputs['Vector'])
wl.new(env.outputs['Color'], bg.inputs['Color'])
wl.new(bg.outputs['Background'], out_w.inputs['Surface'])

# === LIGHTS ===
bpy.ops.object.light_add(type='AREA', location=(0.6, -0.4, 0.6))
k = bpy.context.active_object
k.data.energy = 12; k.data.size = 0.5
k.rotation_euler = (math.radians(50), 0, math.radians(25))

bpy.ops.object.light_add(type='AREA', location=(-0.5, -0.3, 0.45))
f = bpy.context.active_object
f.data.energy = 6; f.data.size = 0.7
f.rotation_euler = (math.radians(55), 0, math.radians(-30))

bpy.ops.object.light_add(type='AREA', location=(-0.15, 0.6, 0.3))
r = bpy.context.active_object
r.data.energy = 15; r.data.size = 0.4
r.rotation_euler = (math.radians(110), 0, 0)

# Screen spill light (simulates screen glow on keyboard)
# Right edge rim light
bpy.ops.object.light_add(type='AREA', location=(0.25, 0.1, 0.15))
rim2 = bpy.context.active_object
rim2.name = "RimRight"
rim2.data.energy = 5
rim2.data.size = 0.15
rim2.rotation_euler = (math.radians(80), 0, math.radians(-90))

# Screen spill - positioned where screen meets keyboard, pointing down
bpy.ops.object.light_add(type='AREA', location=(0, HINGE_Y - 0.02, HINGE_Z + 0.03))
spill = bpy.context.active_object
spill.name = "ScreenSpill"
spill.data.energy = 12
spill.data.size = 0.28  # wide as keyboard
spill.data.size_y = 0.10
spill.data.color = (0.85, 0.82, 0.7)
spill.rotation_euler = (math.radians(-70), 0, 0)  # steep angle down onto keyboard

# === CAMERA ===
CAMERA_PRESETS = {
    "hero": {"loc": (0.45, -0.55, 0.35), "target": (0, 0.02, 0.10), "lens": 55},
    "front": {"loc": (0.05, -0.65, 0.25), "target": (0, 0.02, 0.10), "lens": 60},
    "left": {"loc": (-0.40, -0.50, 0.30), "target": (0, 0.02, 0.10), "lens": 55},
}
cp = CAMERA_PRESETS.get(CAMERA_PRESET, CAMERA_PRESETS["hero"])
bpy.ops.object.camera_add(location=cp["loc"])
cam = bpy.context.active_object
bpy.ops.object.empty_add(location=cp["target"])
target = bpy.context.active_object
track = cam.constraints.new('TRACK_TO')
track.target = target
track.track_axis = 'TRACK_NEGATIVE_Z'
track.up_axis = 'UP_Y'
cam.data.lens = cp["lens"]
cam.data.dof.use_dof = True
cam.data.dof.focus_object = target
cam.data.dof.aperture_fstop = 11.0
scene.camera = cam

# Color
scene.view_settings.view_transform = 'AgX'
scene.view_settings.look = 'AgX - Medium High Contrast'

# === RENDER ===
print("Rendering...")
bpy.ops.render.render(write_still=True)
print(f"Done: {OUTPUT_PATH}")
