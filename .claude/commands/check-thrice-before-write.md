#\!/usr/bin/env python3
"""
Autonomous Agent Validation Hook
Performs 3-check validation before allowing writes
"""
import sys
import os
import time
import json
from datetime import datetime

VALIDATION_LOG = "logs/validation_checks.json"

def load_validation_history():
    """Load validation history"""
    if os.path.exists(VALIDATION_LOG):
        try:
            with open(VALIDATION_LOG, 'r') as f:
                return json.load(f)
        except:
            pass
    return {}

def save_validation_history(history):
    """Save validation history"""
    os.makedirs(os.path.dirname(VALIDATION_LOG), exist_ok=True)
    with open(VALIDATION_LOG, 'w') as f:
        json.dump(history, f, indent=2)

def check_file_safety(file_path):
    """Check if file operation is safe"""
    # Critical files that need extra caution
    critical_patterns = [
        'requirements.txt',
        'package.json',
        'docker-compose',
        '.env',
        'config/',
        'security/',
        '__init__.py'
    ]
    
    for pattern in critical_patterns:
        if pattern in file_path:
            return False, f"Critical file pattern '{pattern}' detected"
    
    return True, "File is safe to modify"

def validate_operation(file_path, attempt_num):
    """Validate the operation with progressive checks"""
    print(f"\n🔍 Validation Check {attempt_num}/3 for: {file_path}")
    
    # Check 1: Basic safety
    if attempt_num == 1:
        is_safe, reason = check_file_safety(file_path)
        if not is_safe:
            print(f"⚠️  Check 1 Warning: {reason}")
            return False
        print("✓ Check 1 Passed: Basic safety check")
        return True
    
    # Check 2: File size and impact
    elif attempt_num == 2:
        if os.path.exists(file_path):
            size = os.path.getsize(file_path)
            if size > 50000:
                print(f"⚠️  Check 2 Warning: Large file ({size} bytes)")
                return False
        print("✓ Check 2 Passed: Size and impact check")
        return True
    
    # Check 3: Final confirmation
    elif attempt_num == 3:
        print("✓ Check 3 Passed: Final validation")
        print("✅ ALL CHECKS PASSED - Operation approved")
        return True
    
    return False

def main():
    # Parse arguments
    file_path = None
    for i, arg in enumerate(sys.argv):
        if '--validate-changes' in arg and i + 1 < len(sys.argv):
            # Next argument might be file path
            if i + 1 < len(sys.argv) and not sys.argv[i + 1].startswith('--'):
                file_path = sys.argv[i + 1]
    
    # If no file path, check for environment variable
    if not file_path:
        file_path = os.environ.get('VALIDATION_FILE', 'unknown')
    
    # Load history
    history = load_validation_history()
    
    # Create session key
    session_key = f"{file_path}_{datetime.now().strftime('%Y%m%d_%H%M')}"
    
    # Get current attempt number
    if session_key not in history:
        history[session_key] = {
            'file': file_path,
            'attempts': 0,
            'first_attempt': datetime.now().isoformat()
        }
    
    history[session_key]['attempts'] += 1
    attempt_num = history[session_key]['attempts']
    
    # Perform validation
    if attempt_num <= 3:
        passed = validate_operation(file_path, attempt_num)
        history[session_key]['last_attempt'] = datetime.now().isoformat()
        history[session_key][f'check_{attempt_num}_passed'] = passed
        
        # Save history
        save_validation_history(history)
        
        if not passed:
            print(f"\n❌ Validation failed at check {attempt_num}")
            print(f"🔄 Please address the warnings and try again ({3 - attempt_num} checks remaining)")
            sys.exit(1)
        
        if attempt_num < 3:
            print(f"\n⏳ Check {attempt_num} passed. Run the operation again to continue validation.")
            sys.exit(1)  # Force re-run for next check
    else:
        print(f"\n✅ File already validated in this session")
    
    sys.exit(0)

if __name__ == "__main__":
    main()
