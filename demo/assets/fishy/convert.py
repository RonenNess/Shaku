import base64
import sys

infile = sys.argv[1]
indata = open(infile, 'r').read()
indata = indata.split(';base64,')[1].split('","remote')[0]

print(indata[:10])

fileData = base64.decodebytes(indata.encode("ascii"))

with open('_' + infile, 'wb') as outfile:
    outfile.write(fileData)