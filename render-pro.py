"""
render-pro.py — Professional product mockup renderer
Usage: blender --background --python render-pro.py [-- --product 02-draft]

Produces Apple.com-quality product shots with:
- Procedural MacBook Pro + iPhone 15 Pro models with proper geometry
- HDRI studio lighting for realistic reflections
- Cycles GPU (Metal) rendering at 2x with downscale
- Principled BSDF materials tuned for aluminum/glass
- 85mm camera with shallow DOF
"""

import bpy
import bmesh
import math
import sys
import os
from mathutils import Vector, Euler

BASE = "/Users/kikai/clawd/projects/micro-businesses"
HDRI_PATH = os.path.join(BASE, "assets/hdri/studio_small_08.hdr")

PRODUCTS = [
    {"id": "02-draft",     "name": "DRAFT",     "accent": (0.96, 0.77, 0.09)},
    {"id": "03-stack",     "name": "STACK",     "accent": (0.65, 0.54, 0.98)},
    {"id": "04-blueprint", "name": "BLUEPRINT", "accent": (0.79, 0.66, 0.30)},
    {"id": "05-ledger",    "name": "LEDGER",    "accent": (0.24, 0.81, 0.56)},
    {"id": "06-flow",      "name": "FLOW",      "accent": (1.0,  0.42, 0.42)},
    {"id": "07-pulse",     "name": "PULSE",     "accent": (0.29, 0.62, 1.0)},
]

# ─── UTILITIES ────────────────────────────────────────────────────────

def clear_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    for block in [bpy.data.meshes, bpy.data.materials, bpy.data.images,
                  bpy.data.textures, bpy.data.worlds, bpy.data.lights,
                  bpy.data.cameras]:
        for item in block:
            block.remove(item)

def enable_gpu():
    prefs = bpy.context.preferences
    cycles_prefs = prefs.addons['cycles'].preferences
    cycles_prefs.compute_device_type = 'METAL'
    cycles_prefs.get_devices()
    for d in cycles_prefs.devices:
        d.use = True

def setup_render(width=2400, height=1260, samples=256):
    scene = bpy.context.scene
    scene.render.engine = 'CYCLES'
    scene.cycles.device = 'GPU'
    scene.cycles.samples = samples
    scene.cycles.use_denoising = True
    scene.cycles.denoiser = 'OPENIMAGEDENOISE'
    # Adaptive sampling for speed
    scene.cycles.use_adaptive_sampling = True
    scene.cycles.adaptive_threshold = 0.005
    # Light paths for product shots
    scene.cycles.max_bounces = 8
    scene.cycles.diffuse_bounces = 4
    scene.cycles.glossy_bounces = 4
    scene.cycles.transmission_bounces = 8
    scene.cycles.transparent_max_bounces = 8
    # Resolution (2x for downscale AA)
    scene.render.resolution_x = width
    scene.render.resolution_y = height
    scene.render.resolution_percentage = 100
    # Output
    scene.render.image_settings.file_format = 'JPEG'
    scene.render.image_settings.quality = 97
    # Color management for photorealistic output
    scene.view_settings.view_transform = 'Filmic'
    scene.view_settings.look = 'Medium High Contrast'
    scene.view_settings.exposure = 0.0
    scene.view_settings.gamma = 1.0
    enable_gpu()

# ─── HDRI ENVIRONMENT ────────────────────────────────────────────────

def setup_hdri(hdri_path=HDRI_PATH, strength=1.0, rotation=0.0):
    world = bpy.data.worlds.new("World")
    bpy.context.scene.world = world
    world.use_nodes = True
    nodes = world.node_tree.nodes
    links = world.node_tree.links
    nodes.clear()

    output = nodes.new('ShaderNodeOutputWorld')
    background = nodes.new('ShaderNodeBackground')
    background.inputs['Strength'].default_value = strength

    env_tex = nodes.new('ShaderNodeTexEnvironment')
    env_tex.image = bpy.data.images.load(hdri_path)

    mapping = nodes.new('ShaderNodeMapping')
    mapping.inputs['Rotation'].default_value = (0, 0, rotation)
    tex_coord = nodes.new('ShaderNodeTexCoord')

    links.new(tex_coord.outputs['Generated'], mapping.inputs['Vector'])
    links.new(mapping.outputs['Vector'], env_tex.inputs['Vector'])
    links.new(env_tex.outputs['Color'], background.inputs['Color'])
    links.new(background.outputs['Background'], output.inputs['Surface'])

