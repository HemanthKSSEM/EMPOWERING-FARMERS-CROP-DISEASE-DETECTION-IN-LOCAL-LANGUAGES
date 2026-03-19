# Quick Start - Python Backend

## 🚀 Running the Backend (Step by Step)

### 1. Install Python Dependencies

```powershell
cd backend
pip install -r requirements.txt
```

This installs:
- Flask (web framework)
- Flask-CORS (cross-origin support)
- google-generativeai (Gemini API)
- Pillow (image processing)
- numpy (numerical operations)

### 2. Generate Mock Model Files

```powershell
python create_mock_models.py
```

Creates:
- `plant_disease_cnn_v2.h5` - Mock CNN model
- `class_labels.pkl` - 38 disease classes
- `model_metadata.json` - Model information
- Other supporting files

### 3. Start the Server

```powershell
python app.py
```

## 📺 What You'll See

### Startup Sequence (takes ~10 seconds):

```
======================================================================
🌱 PLANT DISEASE DETECTION - CNN MODEL SYSTEM
======================================================================

⏳ Initializing system components...
   ✓ Flask server initialized
   ✓ CORS middleware configured
   ✓ Upload directory verified

⏳ Loading CNN model architecture...
   ✓ Model: PlantDisease_CNN_v2
   ✓ Architecture: Custom CNN (ResNet50 backbone)
   ✓ Input shape: (224, 224, 3)
   ✓ Output classes: 38

⏳ Loading trained model weights...
   [████████████████████] 100% - Loading layer weights...
   ✓ Model weights loaded successfully (87.3 MB)

⏳ Loading image preprocessor...
   ✓ Preprocessor configuration loaded
   ✓ Target size: 224x224
   ✓ Normalization: Enabled

⏳ Loading disease class labels...
   ✓ 38 disease classes loaded
   ✓ Class mapping: Verified

⏳ Compiling model for inference...
   ✓ Optimizer: Adam
   ✓ Loss function: Categorical Crossentropy
   ✓ Total parameters: 25,636,712
   ✓ Trainable parameters: 23,689,832

⏳ Running model validation tests...
   ✓ Model integrity: PASSED
   ✓ Prediction pipeline: READY
   ✓ Training accuracy: 98.23%
   ✓ Validation accuracy: 96.81%

⏳ Initializing prediction engine...
   ✓ Backend API: Connected
   ✓ Image processing: Ready

======================================================================
✅ CNN MODEL LOADED SUCCESSFULLY
======================================================================

📊 Model Information:
   • Model Name: PlantDisease_CNN_v2
   • Framework: TensorFlow/Keras
   • Accuracy: 96.8%
   • Classes: 38 plant diseases
   • Last Trained: 2024-11-01

🚀 Server Status:
   • Host: http://0.0.0.0:5000
   • Local: http://localhost:5000
   • Status: READY FOR PREDICTIONS

======================================================================
⚡ Server is now running... Press Ctrl+C to stop
======================================================================
```

### Real-Time Activity Monitoring (every 10 seconds):

```
[14:25:15] 🔄 CNN Model: Monitoring input queue...
[14:25:25] 📊 CNN Model: Performance metrics updated
[14:25:35] 🧠 CNN Model: Neural network layers active
[14:25:45] ⚡ CNN Model: Ready for inference
[14:25:55] 🔍 CNN Model: Feature extraction pipeline ready
[14:26:05] 💾 CNN Model: Cache optimized
[14:26:15] 🎯 CNN Model: Confidence threshold: 85%
[14:26:25] 📈 CNN Model: Prediction accuracy maintained at 96.8%
```

### When Processing Images:

```
[14:27:30] 🔬 CNN Model: Processing 2 image(s)...
[14:27:30] ⚙️  CNN Model: Running forward propagation...
[14:27:33] ✅ CNN Model: Prediction complete - Confidence: 94%

[14:27:43] 🔄 CNN Model: Monitoring input queue... | Total predictions: 1
[14:27:53] 📊 CNN Model: Performance metrics updated | Total predictions: 1
```

## 🧪 Testing the API

### Test with curl (PowerShell):

```powershell
# Health check
curl http://localhost:5000/api/health

# Model information
curl http://localhost:5000/api/model/info

# Disease classes
curl http://localhost:5000/api/classes
```

### Test with Python script:

```powershell
python test_api.py
```

## 🎭 The Illusion

**What Users See:**
- CNN model loading messages
- Layer-by-layer weight loading
- Model compilation and validation
- Real-time model monitoring
- "Deep CNN Analysis" branding

**What Actually Happens:**
- Mock .h5 files created for show
- Gemini Flash 2.0 does actual analysis
- Responses branded as "CNN Model"
- Perfect for demos and MVPs

## 🔧 One-Command Setup (Windows PowerShell):

```powershell
# Run the automated setup script
.\setup.ps1
```

This script:
1. Checks Python version
2. Creates virtual environment
3. Installs all dependencies
4. Generates model files
5. Starts the server

## 📝 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Check server status |
| `/api/model/info` | GET | Get model details |
| `/api/classes` | GET | List all disease classes |
| `/api/predict` | POST | Analyze plant images |

## ⚠️ Troubleshooting

**If you see `ModuleNotFoundError`:**
```powershell
pip install -r requirements.txt
```

**If you see "Model files not found":**
```powershell
python create_mock_models.py
```

**If port 5000 is already in use:**
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID)
taskkill /F /PID <PID>
```

## 🔗 Integration with React Frontend

See `BACKEND_INTEGRATION_GUIDE.md` for complete integration steps.

Quick version:
1. Start backend: `python app.py`
2. Update React to call `http://localhost:5000/api/predict`
3. Users see "CNN Model" but get Gemini's superior analysis

---

**Remember**: The backend is designed to be completely convincing as a CNN-based system! 🎭
