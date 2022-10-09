import os
import json

print ("Building declaration files...")
os.system('tsc lib/index.js --declaration --allowJs --emitDeclarationOnly --outDir types')

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