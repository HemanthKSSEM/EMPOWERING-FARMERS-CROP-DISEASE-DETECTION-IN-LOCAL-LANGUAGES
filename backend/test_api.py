"""
Test Script for Backend API Endpoints
"""

import requests
import json
import os

BASE_URL = "http://localhost:5000"

def test_health():
    """Test health check endpoint"""
    print("\n🔍 Testing Health Check Endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/health")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_model_info():
    """Test model info endpoint"""
    print("\n🔍 Testing Model Info Endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/model/info")
        print(f"Status Code: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_classes():
    """Test disease classes endpoint"""
    print("\n🔍 Testing Disease Classes Endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/api/classes")
        data = response.json()
        print(f"Status Code: {response.status_code}")
        print(f"Total Classes: {data.get('total_classes')}")
        print(f"Sample Classes: {data.get('classes', [])[:5]}")
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_predict():
    """Test prediction endpoint (requires test image)"""
    print("\n🔍 Testing Prediction Endpoint...")
    print("⚠️  This test requires a test image file")
    
    # Check for test image
    test_image_paths = [
        'test_image.jpg',
        'test_image.png',
        '../test_image.jpg'
    ]
    
    test_image = None
    for path in test_image_paths:
        if os.path.exists(path):
            test_image = path
            break
    
    if not test_image:
        print("⚠️  No test image found. Skipping prediction test.")
        print("   Place a test image as 'test_image.jpg' to test this endpoint.")
        return None
    
    try:
        with open(test_image, 'rb') as f:
            files = {'images': f}
            response = requests.post(f"{BASE_URL}/api/predict", files=files)
        
        print(f"Status Code: {response.status_code}")
        data = response.json()
        
        if data.get('success'):
            print(f"✓ Prediction successful")
            print(f"Model Used: {data.get('model_used')}")
            print(f"Processing Method: {data.get('processing_method')}")
            
            if data.get('results'):
                result = data['results'][0]
                print(f"\nResults:")
                print(f"  Plant: {result.get('plantName')}")
                print(f"  Disease: {result.get('diseaseName')}")
                print(f"  Confidence: {result.get('confidenceLevel')}%")
        else:
            print(f"❌ Prediction failed: {data.get('error')}")
        
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def main():
    """Run all tests"""
    print("=" * 60)
    print("🧪 Plant Disease Detection Backend - API Tests")
    print("=" * 60)
    print("\nMake sure the server is running at http://localhost:5000")
    print("Run: python app.py")
    
    input("\nPress Enter to start tests...")
    
    results = {
        'Health Check': test_health(),
        'Model Info': test_model_info(),
        'Disease Classes': test_classes(),
        'Prediction': test_predict()
    }
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 Test Summary")
    print("=" * 60)
    
    for test_name, result in results.items():
        if result is True:
            status = "✓ PASSED"
        elif result is False:
            status = "❌ FAILED"
        else:
            status = "⚠️  SKIPPED"
        print(f"{test_name}: {status}")
    
    passed = sum(1 for r in results.values() if r is True)
    total = len([r for r in results.values() if r is not None])
    
    print(f"\nTotal: {passed}/{total} tests passed")
    print("=" * 60)

if __name__ == '__main__':
    main()
