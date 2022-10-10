import os
import json

print ("Building declaration files...")
os.system('tsc lib/index.js --declaration --allowJs --emitDeclarationOnly --declarationMap --outDir types')

###########################

print("Adding missing declarations for CSS colors...")
with open("lib/utils/color.js", "r") as f:
    contents = f.read()
    pre_color_object = "const colorNameToHex = "
    start_index = contents.index(pre_color_object) + len(pre_color_object)
    end_index = contents.index(";", start_index)
    web_colors = list(json.loads(contents[start_index:end_index]).keys())

with open("types/utils/color.d.ts", "r") as f:
    contents = f.readlines()
    insert_color_at_line = contents.index("declare namespace Color {\n") + 1

for color in web_colors:
    contents.insert(insert_color_at_line, f"\tconst {color}: Color;\n")
    insert_color_at_line += 1

with open("types/utils/color.d.ts", "w") as f:
    f.writelines(contents)

###########################

# For some reason, adding "_values" with an Object.defineProperty breaks the declarations for BlendModes
print("Adding missing declarations for BlendModes...")
with open("lib/gfx/blend_modes.js", "r") as f:
    contents = f.read()
    pre_object_definition = "const BlendModes = "
    start_index = contents.index(pre_object_definition) + len(pre_object_definition)
    end_index = contents.index(";", start_index)
    extra_properties = [x.split(":")[0].strip() for x in contents[start_index:end_index].split("\n")[1:-1]]

with open("types/gfx/blend_modes.d.ts", "r") as f:
    contents = f.readlines()
    insert_at_line = contents.index("export namespace BlendModes {\n") + 1

for prop in extra_properties:
    contents.insert(insert_at_line, f"\tconst {prop}: BlendMode;\n")
    insert_at_line += 1

with open("types/gfx/blend_modes.d.ts", "w") as f:
    f.writelines(contents)

###########################

# For some reason, adding "_values" with an Object.defineProperty breaks the declarations for TextureWrapModes
print("Adding missing declarations for TextureWrapModes...")
with open("lib/gfx/texture_wrap_modes.js", "r") as f:
    contents = f.read()
    pre_object_definition = "const TextureWrapModes = "
    start_index = contents.index(pre_object_definition) + len(pre_object_definition)
    end_index = contents.index(";", start_index)
    extra_properties = [x.split(":")[0].strip() for x in contents[start_index:end_index].split("\n")[1:-1]]

with open("types/gfx/texture_wrap_modes.d.ts", "r") as f:
    contents = f.readlines()
    insert_at_line = contents.index("export namespace TextureWrapModes {\n") + 1

for prop in extra_properties:
    contents.insert(insert_at_line, f"\tconst {prop}: TextureWrapMode;\n")
    insert_at_line += 1

with open("types/gfx/texture_wrap_modes.d.ts", "w") as f:
    f.writelines(contents)

###########################

# For some reason, adding "_values" with an Object.defineProperty breaks the declarations for TextureFilterModes
print("Adding missing declarations for TextureFilterModes...")
with open("lib/gfx/texture_filter_modes.js", "r") as f:
    contents = f.read()
    pre_object_definition = "const TextureFilterModes = "
    start_index = contents.index(pre_object_definition) + len(pre_object_definition)
    end_index = contents.index(";", start_index)
    extra_properties = [x.split(":")[0].strip() for x in contents[start_index:end_index].split("\n")[1:-1]]

with open("types/gfx/texture_filter_modes.d.ts", "r") as f:
    contents = f.readlines()
    insert_at_line = contents.index("export namespace TextureFilterModes {\n") + 1

for prop in extra_properties:
    contents.insert(insert_at_line, f"\tconst {prop}: TextureFilterMode;\n")
    insert_at_line += 1

with open("types/gfx/texture_filter_modes.d.ts", "w") as f:
    f.writelines(contents)

###########################