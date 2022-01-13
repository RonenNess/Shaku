import os

shaku_template = """
 * @package    Shaku
 * @file       __file__
 * @author     Ronen Ness (ronenness@gmail.com | http://ronenness.com)
 * @copyright  (c) 2021 Ronen Ness
 * @license    MIT
"""


def replaceTextBetween(originalText, delimeterA, delimterB, replacementText):
    leadingText = originalText.split(delimeterA)[0]
    trailingText = originalText.split(delimterB)[1]

    return leadingText + delimeterA + replacementText + delimterB + trailingText

def process_files(root, files, template):

    if 'node_modules' in root:
        return

    for filename in files:

        if not filename.lower().endswith('.js'):
            continue

        file_path = os.path.join(root, filename)
        content = open(file_path, 'r').read()
        print(file_path)

        if "'use strict';" not in content:
            raise Exception("MISSING STRICT MODE FROM FILE!")

        if '* |-- copyright and license --|' in content:

            to_push = template.replace('__file__', os.path.join('shaku', file_path))
            content = replaceTextBetween(content, ' * |-- copyright and license --|', ' * |-- end copyright and license --|', to_push)

            open(file_path, 'w').write(content)
    
        else:
            missing.append(file_path)


missing = []

for root, subdirs, files in os.walk('lib'):
    process_files(root, files, shaku_template)

print ("Files without license header: ")
print (missing)