def setup_dark_gradient_bg(strength=0.3):
    """Dark gradient background as alternative to HDRI visible bg"""
    world = bpy.data.worlds.new("World")
    bpy.context.scene.world = world
    world.use_nodes = True
    nodes = world.node_tree.nodes
    links = world.node_tree.links
    nodes.clear()

    output = nodes.new('ShaderNodeOutputWorld')
    mix = nodes.new('ShaderNodeMixShader')

    # Dark bottom
    bg_dark = nodes.new('ShaderNodeBackground')
    bg_dark.inputs['Color'].default_value = (0.012, 0.012, 0.015, 1)
    bg_dark.inputs['Strength'].default_value = 1.0

    # Slightly lighter top
    bg_light = nodes.new('ShaderNodeBackground')
    bg_light.inputs['Color'].default_value = (0.03, 0.03, 0.035, 1)
    bg_light.inputs['Strength'].default_value = 1.0

    # Gradient based on camera ray direction
    tex_coord = nodes.new('ShaderNodeTexCoord')
    separate = nodes.new('ShaderNodeSeparateXYZ')
    ramp = nodes.new('ShaderNodeMapRange')
    ramp.inputs['From Min'].default_value = -0.3
    ramp.inputs['From Max'].default_value = 0.5

    links.new(tex_coord.outputs['Generated'], separate.inputs['Vector'])
    links.new(separate.outputs['Z'], ramp.inputs['Value'])
    links.new(ramp.outputs['Result'], mix.inputs['Fac'])
    links.new(bg_dark.outputs['Background'], mix.inputs[1])
    links.new(bg_light.outputs['Background'], mix.inputs[2])
    links.new(mix.outputs['Shader'], output.inputs['Surface'])

def setup_hdri_with_dark_bg(hdri_path=HDRI_PATH, hdri_strength=0.8):
    """HDRI for lighting only, dark background for camera"""
    world = bpy.data.worlds.new("World")
    bpy.context.scene.world = world
    world.use_nodes = True
    nodes = world.node_tree.nodes
    links = world.node_tree.links
    nodes.clear()

    output = nodes.new('ShaderNodeOutputWorld')

    # Light path node to separate camera from lighting
    light_path = nodes.new('ShaderNodeLightPath')
    mix = nodes.new('ShaderNodeMixShader')

    # HDRI for lighting (reflections, illumination)
    env_tex = nodes.new('ShaderNodeTexEnvironment')
    env_tex.image = bpy.data.images.load(hdri_path)
    mapping = nodes.new('ShaderNodeMapping')
    mapping.inputs['Rotation'].default_value = (0, 0, math.radians(120))
    tex_coord = nodes.new('ShaderNodeTexCoord')
    bg_hdri = nodes.new('ShaderNodeBackground')
    bg_hdri.inputs['Strength'].default_value = hdri_strength

    links.new(tex_coord.outputs['Generated'], mapping.inputs['Vector'])
    links.new(mapping.outputs['Vector'], env_tex.inputs['Vector'])
    links.new(env_tex.outputs['Color'], bg_hdri.inputs['Color'])

    # Dark background for camera rays
    bg_dark = nodes.new('ShaderNodeBackground')
    bg_dark.inputs['Color'].default_value = (0.015, 0.015, 0.018, 1)
    bg_dark.inputs['Strength'].default_value = 1.0

    # Mix: camera ray → dark, everything else → HDRI
    links.new(light_path.outputs['Is Camera Ray'], mix.inputs['Fac'])
    links.new(bg_hdri.outputs['Background'], mix.inputs[1])
    links.new(bg_dark.outputs['Background'], mix.inputs[2])
    links.new(mix.outputs['Shader'], output.inputs['Surface'])

# ─── MATERIALS ────────────────────────────────────────────────────────

