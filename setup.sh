#!/bin/bash

# Deepfake Detection System - Quick Setup Script

echo "🚀 Setting up Deepfake Detection System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

echo "📦 Installing frontend dependencies..."
npm install

echo "🐍 Setting up Python backend..."
cd api
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..

echo "🔧 Creating environment files..."
# Create frontend env file
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8000
DJANGO_API_URL=http://localhost:8000
EOF

# Create backend env file
cat > api/.env << EOF
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1
EOF

echo "✅ Setup complete!"
echo ""
echo "🎯 Next steps:"
echo "1. Start the backend API:"
echo "   cd api && source venv/bin/activate && python main.py"
echo ""
echo "2. In another terminal, start the frontend:"
echo "   npm run dev"
echo ""
echo "3. Open http://localhost:3000 in your browser"
echo ""
echo "📚 For deployment instructions, see DEPLOYMENT.md"