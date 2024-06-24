from PIL import Image
import sys
import numpy as np
import json
from getImageMetaData import convert_bytes 


if len(sys.argv) < 3:
    raise "Not enough argument"

originalImg = Image.open(sys.argv[1])
testImg = Image.open(sys.argv[2])

with open(sys.argv[2], 'rb') as file:
    filesize = len(file.read())

# color image to grayscale  uses the ITU-R 601-2 luma transform
# formula:  L = R * 299/1000 + G * 587/1000 + B * 114/1000
originalImg_Linear = originalImg.convert('L')
testImg_Linear = testImg.convert('L')


originalImg_Pixels = np.asarray(originalImg_Linear, dtype=np.uint16)
testImg_Pixels = np.asanyarray(testImg_Linear, dtype=np.uint16)

if(originalImg_Pixels.shape == testImg_Pixels.shape):
    ############# MSE #############
    mse = 0.0
    matrix_division =   originalImg_Pixels - testImg_Pixels
    variance = (matrix_division) ** 2
    mse = np.mean(variance)

    ############# PSNR #############
    psnr = np.inf
    
    if(mse > 0):
        L = 255
        psnr = 10 * np.log10(L**2/mse)
    

    print(json.dumps({
        "id": 3,
        "filesize": convert_bytes(filesize),
        "mse": f"{mse:.4f}",
        "psnr": f"{psnr:.4f} db"
    }))