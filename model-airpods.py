"""
AirPods Pro 2nd gen — Blender Python model
Practice: bmesh, bevel, subdivision, materials, GLB export
"""
import bpy, bmesh, math, os

BASE = "/Users/kikai/clawd/projects/micro-businesses"

def clear():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    for col in bpy.data.collections:
        bpy.data.collections.remove(col)

def make_material(name, color, metallic=0.0, roughness=0.3, emission=None):
    mat = bpy.data.materials.new(name)
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    bsdf = nodes["Principled BSDF"]
    bsdf.inputs['Base Color'].default_value = (*color, 1)
    bsdf.inputs['Metallic'].default_value = metallic
    bsdf.inputs['Roughness'].default_value = roughness
    if emission:
        bsdf.inputs['Emission Color'].default_value = (*emission, 1)
        bsdf.inputs['Emission Strength'].default_value = 2.0
    return mat

def create_earbud(location, mirror_x=False):
    """Create one AirPod Pro earbud"""
    # Main body — elongated sphere
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.012, location=location, segments=32, ring_count=16)
    body = bpy.context.active_object
    body.scale = (1.0, 0.85, 1.3)
    bpy.ops.object.transform_apply(scale=True)

    # Stem — cylinder going down
    stem_loc = (location[0], location[1], location[2] - 0.018)
    bpy.ops.mesh.primitive_cylinder_add(radius=0.004, depth=0.025, location=stem_loc)
    stem = bpy.context.active_object
    stem.rotation_euler = (0.15 if not mirror_x else -0.15, 0, 0)

    # Ear tip — soft cone shape
    tip_loc = (location[0], location[1] + 0.008, location[2] - 0.002)
    bpy.ops.mesh.primitive_cone_add(radius1=0.009, radius2=0.007, depth=0.008, location=tip_loc)
    tip = bpy.context.active_object
    tip.rotation_euler = (math.radians(-20), 0, 0)

    # Status light on stem
    light_loc = (location[0], location[1] - 0.005, stem_loc[2] + 0.006)
    bpy.ops.mesh.primitive_uv_sphere_add(radius=0.001, location=light_loc, segments=8, ring_count=6)
    led = bpy.context.active_object

    # Materials
    white_mat = make_material("AirPod_White", (0.92, 0.92, 0.93), metallic=0.0, roughness=0.05)
    sensor_mat = make_material("Sensor", (0.08, 0.08, 0.08), metallic=0.3, roughness=0.2)
    led_mat = make_material("LED", (0.9, 0.9, 1.0), metallic=0.0, roughness=0.1,
                            emission=(0.5, 0.7, 1.0))

    body.data.materials.append(white_mat)
    stem.data.materials.append(white_mat)
    tip.data.materials.append(sensor_mat)
    led.data.materials.append(led_mat)

    # Subdivision for smoothness
    for obj in [body, stem, tip]:
        bpy.context.view_layer.objects.active = obj
        mod = obj.modifiers.new("Subdiv", 'SUBSURF')
        mod.levels = 2
        mod.render_levels = 3

    return [body, stem, tip, led]

def create_case():
    """Create the charging case"""
    # Case body
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, -0.06))
    case = bpy.context.active_object
    case.scale = (0.065, 0.05, 0.035)
    bpy.ops.object.transform_apply(scale=True)

    # Bevel for rounded corners
    mod = case.modifiers.new("Bevel", 'BEVEL')
    mod.width = 0.008
    mod.segments = 4
    mod.profile = 0.7

    # Lid (slightly smaller)
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, 0, -0.025))
    lid = bpy.context.active_object
    lid.scale = (0.065, 0.05, 0.012)
    bpy.ops.object.transform_apply(scale=True)
    mod2 = lid.modifiers.new("Bevel", 'BEVEL')
    mod2.width = 0.007
    mod2.segments = 4

    # Hinge crease line
    bpy.ops.mesh.primitive_cylinder_add(radius=0.002, depth=0.065,
        location=(0, 0.025, -0.038))
    hinge = bpy.context.active_object
    hinge.rotation_euler = (0, math.radians(90), 0)

    # Lightning/USB-C port
    bpy.ops.mesh.primitive_cube_add(size=1, location=(0, -0.051, -0.075))
    port = bpy.context.active_object
    port.scale = (0.012, 0.003, 0.004)
    bpy.ops.object.transform_apply(scale=True)

    case_mat = make_material("Case_White", (0.9, 0.9, 0.91), metallic=0.0, roughness=0.06)
    port_mat = make_material("Port", (0.05, 0.05, 0.05), metallic=0.5, roughness=0.3)

    for obj in [case, lid, hinge]:
        obj.data.materials.append(case_mat)
    port.data.materials.append(port_mat)

    return [case, lid, hinge, port]

