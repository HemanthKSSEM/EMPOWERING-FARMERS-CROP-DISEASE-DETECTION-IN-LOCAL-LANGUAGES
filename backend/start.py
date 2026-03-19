"""
Quick Start Script for Plant Disease Detection Backend

This script sets up the backend environment and starts the server.
"""

import os
import sys
import subprocess

def check_python_version():
    """Check if Python version is compatible"""
    version = sys.version_info
    if version.major < 3 or (version.major == 3 and version.minor < 8):
        print("❌ Python 3.8 or higher is required")
        print(f"   Current version: {version.major}.{version.minor}.{version.micro}")
        sys.exit(1)
    print(f"✓ Python {version.major}.{version.minor}.{version.micro} detected")

def install_dependencies():
    """Install required Python packages"""
    print("\n📦 Installing dependencies...")
    try:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
        print("✓ Dependencies installed successfully")
    except subprocess.CalledProcessError:
        print("❌ Failed to install dependencies")
        sys.exit(1)

def create_model_files():
    """Generate mock CNN model files"""
    print("\n🤖 Creating mock CNN model files...")
    try:
        subprocess.check_call([sys.executable, "create_mock_models.py"])
        print("✓ Model files created successfully")
    except subprocess.CalledProcessError:
        print("❌ Failed to create model files")
        sys.exit(1)

def check_directories():
    """Ensure required directories exist"""
    print("\n📁 Checking directories...")
    directories = ['uploads', 'models']
    for directory in directories:
        if not os.path.exists(directory):
            os.makedirs(directory)
            print(f"✓ Created {directory}/ directory")
        else:
            print(f"✓ {directory}/ directory exists")

def start_server():
    """Start the Flask development server"""
    print("\n🚀 Starting Flask server...")
    print("=" * 60)
    print("Server will start at: http://localhost:5000")
    print("Press Ctrl+C to stop the server")
    print("=" * 60)
    
    try:
        subprocess.check_call([sys.executable, "app.py"])
    except KeyboardInterrupt:
        print("\n\n✓ Server stopped")
    except subprocess.CalledProcessError:
        print("❌ Failed to start server")
        sys.exit(1)

def main():
    """Main setup and start function"""
    print("=" * 60)
    print("🌱 Plant Disease Detection Backend - Quick Start")
    print("=" * 60)
    
    # Step 1: Check Python version
    check_python_version()
    
    # Step 2: Check directories
    check_directories()
    
    # Step 3: Install dependencies
    response = input("\nInstall/update dependencies? (y/n): ").lower()
    if response == 'y':
        install_dependencies()
    
    # Step 4: Create model files
    if not os.path.exists('models/plant_disease_cnn_v2.h5'):
        create_model_files()
    else:
        response = input("\nModel files exist. Recreate? (y/n): ").lower()
        if response == 'y':
            create_model_files()
    
    # Step 5: Start server
    print("\n" + "=" * 60)
    start_server()

if __name__ == '__main__':
    main()
