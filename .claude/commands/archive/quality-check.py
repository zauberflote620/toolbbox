#!/usr/bin/env python3
"""
Quality Checks and Security Analysis
Following .claude/commands/test.md standards

created: 250728
"""

import re
import subprocess
import sys
from pathlib import Path


def check_security(file_path):
    """Check for security issues"""
    with open(file_path, "r") as f:
        content = f.read()

    issues = []

    # Check for hardcoded secrets
    secret_patterns = [
        r"password\s*=\s*[\"\']\w+[\"\']+",
        r"api_key\s*=\s*[\"\']\w+[\"\']+",
        r"secret\s*=\s*[\"\']\w+[\"\']+",
        r"token\s*=\s*[\"\']\w+[\"\']+",
    ]

    for pattern in secret_patterns:
        if re.search(pattern, content, re.IGNORECASE):
            issues.append("Potential hardcoded secret")

    # Check for dangerous functions
    if "eval(" in content or "exec(" in content:
        issues.append("Dangerous eval/exec usage")

    # Check for subprocess shell=True
    if "subprocess." in content and "shell=True" in content:
        issues.append("Subprocess with shell=True")

    return issues


def check_error_handling(file_path):
    """Check error handling patterns"""
    with open(file_path, "r") as f:
        content = f.read()

    try_count = content.count("try:")
    except_count = content.count("except")

    return {"try_blocks": try_count, "except_handlers": except_count, "ratio": except_count / max(try_count, 1)}


def check_code_quality(file_path):
    """Check basic code quality metrics"""
    with open(file_path, "r") as f:
        lines = f.readlines()

    metrics = {
        "total_lines": len(lines),
        "code_lines": len([l for l in lines if l.strip() and not l.strip().startswith("#")]),
        "comment_ratio": len([l for l in lines if l.strip().startswith("#")]) / len(lines),
        "long_lines": len([l for l in lines if len(l) > 120]),
    }

    return metrics


def main():
    print("📋 III. QUALITY CHECKS")
    print("-" * 30)

    # Files to analyze
    files_to_check = [
        "scripts/workflow/background_fixer.py",
        "scripts/workflow/pre_commit_automation.py",
        "scripts/dev_command/dev.py",
        "scripts/dev_command/context_detector.py",
        "scripts/dev_command/interactive_menu.py",
    ]

    print("Security Analysis:")
    security_issues = 0
    for file_path in files_to_check:
        if Path(file_path).exists():
            issues = check_security(file_path)
            if issues:
                print(f"❌ {Path(file_path).name}: {len(issues)} issues")
                for issue in issues:
                    print(f"   - {issue}")
                    security_issues += 1
            else:
                print(f"✅ {Path(file_path).name}: No security issues")

    print(f"\nError Handling Analysis:")
    error_handling_good = 0
    for file_path in files_to_check:
        if Path(file_path).exists():
            eh = check_error_handling(file_path)
            if eh["try_blocks"] > 0 and eh["ratio"] >= 1.0:
                print(f'✅ {Path(file_path).name}: {eh["try_blocks"]} try blocks, {eh["except_handlers"]} handlers')
                error_handling_good += 1
            elif eh["try_blocks"] == 0:
                print(f"⚠️  {Path(file_path).name}: No error handling")
            else:
                print(
                    f'⚠️  {Path(file_path).name}: {eh["try_blocks"]} try blocks, {eh["except_handlers"]} handlers (low ratio)'
                )

    print(f"\nCode Quality Metrics:")
    for file_path in files_to_check:
        if Path(file_path).exists():
            metrics = check_code_quality(file_path)
            print(f"{Path(file_path).name}:")
            print(f'  Lines: {metrics["total_lines"]} total, {metrics["code_lines"]} code')
            print(f'  Comments: {metrics["comment_ratio"]:.1%}')
            print(f'  Long lines (>120): {metrics["long_lines"]}')

    print(f"\n📊 Quality Summary:")
    print(f"  Security Issues: {security_issues}")
    print(f"  Files with Good Error Handling: {error_handling_good}/{len(files_to_check)}")


if __name__ == "__main__":
    main()

# Provide detailed reports and findings, in message (not new file) then suggest next steps.
# (ex.: /test? /review-code? /quality-pipeline? /quality-check? /debug? /generate-tasks? something else?)#