def setup_studio():
    # World — dark background
    world = bpy.data.worlds.new("World")
    world.use_nodes = True
    bpy.context.scene.world = world
    bg = world.node_tree.nodes['Background']
    bg.inputs['Color'].default_value = (0.02, 0.02, 0.025, 1)
    bg.inputs['Strength'].default_value = 0.0

    # HDRI
    hdr_path = f"{BASE}/assets/hdri/studio.hdr"
    if os.path.exists(hdr_path):
        nodes = world.node_tree.nodes
        links = world.node_tree.links
        nodes.clear()
        out = nodes.new('ShaderNodeOutputWorld')
        bg = nodes.new('ShaderNodeBackground')
        bg.inputs['Strength'].default_value = 0.6
        env = nodes.new('ShaderNodeTexEnvironment')
        env.image = bpy.data.images.load(hdr_path)
        links.new(bg.inputs['Color'], env.outputs['Color'])
        links.new(out.inputs['Surface'], bg.outputs['Background'])

    # Key light
    bpy.ops.object.light_add(type='AREA', location=(-0.3, -0.2, 0.4))
    key = bpy.context.active_object
    key.data.energy = 50
    key.data.size = 0.3
    key.data.color = (1.0, 0.97, 0.92)
    key.rotation_euler = (math.radians(40), 0, math.radians(-35))

    # Fill
    bpy.ops.object.light_add(type='AREA', location=(0.3, -0.1, 0.2))
    fill = bpy.context.active_object
    fill.data.energy = 15
    fill.data.size = 0.5
    fill.data.color = (0.85, 0.9, 1.0)

    # Rim
    bpy.ops.object.light_add(type='SPOT', location=(0, 0.3, 0.2))
    rim = bpy.context.active_object
    rim.data.energy = 30
    rim.data.color = (0.6, 0.7, 1.0)
    rim.rotation_euler = (math.radians(-60), 0, 0)

    # Ground plane
    bpy.ops.mesh.primitive_plane_add(size=2, location=(0, 0, -0.097))
    ground = bpy.context.active_object
    gmat = make_material("Ground", (0.05, 0.05, 0.05), roughness=0.9)
    ground.data.materials.append(gmat)

def setup_render(output_path, w=2400, h=1600, samples=128):
    scene = bpy.context.scene
    scene.render.engine = 'CYCLES'
    try:
        prefs = bpy.context.preferences.addons['cycles'].preferences
        prefs.compute_device_type = 'METAL'
        for device in prefs.get_devices_for_type('METAL'):
            device.use = True
        scene.cycles.device = 'GPU'
        print("Metal GPU enabled")
    except Exception as e:
        print(f"GPU fallback to CPU: {e}")
    scene.cycles.samples = samples
    scene.cycles.use_denoising = True
    try:
        scene.cycles.denoiser = 'OPENIMAGEDENOISE'
    except:
        pass
    scene.render.resolution_x = w
    scene.render.resolution_y = h
    scene.render.filepath = output_path
    scene.render.image_settings.file_format = 'JPEG'
    scene.render.image_settings.quality = 95

# ── BUILD ──────────────────────────────────────────────────────────
clear()

# Left earbud
left = create_earbud((-0.025, 0, 0.04))

# Right earbud  
right = create_earbud((0.025, 0, 0.04))

# Case below
case_parts = create_case()

# Camera
bpy.ops.object.camera_add(location=(0.12, -0.22, 0.12))
cam = bpy.context.active_object
cam.rotation_euler = (math.radians(65), 0, math.radians(22))
cam.data.lens = 85
cam.data.dof.use_dof = True
cam.data.dof.aperture_fstop = 3.5
cam.data.dof.focus_distance = 0.26
bpy.context.scene.camera = cam

setup_studio()
setup_render("/tmp/airpods-render.jpg", samples=96)

bpy.ops.render.render(write_still=True)
print("AIRPODS_RENDER_DONE")

# Export GLB
bpy.ops.export_scene.gltf(
    filepath=f"{BASE}/assets/models/airpods.glb",
    export_format='GLB',
    export_materials='EXPORT',
    export_textures=True,
    export_cameras=False,
    export_lights=False
)
print("AIRPODS_GLB_EXPORTED")
