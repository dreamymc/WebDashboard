from PIL import Image

def remove_white(image_path, output_path, tolerance=30):
    img = Image.open(image_path).convert("RGBA")
    data = img.getdata()
    
    new_data = []
    for item in data:
        # Distance from pure white
        # item is (R, G, B, A)
        dist = ((255 - item[0])**2 + (255 - item[1])**2 + (255 - item[2])**2)**0.5
        
        if dist < tolerance:
            # Scale alpha based on distance for smooth edges
            # If dist = 0 (pure white), alpha = 0
            # If dist = tolerance, alpha = 255
            alpha = int((dist / tolerance) * 255)
            new_data.append((item[0], item[1], item[2], alpha))
        else:
            new_data.append(item)
            
    img.putdata(new_data)
    img.save(output_path, "PNG")

remove_white("public/t7-logo.png", "public/t7-logo.png", tolerance=60)
print("Done")
