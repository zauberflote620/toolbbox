#!/bin/bash

# Autonomous Execution Checkpoint Script
# Runs every 30 minutes to save state, validate progress, and create rollback points

CHECKPOINT_DIR="/Volumes/pi_ext_drive/obsidian/Toolbox/.autonomous/checkpoints"
VALIDATION_DIR="/Volumes/pi_ext_drive/obsidian/Toolbox/.autonomous/validation"
METRICS_DIR="/Volumes/pi_ext_drive/obsidian/Toolbox/.autonomous/metrics"
ROLLBACK_DIR="/Volumes/pi_ext_drive/obsidian/Toolbox/.autonomous/rollback"
PROJECT_DIR="/Volumes/pi_ext_drive/obsidian/Toolbox/shop-reset-kit"

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
CHECKPOINT_NAME="checkpoint_${TIMESTAMP}"

echo "=========================================="
echo "AUTONOMOUS CHECKPOINT: ${CHECKPOINT_NAME}"
echo "=========================================="

# 1. Create checkpoint directory
mkdir -p "${CHECKPOINT_DIR}/${CHECKPOINT_NAME}"

# 2. Save git state (if git initialized)
if [ -d "${PROJECT_DIR}/.git" ]; then
    echo "[CHECKPOINT] Saving git state..."
    cd "${PROJECT_DIR}"

    # Create WIP commit
    git add -A
    git commit -m "WIP: Checkpoint ${TIMESTAMP}" || echo "No changes to commit"

    # Save git log
    git log --oneline -10 > "${CHECKPOINT_DIR}/${CHECKPOINT_NAME}/git_log.txt"
    git status > "${CHECKPOINT_DIR}/${CHECKPOINT_NAME}/git_status.txt"
    git diff HEAD~1 > "${CHECKPOINT_DIR}/${CHECKPOINT_NAME}/recent_changes.diff" 2>/dev/null || true
else
    echo "[CHECKPOINT] Git not initialized yet"
fi

# 3. Run quick test suite (under 10 seconds)
echo "[CHECKPOINT] Running quick test suite..."
cd "${PROJECT_DIR}"
if [ -f "package.json" ]; then
    npm test -- --run --reporter=verbose > "${VALIDATION_DIR}/test_results_${TIMESTAMP}.txt" 2>&1 &
    TEST_PID=$!

    # Timeout after 10 seconds
    sleep 10
    if ps -p $TEST_PID > /dev/null; then
        kill $TEST_PID 2>/dev/null || true
        echo "[WARNING] Tests exceeded 10-second quick check limit" >> "${VALIDATION_DIR}/test_results_${TIMESTAMP}.txt"
    fi
    wait $TEST_PID 2>/dev/null
    TEST_EXIT_CODE=$?

    if [ $TEST_EXIT_CODE -ne 0 ]; then
        echo "[ALERT] Tests failed! Exit code: ${TEST_EXIT_CODE}"
        echo "ROLLBACK_RECOMMENDED" > "${CHECKPOINT_DIR}/${CHECKPOINT_NAME}/alert.txt"
    else
        echo "[SUCCESS] Quick tests passed"
    fi
else
    echo "[SKIP] No package.json found, skipping tests"
fi

# 4. Save state snapshot
echo "[CHECKPOINT] Creating state snapshot..."
cat > "${CHECKPOINT_DIR}/${CHECKPOINT_NAME}/state.json" <<EOF
{
  "timestamp": "${TIMESTAMP}",
  "checkpoint_name": "${CHECKPOINT_NAME}",
  "project_dir": "${PROJECT_DIR}",
  "files_changed": $(git diff --name-only HEAD~1 2>/dev/null | wc -l || echo 0),
  "test_status": "${TEST_EXIT_CODE:-unknown}"
}
EOF

# 5. Collect metrics
echo "[CHECKPOINT] Collecting metrics..."
FILE_COUNT=$(find "${PROJECT_DIR}/src" -type f 2>/dev/null | wc -l || echo 0)
LINE_COUNT=$(find "${PROJECT_DIR}/src" -name "*.js" -o -name "*.jsx" 2>/dev/null | xargs wc -l 2>/dev/null | tail -1 | awk '{print $1}' || echo 0)

cat > "${METRICS_DIR}/metrics_${TIMESTAMP}.json" <<EOF
{
  "timestamp": "${TIMESTAMP}",
  "source_files": ${FILE_COUNT},
  "total_lines": ${LINE_COUNT},
  "disk_usage_kb": $(du -sk "${PROJECT_DIR}" 2>/dev/null | awk '{print $1}' || echo 0)
}
EOF

# 6. Create rollback script for this checkpoint
cat > "${ROLLBACK_DIR}/rollback_to_${TIMESTAMP}.sh" <<'ROLLBACK_SCRIPT'
#!/bin/bash
CHECKPOINT_NAME="checkpoint_${TIMESTAMP}"
echo "Rolling back to checkpoint: ${CHECKPOINT_NAME}"
cd "${PROJECT_DIR}"
git reset --hard HEAD~1
echo "Rollback complete. Review changes before proceeding."
ROLLBACK_SCRIPT

chmod +x "${ROLLBACK_DIR}/rollback_to_${TIMESTAMP}.sh"

# 7. Summary
echo ""
echo "=========================================="
echo "CHECKPOINT COMPLETE"
echo "=========================================="
echo "Checkpoint: ${CHECKPOINT_NAME}"
echo "Files changed: $(git diff --name-only HEAD~1 2>/dev/null | wc -l || echo 0)"
echo "Test status: ${TEST_EXIT_CODE:-unknown}"
echo "Rollback available: ${ROLLBACK_DIR}/rollback_to_${TIMESTAMP}.sh"
echo ""

exit 0