def mat_aluminum(name="Aluminum", color=(0.48, 0.48, 0.48)):
    """Space Gray aluminum with anisotropic brushed look"""
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    bsdf = nodes["Principled BSDF"]
    bsdf.inputs['Base Color'].default_value = (*color, 1)
    bsdf.inputs['Metallic'].default_value = 1.0
    bsdf.inputs['Roughness'].default_value = 0.15
    bsdf.inputs['Specular IOR Level'].default_value = 0.5
    # Add noise texture for micro-scratch variation
    noise = nodes.new('ShaderNodeTexNoise')
    noise.inputs['Scale'].default_value = 500
    noise.inputs['Detail'].default_value = 8
    noise.inputs['Roughness'].default_value = 0.7
    ramp = nodes.new('ShaderNodeMapRange')
    ramp.inputs['From Min'].default_value = 0.4
    ramp.inputs['From Max'].default_value = 0.6
    ramp.inputs['To Min'].default_value = 0.12
    ramp.inputs['To Max'].default_value = 0.18
    links.new(noise.outputs['Fac'], ramp.inputs['Value'])
    links.new(ramp.outputs['Result'], bsdf.inputs['Roughness'])
    return mat

def mat_dark_aluminum(name="DarkAluminum"):
    """Darker aluminum for keyboard area"""
    return mat_aluminum(name, color=(0.08, 0.08, 0.08))

def mat_screen_bezel(name="Bezel"):
    """Black glass bezel around screen"""
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs['Base Color'].default_value = (0.01, 0.01, 0.01, 1)
    bsdf.inputs['Metallic'].default_value = 0.0
    bsdf.inputs['Roughness'].default_value = 0.05
    bsdf.inputs['Specular IOR Level'].default_value = 0.5
    bsdf.inputs['Coat Weight'].default_value = 1.0
    bsdf.inputs['Coat Roughness'].default_value = 0.02
    return mat

def mat_screen_emission(img_path, strength=2.2):
    """Screen material: emission + slight glass reflection overlay"""
    mat = bpy.data.materials.new("Screen_" + os.path.basename(img_path))
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()

    output = nodes.new('ShaderNodeOutputMaterial')
    # Mix emission with glossy for screen reflections
    mix = nodes.new('ShaderNodeMixShader')
    mix.inputs['Fac'].default_value = 0.06  # 6% reflection

    emission = nodes.new('ShaderNodeEmission')
    emission.inputs['Strength'].default_value = strength

    glossy = nodes.new('ShaderNodeBsdfGlossy')
    glossy.inputs['Roughness'].default_value = 0.02
    glossy.inputs['Color'].default_value = (1, 1, 1, 1)

    tex = nodes.new('ShaderNodeTexImage')
    try:
        tex.image = bpy.data.images.load(img_path)
        tex.image.colorspace_settings.name = 'sRGB'
    except Exception as e:
        print(f"WARNING: Could not load {img_path}: {e}")
        emission.inputs['Color'].default_value = (0.05, 0.05, 0.1, 1)

    links.new(tex.outputs['Color'], emission.inputs['Color'])
    links.new(emission.outputs['Emission'], mix.inputs[1])
    links.new(glossy.outputs['BSDF'], mix.inputs[2])
    links.new(mix.outputs['Shader'], output.inputs['Surface'])
    return mat

def mat_rubber(name="Rubber"):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs['Base Color'].default_value = (0.02, 0.02, 0.02, 1)
    bsdf.inputs['Roughness'].default_value = 0.8
    bsdf.inputs['Metallic'].default_value = 0.0
    return mat

def mat_keyboard(name="Keyboard"):
    """Dark keys material"""
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs['Base Color'].default_value = (0.02, 0.02, 0.02, 1)
    bsdf.inputs['Roughness'].default_value = 0.4
    bsdf.inputs['Metallic'].default_value = 0.0
    return mat

def mat_iphone_body(name="iPhoneBody"):
    """Titanium finish for iPhone 15 Pro"""
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs['Base Color'].default_value = (0.35, 0.33, 0.32, 1)  # Natural titanium
    bsdf.inputs['Metallic'].default_value = 0.95
    bsdf.inputs['Roughness'].default_value = 0.25
    return mat

def mat_iphone_screen(img_path, strength=3.0):
    """iPhone screen emission - brighter since smaller"""
    return mat_screen_emission(img_path, strength=strength)

