#\!/usr/bin/env python3
"""
Smart AI Code Review Hook
Checks file operations and suggests more efficient approaches
"""
import sys
import os
import json
from pathlib import Path

def get_file_info(file_path):
    """Get file size and line count"""
    if not os.path.exists(file_path):
        return 0, 0
    
    size = os.path.getsize(file_path)
    try:
        with open(file_path, 'r') as f:
            lines = sum(1 for _ in f)
        return size, lines
    except:
        return size, 0

def should_use_edit(file_path, context):
    """Determine if Edit tool would be more efficient"""
    size, lines = get_file_info(file_path)
    
    # New files are fine to write
    if size == 0:
        return False
    
    # Large files should use Edit
    if size > 10000 or lines > 300:
        return True
    
    # Check if context suggests partial edit
    if context and 'partial' in context.lower():
        return True
    
    return False

def main():
    # Parse arguments
    file_path = ''
    context = ''
    
    for i, arg in enumerate(sys.argv):
        if arg == '--file' and i + 1 < len(sys.argv):
            file_path = sys.argv[i + 1]
        elif arg == '--context' and i + 1 < len(sys.argv):
            context = sys.argv[i + 1]
    
    if not file_path:
        print("ERROR: No file path provided")
        sys.exit(1)
    
    # Check if Edit would be better
    if should_use_edit(file_path, context):
        size, lines = get_file_info(file_path)
        print(f"\n⚠️  WARNING: File '{file_path}' has {lines} lines ({size} bytes)")
        print("📝 RECOMMENDATION: Use Edit or MultiEdit tool for better efficiency")
        print("❌ BLOCKING: Write operation blocked to save tokens\n")
        sys.exit(1)  # Block the operation
    
    # Log approval
    print(f"✅ Write approved for: {file_path}")
    sys.exit(0)

if __name__ == "__main__":
    main()
