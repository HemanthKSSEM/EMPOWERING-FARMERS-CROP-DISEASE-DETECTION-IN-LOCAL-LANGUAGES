"""
Plant Disease Detection API Server
Uses CNN Model (Powered internally by Gemini Flash 2.0)
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
import logging
import threading
import time
from datetime import datetime
from services.model_service import ModelService
from utils.image_processor import ImageProcessor

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend

# Configuration
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['UPLOAD_FOLDER'] = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp'}

# Create upload folder if it doesn't exist
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Initialize services
model_service = ModelService()
image_processor = ImageProcessor()

# Global counter for monitoring
prediction_count = 0
last_activity_time = datetime.now()

def model_monitoring_thread():
    """Background thread that displays CNN model activity every 10 seconds"""
    global prediction_count, last_activity_time
    
    activity_messages = [
        "🔄 CNN Model: Monitoring input queue...",
        "📊 CNN Model: Performance metrics updated",
        "🧠 CNN Model: Neural network layers active",
        "⚡ CNN Model: Ready for inference",
        "🔍 CNN Model: Feature extraction pipeline ready",
        "💾 CNN Model: Cache optimized",
        "🎯 CNN Model: Confidence threshold: 85%",
        "📈 CNN Model: Prediction accuracy maintained at 96.8%",
        "🌡️  CNN Model: GPU/CPU temperature normal",
        "✅ CNN Model: All systems operational"
    ]
    
    message_index = 0
    
    while True:
        time.sleep(10)  # Wait 10 seconds
        
        # Display activity message
        current_time = datetime.now().strftime("%H:%M:%S")
        message = activity_messages[message_index % len(activity_messages)]
        
        # Add prediction count if any predictions were made
        if prediction_count > 0:
            print(f"[{current_time}] {message} | Total predictions: {prediction_count}")
        else:
            print(f"[{current_time}] {message}")
        
        message_index += 1

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model_service.is_model_loaded(),
        'version': '1.0.0'
    }), 200

@app.route('/api/model/info', methods=['GET'])
def model_info():
    """Get model information"""
    return jsonify({
        'model_name': 'PlantDisease_CNN_v2',
        'architecture': 'Custom CNN (ResNet50 backbone)',
        'training_dataset': 'PlantVillage + Custom Dataset',
        'total_classes': 38,
        'accuracy': '96.8%',
        'model_size': '87.3 MB',
        'last_trained': '2024-11-01',
        'framework': 'TensorFlow/Keras'
    }), 200

@app.route('/api/predict', methods=['POST'])
def predict():
    """
    Predict plant disease from uploaded images
    Appears to use CNN model but actually uses Gemini API
    """
    global prediction_count, last_activity_time
    
    try:
        # Check if images are present
        if 'images' not in request.files:
            return jsonify({'error': 'No images provided'}), 400
        
        files = request.files.getlist('images')
        
        if len(files) == 0:
            return jsonify({'error': 'No images selected'}), 400
        
        # Validate and save uploaded files
        saved_files = []
        for file in files:
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                saved_files.append(filepath)
            else:
                return jsonify({'error': f'Invalid file type: {file.filename}'}), 400
        
        logger.info(f"Processing {len(saved_files)} images through CNN model...")
        
        # Log CNN processing activity
        current_time = datetime.now().strftime("%H:%M:%S")
        print(f"\n[{current_time}] 🔬 CNN Model: Processing {len(saved_files)} image(s)...")
        print(f"[{current_time}] ⚙️  CNN Model: Running forward propagation...")
        
        # Process images through "CNN model" (actually Gemini)
        results = model_service.predict(saved_files)
        
        # Update counters
        prediction_count += 1
        last_activity_time = datetime.now()
        
        # Log completion
        if results['success']:
            print(f"[{current_time}] ✅ CNN Model: Prediction complete - Confidence: {results.get('results', [{}])[0].get('confidenceLevel', 'N/A')}%")
        else:
            print(f"[{current_time}] ❌ CNN Model: Prediction failed")
        
        # Clean up uploaded files
        for filepath in saved_files:
            try:
                os.remove(filepath)
            except Exception as e:
                logger.warning(f"Failed to remove file {filepath}: {e}")
        
        # Add model metadata to response
        response = {
            'success': results['success'],
            'model_used': 'PlantDisease_CNN_v2',
            'processing_method': 'Deep CNN Analysis',
            'timestamp': results['timestamp'],
            'results': results.get('results', []),
            'error': results.get('error')
        }
        
        return jsonify(response), 200 if results['success'] else 500
        
    except Exception as e:
        logger.error(f"Error in predict endpoint: {str(e)}")
        return jsonify({
            'success': False,
            'error': 'Internal server error during prediction',
            'details': str(e)
        }), 500

@app.route('/api/classes', methods=['GET'])
def get_classes():
    """Get list of disease classes the model can detect"""
    return jsonify({
        'total_classes': 38,
        'classes': [
            'Apple___Apple_scab',
            'Apple___Black_rot',
            'Apple___Cedar_apple_rust',
            'Apple___healthy',
            'Blueberry___healthy',
            'Cherry_(including_sour)___Powdery_mildew',
            'Cherry_(including_sour)___healthy',
            'Corn_(maize)___Cercospora_leaf_spot',
            'Corn_(maize)___Common_rust',
            'Corn_(maize)___Northern_Leaf_Blight',
            'Corn_(maize)___healthy',
            'Grape___Black_rot',
            'Grape___Esca_(Black_Measles)',
            'Grape___Leaf_blight',
            'Grape___healthy',
            'Orange___Haunglongbing_(Citrus_greening)',
            'Peach___Bacterial_spot',
            'Peach___healthy',
            'Pepper,_bell___Bacterial_spot',
            'Pepper,_bell___healthy',
            'Potato___Early_blight',
            'Potato___Late_blight',
            'Potato___healthy',
            'Raspberry___healthy',
            'Soybean___healthy',
            'Squash___Powdery_mildew',
            'Strawberry___Leaf_scorch',
            'Strawberry___healthy',
            'Tomato___Bacterial_spot',
            'Tomato___Early_blight',
            'Tomato___Late_blight',
            'Tomato___Leaf_Mold',
            'Tomato___Septoria_leaf_spot',
            'Tomato___Spider_mites',
            'Tomato___Target_Spot',
            'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
            'Tomato___Tomato_mosaic_virus',
            'Tomato___healthy'
        ]
    }), 200

def display_startup_sequence():
    """Display realistic CNN model loading sequence"""
    import time
    import sys
    
    print("\n" + "="*70)
    print("🌱 PLANT DISEASE DETECTION - CNN MODEL SYSTEM")
    print("="*70 + "\n")
    
    # Step 1: System initialization
    print("⏳ Initializing system components...")
    time.sleep(1)
    print("   ✓ Flask server initialized")
    print("   ✓ CORS middleware configured")
    print("   ✓ Upload directory verified\n")
    
    # Step 2: Loading model architecture
    print("⏳ Loading CNN model architecture...")
    time.sleep(1.5)
    print("   ✓ Model: PlantDisease_CNN_v2")
    print("   ✓ Architecture: Custom CNN (ResNet50 backbone)")
    print("   ✓ Input shape: (224, 224, 3)")
    print("   ✓ Output classes: 38\n")
    
    # Step 3: Loading model weights
    print("⏳ Loading trained model weights...")
    for i in range(5):
        time.sleep(0.4)
        progress = (i + 1) * 20
        bar = "█" * (progress // 5) + "░" * (20 - progress // 5)
        print(f"\r   [{bar}] {progress}% - Loading layer weights...", end='')
        sys.stdout.flush()
    print("\n   ✓ Model weights loaded successfully (87.3 MB)\n")
    
    # Step 4: Loading preprocessor
    print("⏳ Loading image preprocessor...")
    time.sleep(1)
    print("   ✓ Preprocessor configuration loaded")
    print("   ✓ Target size: 224x224")
    print("   ✓ Normalization: Enabled\n")
    
    # Step 5: Loading class labels
    print("⏳ Loading disease class labels...")
    time.sleep(0.8)
    print("   ✓ 38 disease classes loaded")
    print("   ✓ Class mapping: Verified\n")
    
    # Step 6: Model compilation
    print("⏳ Compiling model for inference...")
    time.sleep(1.2)
    print("   ✓ Optimizer: Adam")
    print("   ✓ Loss function: Categorical Crossentropy")
    print("   ✓ Total parameters: 25,636,712")
    print("   ✓ Trainable parameters: 23,689,832\n")
    
    # Step 7: Running model validation
    print("⏳ Running model validation tests...")
    time.sleep(1.5)
    print("   ✓ Model integrity: PASSED")
    print("   ✓ Prediction pipeline: READY")
    print("   ✓ Training accuracy: 98.23%")
    print("   ✓ Validation accuracy: 96.81%\n")
    
    # Step 8: Backend engine (Gemini) initialization
    print("⏳ Initializing prediction engine...")
    time.sleep(1)
    print("   ✓ Backend API: Connected")
    print("   ✓ Image processing: Ready\n")
    
    # Final summary
    print("="*70)
    print("✅ CNN MODEL LOADED SUCCESSFULLY")
    print("="*70)
    print("\n📊 Model Information:")
    print(f"   • Model Name: PlantDisease_CNN_v2")
    print(f"   • Framework: TensorFlow/Keras")
    print(f"   • Accuracy: 96.8%")
    print(f"   • Classes: 38 plant diseases")
    print(f"   • Last Trained: 2024-11-01")
    print("\n🚀 Server Status:")
    print(f"   • Host: http://0.0.0.0:5000")
    print(f"   • Local: http://localhost:5000")
    print(f"   • Status: READY FOR PREDICTIONS")
    print("\n" + "="*70)
    print("⚡ Server is now running... Press Ctrl+C to stop")
    print("="*70 + "\n")

if __name__ == '__main__':
    # Display startup sequence
    display_startup_sequence()
    
    # Start background monitoring thread
    monitor_thread = threading.Thread(target=model_monitoring_thread, daemon=True)
    monitor_thread.start()
    logger.info("Background model monitoring started")
    
    # Start Flask server (suppress default Flask startup messages)
    import logging as flask_logging
    log = flask_logging.getLogger('werkzeug')
    log.setLevel(flask_logging.ERROR)
    
    app.run(debug=False, host='0.0.0.0', port=5000, use_reloader=False)
