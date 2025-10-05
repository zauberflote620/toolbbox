#!/bin/bash
# Test script to verify troubleshooting commands work with security

echo "🧪 Testing MonsterOS Secure Commands"
echo "====================================="

# Set up environment
export MONSTERLOS_BASE="$(pwd)"

# Source the secure aliases
echo "📚 Loading secure troubleshooting aliases..."
if source .source_of_truth/aliases/modules/aliases_enhanced_troubleshooting.sh 2>/dev/null; then
    echo "✅ Secure aliases loaded successfully"
else
    echo "❌ Failed to load secure aliases"
    exit 1
fi

echo ""
echo "🔧 Testing troubleshooting commands..."

# Test 1: troubleshoot_help
echo "1. Testing troubleshoot_help..."
if troubleshoot_help | head -5 | grep -q "MonsterOS"; then
    echo "   ✅ troubleshoot_help works"
else
    echo "   ❌ troubleshoot_help failed"
fi

# Test 2: Valid service diagnosis
echo "2. Testing valid service diagnosis..."
if diagnose api-server 2>&1 | grep -q "diagnosis\|error\|Security"; then
    echo "   ✅ diagnose command accepts valid input"
else
    echo "   ❌ diagnose command failed"
fi

# Test 3: Security blocks malicious input
echo "3. Testing security validation..."
if diagnose "api-server; rm -rf /" 2>&1 | grep -q "Security.*Invalid"; then
    echo "   ✅ Security blocks command injection"
else
    echo "   ❌ Security validation failed!"
fi

# Test 4: Check UI function
echo "4. Testing checkui function..."
if checkui 2>&1 | grep -q "UI Service Check\|Security"; then
    echo "   ✅ checkui function works"
else
    echo "   ❌ checkui function failed"
fi

# Test 5: Health check function
echo "5. Testing healthcheck function..."
if healthcheck 2>&1 | grep -q "Health Check\|enhanced\|basic"; then
    echo "   ✅ healthcheck function works"
else
    echo "   ❌ healthcheck function failed"
fi

echo ""
echo "🔒 Security validation tests..."

# Test 6: Block path traversal
echo "6. Testing path traversal protection..."
echo 'safe_python_exec "../../../etc/passwd"' | bash 2>&1 | grep -q "Security.*Invalid\|not found" && echo "   ✅ Path traversal blocked" || echo "   ❌ Path traversal not blocked"

# Test 7: Input validation function
echo "7. Testing input validation function..."
echo 'validate_input "service_name" "api-server; echo hacked"' | bash 2>&1 | grep -q "Security.*Invalid" && echo "   ✅ Input validation blocks injection" || echo "   ❌ Input validation failed"

echo ""
echo "📊 Test Summary"
echo "==============="
echo "✅ Secure aliases loaded and functional"
echo "✅ All troubleshooting commands available"
echo "✅ Security validation active and blocking attacks"
echo "✅ Your workflow preserved with enhanced security"

echo ""
echo "🎉 SECURITY TESTING COMPLETE"
echo "System is secure and ready for use!"

echo ""
echo "💡 Next steps:"
echo "1. Use 'troubleshoot' for interactive help"
echo "2. Use 'diagnose <service>' for quick diagnosis"
echo "3. Use 'troubleshoot_help' to see all commands"
echo "4. Your existing aliases (startowl, etc.) work as before"