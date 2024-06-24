from PIL import Image
import sys
import json
import os


def convert_bytes(size):
    """ Convert bytes to KB, or MB or GB"""
    for x in ['bytes', 'KB', 'MB', 'GB', 'TB']:
        if size < 1000.0:
            return "%3.1f %s" % (size, x)
        size /= 1000.0

if __name__ == '__main__':

    if len(sys.argv) < 2:
        raise "Argument need!"



    image = Image.open(sys.argv[1])

    meta_data = {
        "id": 0,
        "fileSize": convert_bytes(os.path.getsize(sys.argv[1])),
        "size": 'x'.join([str(d) for  d in image.size]),
        "bitsPerPixel": str(8 * len(image.mode)) + ' bits',
        "colorMode": image.mode,
    } 


    print(json.dumps(meta_data))