# ─── 3D MODELS ────────────────────────────────────────────────────────

def build_macbook_pro(screen_img_path, open_angle=110):
    """
    Build a detailed MacBook Pro 14" model.
    Real dimensions: 312.6 × 221.2 × 15.5 mm
    We work in Blender units ≈ 0.1m scale for nice viewport sizes.
    """
    # Scale: 1 BU = ~100mm
    W = 3.126  # width
    D = 2.212  # depth
    H = 0.155  # height (closed)
    base_h = 0.09
    lid_h = 0.04
    bevel_r = 0.02

    aluminum = mat_aluminum()
    bezel = mat_screen_bezel()
    keyboard = mat_keyboard()
    rubber = mat_rubber()
    screen_mat = mat_screen_emission(screen_img_path)

    # ── BASE (bottom half) ──
    bpy.ops.mesh.primitive_cube_add(size=1)
    base = bpy.context.active_object
    base.name = "MB_Base"
    base.scale = (W/2, D/2, base_h/2)
    bpy.ops.object.transform_apply(scale=True)

    # Bevel edges for rounded look
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.bevel(offset=bevel_r, segments=3, affect='EDGES')
    bpy.ops.object.mode_set(mode='OBJECT')
    base.data.materials.append(aluminum)

    # ── KEYBOARD DEPRESSION ──
    bpy.ops.mesh.primitive_cube_add(size=1)
    kb = bpy.context.active_object
    kb.name = "MB_Keyboard"
    kb_w = W * 0.75
    kb_d = D * 0.35
    kb.scale = (kb_w/2, kb_d/2, 0.003)
    kb.location = (0, -D*0.05, base_h/2 + 0.001)
    bpy.ops.object.transform_apply(scale=True)
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.bevel(offset=0.01, segments=2, affect='EDGES')
    bpy.ops.object.mode_set(mode='OBJECT')
    kb.data.materials.append(keyboard)

    # ── TRACKPAD ──
    bpy.ops.mesh.primitive_cube_add(size=1)
    tp = bpy.context.active_object
    tp.name = "MB_Trackpad"
    tp_w = W * 0.28
    tp_d = D * 0.25
    tp.scale = (tp_w/2, tp_d/2, 0.002)
    tp.location = (0, -D*0.28, base_h/2 + 0.001)
    bpy.ops.object.transform_apply(scale=True)
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.bevel(offset=0.008, segments=2, affect='EDGES')
    bpy.ops.object.mode_set(mode='OBJECT')
    tp_mat = mat_aluminum("Trackpad", color=(0.42, 0.42, 0.42))
    tp.data.materials.append(tp_mat)

    # ── LID ──
    bpy.ops.mesh.primitive_cube_add(size=1)
    lid = bpy.context.active_object
    lid.name = "MB_Lid"
    lid.scale = (W/2, D/2, lid_h/2)
    bpy.ops.object.transform_apply(scale=True)
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.bevel(offset=bevel_r, segments=3, affect='EDGES')
    bpy.ops.object.mode_set(mode='OBJECT')
    lid.data.materials.append(aluminum)

    # Position lid: hinge at back edge of base
    hinge_y = D/2
    angle_rad = math.radians(open_angle)

    # Lid pivots from hinge point
    lid.location = (
        0,
        hinge_y - (D/2) * math.cos(angle_rad),
        base_h/2 + (D/2) * math.sin(angle_rad)
    )
    lid.rotation_euler = (-(math.pi - angle_rad), 0, 0)

    # ── SCREEN (emission plane on inner face of lid) ──
    screen_w = W * 0.89
    screen_d = D * 0.88
    bpy.ops.mesh.primitive_plane_add(size=1)
    screen = bpy.context.active_object
    screen.name = "MB_Screen"
    screen.scale = (screen_w/2, screen_d/2, 1)
    bpy.ops.object.transform_apply(scale=True)
    screen.data.materials.append(screen_mat)

    # Position screen slightly in front of lid inner surface
    screen_offset = lid_h/2 + 0.002  # Slightly above lid surface
    screen.location = (
        0,
        hinge_y - (D/2) * math.cos(angle_rad) - screen_offset * math.sin(angle_rad),
        base_h/2 + (D/2) * math.sin(angle_rad) + screen_offset * math.cos(angle_rad)
    )
    screen.rotation_euler = lid.rotation_euler.copy()

    # ── BEZEL (slightly larger than screen, behind it) ──
    bpy.ops.mesh.primitive_cube_add(size=1)
    bez = bpy.context.active_object
    bez.name = "MB_Bezel"
    bez.scale = (W * 0.93 / 2, D * 0.92 / 2, 0.003)
    bpy.ops.object.transform_apply(scale=True)
    bez.data.materials.append(bezel)
    bezel_offset = lid_h/2 + 0.001
    bez.location = (
        0,
        hinge_y - (D/2) * math.cos(angle_rad) - bezel_offset * math.sin(angle_rad),
        base_h/2 + (D/2) * math.sin(angle_rad) + bezel_offset * math.cos(angle_rad)
    )
    bez.rotation_euler = lid.rotation_euler.copy()

    # ── RUBBER FEET ──
    foot_positions = [
        (-W/2 + 0.15, -D/2 + 0.1, -base_h/2),
        (W/2 - 0.15, -D/2 + 0.1, -base_h/2),
        (-W/2 + 0.15, D/2 - 0.15, -base_h/2),
        (W/2 - 0.15, D/2 - 0.15, -base_h/2),
    ]
    for i, pos in enumerate(foot_positions):
        bpy.ops.mesh.primitive_cylinder_add(radius=0.04, depth=0.008)
        foot = bpy.context.active_object
        foot.name = f"MB_Foot_{i}"
        foot.location = pos
        foot.data.materials.append(rubber)

    # Parent all to base
    all_parts = [kb, tp, lid, screen, bez] + [
        o for o in bpy.data.objects if o.name.startswith("MB_Foot_")
    ]
    for obj in all_parts:
        obj.parent = base

    return base

