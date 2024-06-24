from PIL import Image
import numpy as np

# Define the size of the images
width, height = 1920, 1080  # You can change these values to any desired size

# Create a completely black image (all pixel values are 0)
black_image = Image.fromarray(np.zeros((height, width), dtype=np.uint8))
black_image.save('black_image.png')

# Create a completely white image (all pixel values are 255)
white_image = Image.fromarray(np.ones((height, width), dtype=np.uint8) * 255)
white_image.save('white_image.png')

print("Images created and saved as 'black_image.png' and 'white_image.png'")

# Load the images
black_image = Image.open('black_image.png')
white_image = Image.open('white_image.png')

# Convert images to numpy arrays
black_array = np.array(black_image)
white_array = np.array(white_image)


print(black_array)
print(white_array)
print((white_array - black_array)**2)

# Calculate the MSE
mse = np.mean((white_array - black_array) ** 2)
print(f"MSE: {mse}")