import bpy
import math
import sys
import os

BASE = "/Users/kikai/clawd/projects/micro-businesses"

PRODUCTS = [
    {"id": "02-draft",     "name": "DRAFT",     "color": (0.96, 0.77, 0.09), "price": "$19"},
    {"id": "03-stack",     "name": "STACK",     "color": (0.65, 0.54, 0.98), "price": "$27"},
    {"id": "04-blueprint", "name": "BLUEPRINT", "color": (0.79, 0.66, 0.30), "price": "$37"},
    {"id": "05-ledger",    "name": "LEDGER",    "color": (0.24, 0.81, 0.56), "price": "$17"},
    {"id": "06-flow",      "name": "FLOW",      "color": (1.0,  0.42, 0.42), "price": "$29"},
    {"id": "07-pulse",     "name": "PULSE",     "color": (0.29, 0.62, 1.0),  "price": "$24"},
]

def clear_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    for obj in bpy.data.objects:
        bpy.data.objects.remove(obj, do_unlink=True)

def setup_render(w=1200, h=630, samples=64):
    scene = bpy.context.scene
    scene.render.engine = 'CYCLES'
    scene.cycles.samples = samples
    scene.cycles.use_denoising = True
    scene.render.resolution_x = w
    scene.render.resolution_y = h
    scene.render.image_settings.file_format = 'JPEG'
    scene.render.image_settings.quality = 95
    # Black background
    scene.world = bpy.data.worlds.new("World")
    scene.world.use_nodes = True
    bg = scene.world.node_tree.nodes['Background']
    bg.inputs['Color'].default_value = (0.02, 0.02, 0.02, 1)
    bg.inputs['Strength'].default_value = 0.0

def make_screen_material(img_path, emit_strength=2.0):
    mat = bpy.data.materials.new(name="Screen_" + os.path.basename(img_path))
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()
    output = nodes.new('ShaderNodeOutputMaterial')
    emission = nodes.new('ShaderNodeEmission')
    emission.inputs['Strength'].default_value = emit_strength
    tex = nodes.new('ShaderNodeTexImage')
    try:
        tex.image = bpy.data.images.load(img_path)
        tex.image.colorspace_settings.name = 'sRGB'
    except:
        emission.inputs['Color'].default_value = (0.05, 0.05, 0.1, 1)
    links.new(emission.inputs['Color'], tex.outputs['Color'])
    links.new(output.inputs['Surface'], emission.outputs['Emission'])
    return mat

def make_glossy_material(color, roughness=0.05, metallic=1.0):
    mat = bpy.data.materials.new(name="Body")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs['Base Color'].default_value = (*color, 1)
    bsdf.inputs['Metallic'].default_value = metallic
    bsdf.inputs['Roughness'].default_value = roughness
    return mat

def build_macbook(screen_img_path, angle_y=-0.22, angle_x=0.08):
    """Build a stylised MacBook Pro with screen texture"""
    body_mat = make_glossy_material((0.13, 0.13, 0.13), roughness=0.08)
    screen_mat = make_screen_material(screen_img_path)
    bezel_mat = make_glossy_material((0.06, 0.06, 0.06), roughness=0.12)

    # --- BASE (keyboard deck) ---
    bpy.ops.mesh.primitive_cube_add(size=1)
    base = bpy.context.active_object
    base.name = "MacBook_Base"
    base.scale = (1.55, 1.0, 0.035)
    base.data.materials.append(body_mat)

    # --- LID ---
    bpy.ops.mesh.primitive_cube_add(size=1)
    lid = bpy.context.active_object
    lid.name = "MacBook_Lid"
    lid.scale = (1.55, 1.0, 0.018)
    # Hinge at back of base, open ~110 degrees
    lid.location = (0, -0.5, 0.035 + 0.018)
    lid.rotation_euler = (-1.92, 0, 0)
    # After rotation reposition properly
    lid.location = (0, 0.48, 0.035 + 0.9)
    lid.data.materials.append(body_mat)

    # --- SCREEN (emission plane inside lid) ---
    bpy.ops.mesh.primitive_plane_add(size=1)
    screen = bpy.context.active_object
    screen.name = "Screen"
    screen.scale = (1.40, 0.875, 1)
    # Match lid transform
    screen.location = (0, 0.455, 0.035 + 0.902)
    screen.rotation_euler = (-1.92, 0, 0)
    screen.data.materials.append(screen_mat)

    # --- BEZEL around screen ---
    bpy.ops.mesh.primitive_cube_add(size=1)
    bezel = bpy.context.active_object
    bezel.name = "Bezel"
    bezel.scale = (1.52, 0.96, 0.01)
    bezel.location = (0, 0.45, 0.035 + 0.903)
    bezel.rotation_euler = (-1.92, 0, 0)
    bezel.data.materials.append(bezel_mat)

    # Parent everything to base
    for obj in [lid, screen, bezel]:
        obj.parent = base

    # Rotate whole assembly
    base.rotation_euler = (angle_x, 0, angle_y)
    base.location = (0, 0, 0)
    return base

