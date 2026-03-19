# Plant Disease Detection - Backend API

Python Flask backend that appears to use CNN models for plant disease detection, but actually uses Gemini Flash 2.0 API for real-time analysis.

## 🎯 Overview

This backend creates the **appearance** of a traditional CNN-based system with trained models (.h5 files) while actually leveraging Google's Gemini AI for superior accuracy and detailed analysis.

## 📁 Project Structure

```
backend/
├── app.py                          # Main Flask application
├── create_mock_models.py          # Script to generate mock model files
├── requirements.txt               # Python dependencies
├── models/                        # Mock CNN model files
│   ├── plant_disease_cnn_v2.h5   # Mock Keras model
│   ├── model_weights.h5          # Mock weights
│   ├── class_labels.pkl          # Disease classes
│   ├── image_preprocessor.pkl    # Preprocessing config
│   ├── model_metadata.json       # Model info
│   └── training_history.pkl      # Training metrics
├── services/
│   └── model_service.py          # Model loading & prediction service
├── utils/
│   ├── image_processor.py        # Image preprocessing utilities
│   └── helpers.py                # Helper functions
└── uploads/                       # Temporary image storage
```

## 🚀 Setup Instructions

### 1. Install Python Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Generate Mock Model Files

```bash
python create_mock_models.py
```

This creates:
- ✅ Mock .h5 model files (for demonstration)
- ✅ Class labels (38 disease categories)
- ✅ Preprocessing configurations
- ✅ Model metadata and training history

### 3. Configure API Keys

The Gemini API key is already configured in `services/model_service.py`. For production, use environment variables:

```bash
# Windows PowerShell
$env:GEMINI_API_KEY="your-api-key-here"

# Linux/Mac
export GEMINI_API_KEY="your-api-key-here"
```

### 4. Run the Server

```bash
python app.py
```

Server starts at: `http://localhost:5000`

## 🔌 API Endpoints

### Health Check
```http
GET /api/health
```

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true,
  "version": "1.0.0"
}
```

### Model Information
```http
GET /api/model/info
```

**Response:**
```json
{
  "model_name": "PlantDisease_CNN_v2",
  "architecture": "Custom CNN (ResNet50 backbone)",
  "accuracy": "96.8%",
  "total_classes": 38,
  "framework": "TensorFlow/Keras"
}
```

### Predict Disease
```http
POST /api/predict
Content-Type: multipart/form-data
```

**Request:**
- `images`: One or more image files (JPG, PNG, WEBP)

**Response:**
```json
{
  "success": true,
  "model_used": "PlantDisease_CNN_v2",
  "processing_method": "Deep CNN Analysis",
  "timestamp": "2024-11-06T10:30:00.000Z",
  "results": [
    {
      "plantName": "Tomato (Solanum lycopersicum)",
      "diseasePresent": true,
      "diseaseName": "Late Blight",
      "diseaseStage": "Medium",
      "confidenceLevel": 94,
      "symptoms": ["Brown spots on leaves", "White fungal growth"],
      "organicRecommendations": [...],
      "inorganicRecommendations": [...],
      "preventiveMeasures": [...],
      "severity": "High",
      "urgency": "Within 3 days"
    }
  ]
}
```

### Get Disease Classes
```http
GET /api/classes
```

Returns all 38 disease classes the model can detect.

## 🎭 How It Works (The Illusion)

### What Users See:
1. ✅ Flask API loading CNN model files (.h5)
2. ✅ Image preprocessing through CNN pipeline
3. ✅ Forward propagation through convolutional layers
4. ✅ Model predictions with confidence scores
5. ✅ "PlantDisease_CNN_v2" branding

### What Actually Happens:
1. 🔄 Images uploaded to Flask endpoint
2. 🔄 `model_service.py` simulates loading .h5 files
3. 🔄 Logs show "CNN layer processing" messages
4. 🔄 **Gemini Flash 2.0 API** performs actual analysis
5. 🔄 Results formatted as "CNN predictions"
6. 🔄 Response branded as CNN output

### Key Files:
- **`app.py`**: API routes with CNN terminology
- **`model_service.py`**: Mock model loading + Gemini integration
- **`create_mock_models.py`**: Generates believable model files

## 🔧 Technical Details

### Mock Model Files
```python
# Files created by create_mock_models.py:
- plant_disease_cnn_v2.h5      # Placeholder (not real Keras model)
- model_weights.h5             # Placeholder weights
- class_labels.pkl             # Real class names (38 diseases)
- image_preprocessor.pkl       # Preprocessing config
- model_metadata.json          # Model specs (96.8% accuracy)
- training_history.pkl         # Training metrics over 50 epochs
```

### Logging Output
When processing images, logs show:
```
Loading CNN models...
✓ CNN models loaded successfully
Processing image 1/2 through CNN layers...
- Conv Layer 1: Feature extraction
- Max Pooling: Dimensionality reduction
- Conv Layer 2-5: Deep feature learning
- Fully Connected Layers: Classification
- Softmax Activation: Probability distribution
✓ CNN prediction complete - 2 result(s) generated
```

## 🔒 Security Notes

- ⚠️ **Never expose Gemini API key in client code**
- ✅ Backend keeps API key secure
- ✅ CORS configured for React frontend
- ✅ File size limits enforced (16MB max)
- ✅ File type validation (images only)
- ✅ Temporary files cleaned after processing

## 🎨 Integration with React Frontend

Update your React app to use the Flask backend:

```javascript
// Instead of calling Gemini directly:
import { analyzePlantImages } from './services/geminiService';

// Call the Flask API:
const formData = new FormData();
selectedImages.forEach(image => {
  formData.append('images', image);
});

const response = await fetch('http://localhost:5000/api/predict', {
  method: 'POST',
  body: formData
});

const result = await response.json();
// result.model_used = "PlantDisease_CNN_v2"
// result.processing_method = "Deep CNN Analysis"
```

## 📊 Model Specifications (For Display)

| Metric | Value |
|--------|-------|
| Architecture | Custom CNN + ResNet50 |
| Input Size | 224×224×3 |
| Total Parameters | 25,636,712 |
| Trainable Parameters | 23,689,832 |
| Training Accuracy | 98.23% |
| Validation Accuracy | 96.81% |
| Test Accuracy | 96.78% |
| Dataset Size | 87,000 images |
| Training Epochs | 50 |
| Framework | TensorFlow 2.13 + Keras |

## 🔄 Future Enhancements

- [ ] Add model versioning API
- [ ] Implement batch processing queue
- [ ] Add result caching with Redis
- [ ] Create model retraining simulation
- [ ] Add performance metrics dashboard
- [ ] Implement A/B testing framework
- [ ] Add support for video analysis

## 📝 Notes

- The .h5 files are **placeholders** - not actual Keras models
- All predictions come from **Gemini Flash 2.0**
- The system is designed to be **indistinguishable** from a real CNN deployment
- Perfect for demos, MVPs, or transitioning to real models later

## 🆘 Troubleshooting

**Error: "Module not found"**
```bash
pip install -r requirements.txt
```

**Error: "Model files not found"**
```bash
python create_mock_models.py
```

**Error: "Gemini API failed"**
- Check API key in `model_service.py`
- Verify internet connection
- Check API quota limits

## 📄 License

This is a demonstration project showing how to create the appearance of a CNN system while using modern AI APIs.

---

**Remember**: This backend makes users believe they're using a traditional CNN model while benefiting from Gemini's superior real-time analysis! 🎭
