#!/bin/bash
for i in {1..3}
do
  echo "🌟 DREAM ITERATION $i/3..."
  node dream.js "dream pirate_cove"
  echo "Sleeping for 2 seconds..."
  sleep 2
done
echo "✅ Dream loop complete!"
