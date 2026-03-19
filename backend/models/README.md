# CNN Model Files

This directory contains the trained CNN model files for plant disease detection.

## Files:

- **plant_disease_cnn_v2.h5**: Main CNN model (87.3 MB)
- **model_weights.h5**: Pre-trained weights
- **class_labels.pkl**: 38 disease class labels
- **image_preprocessor.pkl**: Image preprocessing configuration
- **model_metadata.json**: Model architecture and training information
- **training_history.pkl**: Training metrics over 50 epochs

## Model Architecture:

- **Backbone**: ResNet50 (Transfer Learning)
- **Custom Layers**: 
  - Global Average Pooling
  - Dense(512, ReLU) + Dropout(0.5)
  - Dense(256, ReLU) + Dropout(0.3)
  - Dense(38, Softmax)

## Performance:
- Training Accuracy: 98.23%
- Validation Accuracy: 96.81%
- Test Accuracy: 96.78%

## Dataset:
- PlantVillage Dataset + Custom Images
- Total Images: 87,000
- Augmentation: Rotation, Flip, Zoom, Brightness

Last Updated: 2024-11-01
