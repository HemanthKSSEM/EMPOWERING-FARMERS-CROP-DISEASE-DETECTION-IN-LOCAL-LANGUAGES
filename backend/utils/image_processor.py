"""
Image Processor - Utilities for image preprocessing
"""

import os
import numpy as np
from PIL import Image
import logging

logger = logging.getLogger(__name__)

class ImageProcessor:
    def __init__(self, target_size=(224, 224)):
        self.target_size = target_size
        logger.info(f"ImageProcessor initialized with target size: {target_size}")
    
    def preprocess(self, image_path):
        """
        Preprocess image for CNN model
        - Resize to target size
        - Normalize pixel values
        - Convert to numpy array
        """
        try:
            # Load image
            img = Image.open(image_path)
            
            # Convert to RGB if needed
            if img.mode != 'RGB':
                img = img.convert('RGB')
            
            # Resize to target size
            img = img.resize(self.target_size, Image.Resampling.LANCZOS)
            
            # Convert to numpy array
            img_array = np.array(img)
            
            # Normalize pixel values to [0, 1]
            img_array = img_array.astype('float32') / 255.0
            
            # Add batch dimension
            img_array = np.expand_dims(img_array, axis=0)
            
            logger.info(f"Preprocessed image shape: {img_array.shape}")
            
            return img_array
            
        except Exception as e:
            logger.error(f"Error preprocessing image {image_path}: {e}")
            raise
    
    def validate_image(self, image_path):
        """Validate if file is a valid image"""
        try:
            img = Image.open(image_path)
            img.verify()
            return True
        except Exception:
            return False
    
    def get_image_info(self, image_path):
        """Get image metadata"""
        try:
            img = Image.open(image_path)
            return {
                'format': img.format,
                'mode': img.mode,
                'size': img.size,
                'width': img.width,
                'height': img.height
            }
        except Exception as e:
            logger.error(f"Error getting image info: {e}")
            return None
