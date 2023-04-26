import os
all_links = []


def add_header(file_path, title):
    with open(file_path, 'r') as infile: data = infile.read()
    with open(file_path, 'w') as outfile: outfile.write('![Shaku JS](resources/logo-sm.png)\n\n[Back To Table of Content](index.md)\n\n# ' + title + '\n\n' + data)


def process_files(root, files):

    if 'node_modules' in root:
        return

    for filename in files:

        if not filename.lower().endswith('.js'):
            continue

        if 'index.js' in filename.lower():
            continue

        file_path = os.path.join(root, filename)
        doc_file_name = file_path[len('src_'):].replace('//', '_').replace('\\', '_').replace(' ', '_')[:-3] + '.md'

        all_links.append(doc_file_name)

        doc_file_path = 'docs\\' + doc_file_name

        print ("Build doc for: " + file_path)
        os.system('jsdoc2md -f ' + file_path + ' > ' + doc_file_path)

        add_header(doc_file_path, filename[:-3].replace('_', ' ').title())


print ("Build whole API doc file..")
os.system('jsdoc2md -f dist\\shaku.js > docs\\shaku_full.md')
add_header('docs\\shaku_full.md', 'Shaku')


for root, subdirs, files in os.walk('src'):
    process_files(root, files)


api_docs_index_template = '''
![Shaku JS](resources/logo-sm.png)

# API Docs

The following are *Shaku*'s API docs, generated from code using `jsdoc2md`.

You can view the entire docs as a single file [here](shaku_full.md), or by topic below.

## By Topic 

__links_list__
'''

links_text = ""
all_links.sort()
for link in all_links:
    links_text += '* [' + link[:-3].replace('_', ': ', 1).replace('_', ' ').title() + '](' + link + ')\n'

with open('docs\\index.md', 'w') as outfile: 
    outfile.write(api_docs_index_template.replace('__links_list__', links_text))
