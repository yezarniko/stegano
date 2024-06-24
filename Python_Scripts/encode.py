import os
from PIL import Image
import numpy as np
import hashlib
import sys
from pathlib import Path
import json
import base64


def getRGB_binary_data(pixel):
    R, G, B = pixel
    R = list(bin(R)[2:].zfill(8))
    G = list(bin(G)[2:].zfill(8))
    B = list(bin(B)[2:].zfill(8))

    return R, G, B

def setRGBValue(byte, R, G, B):
    R[-3:] = list(byte[:3])
    G[-3:] = list(byte[3:6])
    B[-2:] = list(byte[6:])

    R = "".join(R)
    G = "".join(G)
    B = "".join(B)

    return R, G, B

if len(sys.argv) < 4:
    raise "Need image file and secret file"

# Cover Image
img_path = sys.argv[1]
cover_img = Image.open(img_path).convert("RGB")
width, height = cover_img.size
img_pixels = list(cover_img.getdata())

cover_img_length = len(img_pixels)
new_img_pixel = []

# Secret File
input_file = sys.argv[2]
file_data_in_bin = []
filename = Path(input_file).name

# Password
input_password = sys.argv[3]
password = hashlib.sha1(input_password.encode('utf-8')).hexdigest()

with open(input_file, "rb") as file:
    # file data
    data = file.read()
    data_length = len(data)

    # change binary
    for byte in data:
        file_data_in_bin.append(bin(byte)[2:].zfill(8))

length = 40 + 1 + 4 + data_length + len(filename)

# print(f"image mode: {cover_img.mode}")
# print(f"cover image length: {cover_img_length}")
# print(f"only data length: {data_length}")
# print(f"input file length: {length}")

if cover_img_length > length:

    # for password
    for index, pixel in enumerate(img_pixels[0:40]):
        R, G, B = getRGB_binary_data(pixel)
        oneByte = bin(ord(password[index]))[2:].zfill(8)
        R, G, B = setRGBValue(oneByte, R, G, B)
        Pixel = (eval(f"0b{R}"), eval(f"0b{G}"), eval(f"0b{B}"))
        new_img_pixel.append(Pixel)

    # for file name length
    R, G, B = getRGB_binary_data(img_pixels[40])
    oneByte = bin(len(filename))[2:].zfill(8)
    R, G, B = setRGBValue(oneByte, R, G, B)
    Pixel = (eval(f"0b{R}"), eval(f"0b{G}"), eval(f"0b{B}"))
    new_img_pixel.append(Pixel)

    # for data length
    data_length_bin = bin(data_length)[2:].zfill(32)
    for index, pixel in enumerate(img_pixels[41:45]):
        R, G, B = getRGB_binary_data(pixel)
        oneByte = data_length_bin[index*8:(index+1)*8]
        R, G, B = setRGBValue(oneByte, R, G, B)
        Pixel = (eval(f"0b{R}"), eval(f"0b{G}"), eval(f"0b{B}"))
        new_img_pixel.append(Pixel)

    # for filename
    input_file_name_list = [ bin(ord(c))[2:].zfill(8) for c in filename ]
    for index, pixel in enumerate(img_pixels[45:45+len(filename)]):
        R, G, B = getRGB_binary_data(pixel)
        oneByte = input_file_name_list[index]
        R, G, B = setRGBValue(oneByte, R, G, B)
        Pixel = (eval(f"0b{R}"), eval(f"0b{G}"), eval(f"0b{B}"))
        new_img_pixel.append(Pixel)

    # for data
    for index, pixel in enumerate(img_pixels[45+len(filename):45 + len(filename) + data_length]):
        R, G, B = getRGB_binary_data(pixel)

        # if len(file_data_in_bin) > index:
        oneByte = file_data_in_bin[index]
        R, G, B = setRGBValue(oneByte, R, G, B)
        # else:
        #     R = "".join(R)
        #     G = "".join(G)
        #     B = "".join(B)

        Pixel = (eval(f"0b{R}"), eval(f"0b{G}"), eval(f"0b{B}"))
        new_img_pixel.append(Pixel)

    new_img_pixel = new_img_pixel + img_pixels[45 + len(filename) + data_length:]

    stegano_img = Image.new("RGB", (width, height))
    stegano_img.putdata(new_img_pixel)

    encrypted_img = hashlib.md5(Path(img_path).name.encode('utf-8')).hexdigest() + ".png"

    stegano_img.save(encrypted_img, compress_level=9)


    # with open(encrypted_img, 'rb') as file:
    #     prefix = 'data:image/jpeg;base64,'
    #     contents = file.read()
    #     data_url = prefix + base64.b64encode(contents).decode('utf-8')


    response = {
        "id": 1,
        "encryptedImgPath": str(Path(os.getcwd(), encrypted_img)),
    }

    # print(np.asarray(stegano_img))
    print(json.dumps(response))

else:
    print("File is bigger than cover image")