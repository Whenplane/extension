
# Run this using pnpm build

echo "Assembling!"

sleep 1

rm -rf dist/chrome dist/firefox

cp -a dist/base dist/chrome
cp -a dist/base dist/firefox

cp browser-specific/chrome/* dist/chrome/
cp browser-specific/firefox/* dist/firefox/

echo "Done assembling."

