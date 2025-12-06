
#!/usr/bin/env bash
set -e

echo "📦 Installing client dependencies..."
cd client
npm install

echo "🏗️  Building client..."
npm run build

echo "✅ Client build complete!"
cd ..

echo "📦 Installing server dependencies..."
cd server
npm install

echo "✅ Server dependencies installed!"
cd ..

echo "🎉 Build process complete!"