def build_iphone_15pro(screen_img_path):
    """
    Build iPhone 15 Pro model.
    Real: 146.6 × 70.6 × 8.25 mm
    """
    W = 0.706
    H = 1.466
    D = 0.0825
    corner_r = 0.06

    body_mat = mat_iphone_body()
    screen_mat = mat_iphone_screen(screen_img_path)
    glass_mat = mat_screen_bezel("iPhoneGlass")

    # Body
    bpy.ops.mesh.primitive_cube_add(size=1)
    body = bpy.context.active_object
    body.name = "iPhone_Body"
    body.scale = (W/2, H/2, D/2)
    bpy.ops.object.transform_apply(scale=True)
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.bevel(offset=corner_r, segments=6, affect='EDGES')
    bpy.ops.object.mode_set(mode='OBJECT')
    body.data.materials.append(body_mat)

    # Screen
    bpy.ops.mesh.primitive_plane_add(size=1)
    screen = bpy.context.active_object
    screen.name = "iPhone_Screen"
    screen.scale = (W * 0.92 / 2, H * 0.95 / 2, 1)
    screen.location = (0, 0, D/2 + 0.001)
    bpy.ops.object.transform_apply(scale=True)
    screen.data.materials.append(screen_mat)

    # Dynamic Island
    bpy.ops.mesh.primitive_cube_add(size=1)
    di = bpy.context.active_object
    di.name = "iPhone_DI"
    di.scale = (0.1, 0.03, 0.003)
    di.location = (0, H * 0.42, D/2 + 0.002)
    bpy.ops.object.transform_apply(scale=True)
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.bevel(offset=0.015, segments=4, affect='EDGES')
    bpy.ops.object.mode_set(mode='OBJECT')
    glass_black = mat_screen_bezel("DI_Black")
    di.data.materials.append(glass_black)

    # Camera bump (back)
    bpy.ops.mesh.primitive_cube_add(size=1)
    cam_bump = bpy.context.active_object
    cam_bump.name = "iPhone_CamBump"
    cam_bump.scale = (0.16, 0.16, 0.02)
    cam_bump.location = (-W/2 + 0.2, H/2 - 0.2, -D/2 - 0.01)
    bpy.ops.object.transform_apply(scale=True)
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.bevel(offset=0.02, segments=3, affect='EDGES')
    bpy.ops.object.mode_set(mode='OBJECT')
    cam_bump.data.materials.append(body_mat)

    # Parent
    for obj in [screen, di, cam_bump]:
        obj.parent = body

    return body

