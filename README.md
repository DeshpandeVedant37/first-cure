# First-Cure - AI Skin Cancer Detection

AI-powered skin cancer screening application with multiple image analysis and patient history tracking.

## Features
- Multiple image upload and simultaneous analysis
- AI-powered skin lesion classification
- Patient information management
- Nearby dermatologist locator with map
- Patient history tracking

## Deploy to Netlify

### Option 1: Drag and Drop
1. Go to [Netlify](https://app.netlify.com/)
2. Sign up or log in
3. Drag and drop the `public` folder to Netlify's deploy zone

### Option 2: Git Integration
1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [Netlify](https://app.netlify.com/)
3. Click "New site from Git"
4. Connect your repository
5. Set build settings:
   - Build command: (leave empty)
   - Publish directory: `public`
6. Click "Deploy site"

### Option 3: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Deploy
netlify deploy --prod --dir=public
```

## Important Notes
- Replace `YOUR_API_KEY` in index.html with your actual Google Maps API key
- The AI model files are included in the `public/model` directory
- Patient data is stored locally in browser localStorage

## Technologies Used
- TensorFlow.js for AI model inference
- Leaflet/Google Maps for location services
- LocalStorage for patient data persistence
- Vanilla JavaScript (no framework dependencies)
