"""
Utility functions for the backend
"""

import os
import hashlib
from datetime import datetime

def generate_file_hash(filepath):
    """Generate SHA256 hash of a file"""
    sha256_hash = hashlib.sha256()
    with open(filepath, "rb") as f:
        for byte_block in iter(lambda: f.read(4096), b""):
            sha256_hash.update(byte_block)
    return sha256_hash.hexdigest()

def get_timestamp():
    """Get current timestamp in ISO format"""
    return datetime.now().isoformat()

def format_file_size(size_bytes):
    """Convert bytes to human readable format"""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.2f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.2f} TB"

def validate_api_key(api_key):
    """Validate API key format"""
    return api_key and len(api_key) > 20

def clean_filename(filename):
    """Clean and sanitize filename"""
    import re
    # Remove any non-alphanumeric characters except dots, underscores, and hyphens
    filename = re.sub(r'[^\w\s.-]', '', filename)
    # Replace spaces with underscores
    filename = filename.replace(' ', '_')
    return filename
