#!/bin/bash
CHECKPOINT_NAME="checkpoint_${TIMESTAMP}"
echo "Rolling back to checkpoint: ${CHECKPOINT_NAME}"
cd "${PROJECT_DIR}"
git reset --hard HEAD~1
echo "Rollback complete. Review changes before proceeding."