# ─── SCENE SETUP ──────────────────────────────────────────────────────

def add_ground_plane():
    """Reflective dark surface"""
    bpy.ops.mesh.primitive_plane_add(size=30, location=(0, 0, -0.045))
    ground = bpy.context.active_object
    ground.name = "Ground"
    mat = bpy.data.materials.new("Ground")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes["Principled BSDF"]
    bsdf.inputs['Base Color'].default_value = (0.018, 0.018, 0.02, 1)
    bsdf.inputs['Roughness'].default_value = 0.3  # Semi-reflective
    bsdf.inputs['Metallic'].default_value = 0.0
    bsdf.inputs['Specular IOR Level'].default_value = 0.3
    ground.data.materials.append(mat)
    return ground

def add_accent_light(color, location, energy=50, size=0.5):
    """Subtle colored accent light"""
    bpy.ops.object.light_add(type='AREA', location=location)
    light = bpy.context.active_object
    light.data.energy = energy
    light.data.size = size
    light.data.color = color
    return light

def setup_camera_preview(target_loc=(0, 0.3, 0.4)):
    """Professional 3/4 view from slightly above"""
    cam_loc = (1.8, -3.2, 2.0)
    bpy.ops.object.camera_add(location=cam_loc)
    cam = bpy.context.active_object
    cam.name = "Camera"

    # Point camera at target
    direction = Vector(target_loc) - Vector(cam_loc)
    rot_quat = direction.to_track_quat('-Z', 'Y')
    cam.rotation_euler = rot_quat.to_euler()

    cam.data.lens = 85
    cam.data.dof.use_dof = True
    cam.data.dof.focus_distance = direction.length
    cam.data.dof.aperture_fstop = 3.5  # Slight blur, keep screen sharp
    cam.data.sensor_width = 36
    bpy.context.scene.camera = cam
    return cam

def setup_camera_front(target_loc=(0, 0.3, 0.5)):
    """More frontal view"""
    cam_loc = (0.3, -3.8, 1.6)
    bpy.ops.object.camera_add(location=cam_loc)
    cam = bpy.context.active_object
    cam.name = "Camera"
    direction = Vector(target_loc) - Vector(cam_loc)
    rot_quat = direction.to_track_quat('-Z', 'Y')
    cam.rotation_euler = rot_quat.to_euler()
    cam.data.lens = 85
    cam.data.dof.use_dof = True
    cam.data.dof.focus_distance = direction.length
    cam.data.dof.aperture_fstop = 4.0
    cam.data.sensor_width = 36
    bpy.context.scene.camera = cam
    return cam

def setup_camera_detail(target_loc=(0.3, 0.2, 0.5)):
    """Tight crop detail view"""
    cam_loc = (1.5, -2.5, 1.8)
    bpy.ops.object.camera_add(location=cam_loc)
    cam = bpy.context.active_object
    cam.name = "Camera"
    direction = Vector(target_loc) - Vector(cam_loc)
    rot_quat = direction.to_track_quat('-Z', 'Y')
    cam.rotation_euler = rot_quat.to_euler()
    cam.data.lens = 100  # Tighter
    cam.data.dof.use_dof = True
    cam.data.dof.focus_distance = direction.length
    cam.data.dof.aperture_fstop = 2.8
    cam.data.sensor_width = 36
    bpy.context.scene.camera = cam
    return cam

def render_to(path):
    bpy.context.scene.render.filepath = path
    bpy.ops.render.render(write_still=True)
    print(f"RENDERED → {path}")

# ─── RENDER COMPOSITIONS ─────────────────────────────────────────────

