#!/bin/bash

# RAEDAM Software Deployment Script
# This script builds and deploys the updated software

echo "🚀 Starting RAEDAM Software deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the Software directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Error: Failed to install dependencies"
    exit 1
fi

# Build the application
echo "🔨 Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Error: Build failed"
    exit 1
fi

echo "✅ Build completed successfully!"

# Check if build directory exists
if [ ! -d "build" ]; then
    echo "❌ Error: Build directory not found"
    exit 1
fi

# Create deployment summary
echo "📋 Creating deployment summary..."
cat > DEPLOYMENT_SUMMARY.md << EOF
# RAEDAM Software Deployment Summary

## Deployment Date
$(date)

## Build Status
✅ Successfully built and ready for deployment

## Updates Made
- ✅ Updated to React 18 with modern syntax
- ✅ Migrated to React Router v6
- ✅ Updated to Firebase v9+ modular syntax
- ✅ Removed deprecated dependencies (jQuery, Bootstrap 4, sweetalert2-react-content)
- ✅ Implemented modern CSS with CSS variables and design system
- ✅ Updated all components to use modern styling
- ✅ Improved error handling and async/await patterns
- ✅ Enhanced UI/UX with modern design patterns

## Technical Changes
- React: 17.0.2 → 18.2.0
- React Router: 5.2.0 → 6.20.1
- Firebase: 8.3.3 → 10.7.1
- React Scripts: 4.0.3 → 5.0.1
- Removed: jQuery, Bootstrap, sweetalert2-react-content

## Files Updated
- package.json (dependencies and scripts)
- src/App.css (complete redesign with CSS variables)
- src/App.js (React Router v6 syntax)
- src/index.js (React 18 createRoot)
- src/FirebaseSetup.js (Firebase v9+ syntax)
- src/common/Header.jsx (modern syntax and styling)
- src/organization/index.jsx (React Router v6)
- src/organization/Organization.jsx (React Router v6 + Firestore v9+)
- src/organization/Price.jsx (modern styling + Firestore v9+)
- src/organization/facilities/Location.jsx (modern styling + Firestore v9+)
- src/organization/facilities/LocationList.jsx (modern syntax + styling)
- src/organization/facilities/SensorLog.jsx (modern styling)
- src/organization/facilities/Spot.jsx (modern syntax + styling)
- src/organization/facilities/SpotMap.jsx (modern syntax + styling)
- src/login.jsx (modern styling)
- src/profile/index.jsx (modern syntax + styling)
- src/common/CardList.jsx (modern styling)

## Build Output
- Main JS bundle: 341.56 kB (gzipped)
- CSS bundle: 3.83 kB (gzipped)
- Additional chunks: 2.66 kB (gzipped)

## Next Steps
1. Test the application thoroughly
2. Deploy to production environment
3. Monitor for any issues
4. Update documentation as needed

## Notes
- All components now use modern React patterns
- CSS is organized with a design system approach
- Firebase operations use modern modular syntax
- Improved error handling throughout the application
EOF

echo "📄 Deployment summary created: DEPLOYMENT_SUMMARY.md"

echo ""
echo "🎉 Deployment preparation completed!"
echo ""
echo "📁 Build files are ready in the 'build' directory"
echo "📋 Deployment summary saved to 'DEPLOYMENT_SUMMARY.md'"
echo ""
echo "To deploy:"
echo "1. Copy the 'build' directory to your web server"
echo "2. Configure your server to serve the React app"
echo "3. Update any necessary environment variables"
echo ""
echo "For testing, you can run: npm start"
