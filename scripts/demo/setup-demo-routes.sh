#!/bin/bash
if [ "$DEMO_MODE" = "true" ]; then
  echo "DEMO_MODE enabled: setting up demo cron route..."
  mkdir -p src/app/api/cron/demo-reset
  cp scripts/demo/demo-cron-route.ts src/app/api/cron/demo-reset/route.ts
  echo "Demo cron route installed at src/app/api/cron/demo-reset/route.ts"
else
  echo "DEMO_MODE not enabled: skipping demo route setup"
fi