def add_studio_lights():
    # Key light (top left, warm)
    bpy.ops.object.light_add(type='AREA', location=(-3, -2, 4))
    key = bpy.context.active_object
    key.data.energy = 800
    key.data.size = 3
    key.data.color = (1.0, 0.96, 0.9)
    key.rotation_euler = (math.radians(45), 0, math.radians(-35))

    # Fill light (right, cool, softer)
    bpy.ops.object.light_add(type='AREA', location=(3, -1, 2))
    fill = bpy.context.active_object
    fill.data.energy = 200
    fill.data.size = 4
    fill.data.color = (0.85, 0.9, 1.0)
    fill.rotation_euler = (math.radians(30), 0, math.radians(40))

    # Rim light (back, cold, accent glow)
    bpy.ops.object.light_add(type='SPOT', location=(0, 3, 2))
    rim = bpy.context.active_object
    rim.data.energy = 300
    rim.data.spot_size = math.radians(60)
    rim.data.color = (0.7, 0.8, 1.0)
    rim.rotation_euler = (math.radians(-60), 0, 0)

def add_camera_preview():
    bpy.ops.object.camera_add(location=(0, -4.2, 2.2))
    cam = bpy.context.active_object
    cam.rotation_euler = (math.radians(65), 0, 0)
    cam.data.lens = 70
    cam.data.dof.use_dof = True
    cam.data.dof.focus_distance = 4.5
    cam.data.dof.aperture_fstop = 4.0
    bpy.context.scene.camera = cam

def add_ground_plane():
    bpy.ops.mesh.primitive_plane_add(size=20, location=(0, 0, -0.036))
    ground = bpy.context.active_object
    mat = bpy.data.materials.new("Ground")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs['Base Color'].default_value = (0.02, 0.02, 0.02, 1)
    bsdf.inputs['Roughness'].default_value = 0.8
    ground.data.materials.append(mat)
    return ground

def render_to(path):
    bpy.context.scene.render.filepath = path
    bpy.ops.render.render(write_still=True)
    print(f"RENDERED: {path}")

# ── MAIN ──────────────────────────────────────────────────────────────
for p in PRODUCTS:
    pid = p["id"]
    folder_num = pid.split("-")[0]
    folder_name = pid.split("-")[1]
    out_dir = f"{BASE}/businesses/{pid}/images"
    os.makedirs(out_dir, exist_ok=True)
    ss_base = f"{BASE}/assets/screenshots/{pid}"

    print(f"\n=== Rendering {p['name']} ===")

    # --- preview.jpg: MacBook angled with hero screenshot ---
    clear_scene()
    setup_render(1200, 630, samples=96)
    add_ground_plane()
    hero_img = f"{ss_base}-hero.png"
    build_macbook(hero_img, angle_y=-0.25, angle_x=0.05)
    add_studio_lights()
    add_camera_preview()
    render_to(f"{out_dir}/preview.jpg")

    # --- feature-1.jpg: MacBook straight-on with feat1 ---
    clear_scene()
    setup_render(1200, 630, samples=96)
    add_ground_plane()
    feat1_img = f"{ss_base}-feat1.png"
    build_macbook(feat1_img, angle_y=0.0, angle_x=0.06)
    add_studio_lights()
    bpy.ops.object.camera_add(location=(0, -4.0, 1.8))
    cam = bpy.context.active_object
    cam.rotation_euler = (math.radians(70), 0, 0)
    cam.data.lens = 85
    bpy.context.scene.camera = cam
    render_to(f"{out_dir}/feature-1.jpg")

    # --- feature-2.jpg: MacBook tight crop with feat2 ---
    clear_scene()
    setup_render(1200, 630, samples=96)
    add_ground_plane()
    feat2_img = f"{ss_base}-feat2.png"
    build_macbook(feat2_img, angle_y=0.18, angle_x=0.04)
    add_studio_lights()
    bpy.ops.object.camera_add(location=(1.2, -3.5, 2.0))
    cam = bpy.context.active_object
    cam.rotation_euler = (math.radians(62), 0, math.radians(15))
    cam.data.lens = 90
    bpy.context.scene.camera = cam
    render_to(f"{out_dir}/feature-2.jpg")

print("\nALL_RENDERS_COMPLETE")