def render_preview(product_id, accent_color):
    """Hero shot: MacBook 3/4 view with iPhone leaning nearby"""
    clear_scene()
    setup_render(2400, 1260, samples=256)
    setup_hdri_with_dark_bg(HDRI_PATH, hdri_strength=0.7)
    add_ground_plane()

    ss_base = f"{BASE}/assets/screenshots/{product_id}"
    hero_img = f"{ss_base}-hero.png"
    mobile_img = f"{ss_base}-mobile.png"

    # MacBook — slight angle
    mb = build_macbook_pro(hero_img, open_angle=115)
    mb.rotation_euler = (0, 0, math.radians(-12))
    mb.location = (-0.2, 0.15, 0)

    # iPhone — standing at angle beside MacBook
    if os.path.exists(mobile_img):
        iphone = build_iphone_15pro(mobile_img)
        iphone.location = (1.9, -0.3, 0.0)
        iphone.rotation_euler = (math.radians(75), 0, math.radians(-5))

    # Accent light matching product color
    add_accent_light(accent_color, location=(-2, 1, 2), energy=30, size=1.0)

    setup_camera_preview(target_loc=(0.2, 0.3, 0.5))

    out_dir = f"{BASE}/businesses/{product_id}/images"
    os.makedirs(out_dir, exist_ok=True)
    render_to(f"{out_dir}/preview.jpg")

def render_feature1(product_id, accent_color):
    """Feature shot 1: MacBook straight-on, full screen visible"""
    clear_scene()
    setup_render(2400, 1260, samples=256)
    setup_hdri_with_dark_bg(HDRI_PATH, hdri_strength=0.7)
    add_ground_plane()

    ss_base = f"{BASE}/assets/screenshots/{product_id}"
    feat1_img = f"{ss_base}-feat1.png"

    mb = build_macbook_pro(feat1_img, open_angle=120)
    mb.rotation_euler = (0, 0, 0)

    add_accent_light(accent_color, location=(2, -1, 2), energy=25, size=0.8)

    setup_camera_front(target_loc=(0, 0.3, 0.6))

    out_dir = f"{BASE}/businesses/{product_id}/images"
    render_to(f"{out_dir}/feature-1.jpg")

def render_feature2(product_id, accent_color):
    """Feature shot 2: Detail/dramatic angle"""
    clear_scene()
    setup_render(2400, 1260, samples=256)
    setup_hdri_with_dark_bg(HDRI_PATH, hdri_strength=0.7)
    add_ground_plane()

    ss_base = f"{BASE}/assets/screenshots/{product_id}"
    feat2_img = f"{ss_base}-feat2.png"

    mb = build_macbook_pro(feat2_img, open_angle=110)
    mb.rotation_euler = (0, 0, math.radians(15))

    add_accent_light(accent_color, location=(-1.5, 2, 1.5), energy=35, size=1.2)

    setup_camera_detail(target_loc=(0.2, 0.3, 0.5))

    out_dir = f"{BASE}/businesses/{product_id}/images"
    render_to(f"{out_dir}/feature-2.jpg")

# ─── DOWNSCALE ────────────────────────────────────────────────────────

def downscale_images(product_id):
    """Downscale 2400×1260 renders to 1200×630 for crisp AA"""
    out_dir = f"{BASE}/businesses/{product_id}/images"
    for fname in ["preview.jpg", "feature-1.jpg", "feature-2.jpg"]:
        fpath = os.path.join(out_dir, fname)
        if os.path.exists(fpath):
            # Use Blender's compositor or PIL isn't available, so use sips
            os.system(f'sips -z 630 1200 "{fpath}" --out "{fpath}" 2>/dev/null')

# ─── MAIN ─────────────────────────────────────────────────────────────

def main():
    # Parse args after --
    argv = sys.argv
    product_filter = None
    if "--" in argv:
        args = argv[argv.index("--") + 1:]
        for i, a in enumerate(args):
            if a == "--product" and i + 1 < len(args):
                product_filter = args[i + 1]

    targets = PRODUCTS
    if product_filter:
        targets = [p for p in PRODUCTS if p["id"] == product_filter]
        if not targets:
            print(f"ERROR: Unknown product {product_filter}")
            sys.exit(1)

    for p in targets:
        pid = p["id"]
        accent = p["accent"]
        print(f"\n{'='*60}")
        print(f"  RENDERING: {p['name']} ({pid})")
        print(f"{'='*60}")

        render_preview(pid, accent)
        render_feature1(pid, accent)
        render_feature2(pid, accent)
        downscale_images(pid)

        print(f"  ✓ {p['name']} complete")

    print("\n\n✅ ALL_RENDERS_COMPLETE")

if __name__ == "__main__":
    main()
