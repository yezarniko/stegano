import os
import time
from PIL import Image
import hashlib
import numpy as np
import json
import sys
from pathlib import Path
from magic import from_file
from getImageMetaData import convert_bytes 

if len(sys.argv) < 3:
    raise "Need stegano file and secret password"

img_path = sys.argv[1]
input_password = sys.argv[2]

output = {
    "id": 2,
    "decryptedFile": '',
    "passwordMatch": False,
}

stegano = Image.open(img_path)
img_pixels = list(stegano.getdata())
password = []

# extract password
for pixel in img_pixels[:40]:
    R, G, B = pixel
    R = bin(R)[2:].zfill(8)
    G = bin(G)[2:].zfill(8)
    B = bin(B)[2:].zfill(8)

    oneByte = R[-3:] + G[-3:] + B[-2:]
    c = chr(eval(f"0b{oneByte}"))
    password.append(c)


if "".join(password) == hashlib.sha1(input_password.encode('utf-8')).hexdigest():

    output['passwordMatch'] = True

    R, G, B = img_pixels[40]
    R = bin(R)[2:].zfill(8)
    G = bin(G)[2:].zfill(8)
    B = bin(B)[2:].zfill(8)
    oneByte = R[-3:] + G[-3:] + B[-2:]
    file_name_length = eval(f"0b{oneByte}")

    data_length_bin_list = []
    for index, pixel in enumerate(img_pixels[41:45]):
        R, G, B = pixel
        R = bin(R)[2:].zfill(8)
        G = bin(G)[2:].zfill(8)
        B = bin(B)[2:].zfill(8)
        oneByte = R[-3:] + G[-3:] + B[-2:]
        data_length_bin_list.append(oneByte)

    data_length = eval("0b" + "".join(data_length_bin_list))

    file_name_bin_list = []
    for index, pixel in enumerate(img_pixels[45:45+file_name_length]):
        R, G, B = pixel
        R = bin(R)[2:].zfill(8)
        G = bin(G)[2:].zfill(8)
        B = bin(B)[2:].zfill(8)
        oneByte = R[-3:] + G[-3:] + B[-2:]
        file_name_bin_list.append(oneByte)

    file_name = "".join([chr(eval(f"0b{b}")) for b in file_name_bin_list])
    if not (Path.exists(Path(os.getcwd(), "cache"))):
        os.mkdir(Path(os.getcwd(), "cache"))
    file_name = Path(os.getcwd(), "cache", file_name)

    data_in_bin = []
    for index, pixel in enumerate(img_pixels[45 + file_name_length: 45 + file_name_length + data_length ]):
        R, G, B = pixel
        R = bin(R)[2:].zfill(8)
        G = bin(G)[2:].zfill(8)
        B = bin(B)[2:].zfill(8)
        oneByte = R[-3:] + G[-3:] + B[-2:]
        data_in_bin.append(eval(f"0b{oneByte}"))

    binary_data = bytearray(data_in_bin)

    with open(file_name, "wb") as file:
        file.write(binary_data)
    
    output['decryptedFile'] = str(file_name)
    output['filename'] = str(os.path.basename(file_name))
    output['filetype'] = from_file(file_name)
    output['filesize'] = convert_bytes(os.path.getsize(file_name))
    output['modifiedDate'] = time.ctime(os.path.getmtime(file_name))
    

else:
    output['passwordMatch'] = False


print(json.dumps(
    output
))