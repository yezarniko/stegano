from PIL import Image, ImageChops
import matplotlib.pyplot as plt
import sys

def show_images(image1_path, image2_path):
    # Load the images
    image1 = Image.open(image1_path).convert('L')
    image2 = Image.open(image2_path).convert('L')

    # Create a difference image
    diff_image = ImageChops.difference(image1, image2)

    # Display the images and the difference image
    fig, axs = plt.subplots(1, 3, figsize=(15, 5))
    axs[0].imshow(image1, cmap='gray')
    axs[0].set_title('Image 1')
    axs[0].axis('off')

    axs[1].imshow(image2, cmap='gray')
    axs[1].set_title('Image 2')
    axs[1].axis('off')

    axs[2].imshow(diff_image, cmap='gray')
    axs[2].set_title('Difference Image')
    axs[2].axis('off')

    plt.show()

# Example usage
image1_path = sys.argv[1]
image2_path = sys.argv[2]
show_images(image1_path, image2_path)
