
# Deployment Guide for Hostinger/WordPress

## Step 1: Build the Project
Run this command in your project directory:
```bash
npm run build
```

This creates a `dist` folder with all the files you need to upload.

## Step 2: Upload Files to Hostinger

### Option A: Upload to WordPress subdirectory
1. Go to your Hostinger File Manager
2. Navigate to `public_html/your-wordpress-site/`
3. Create a new folder called `perfect20` (or any name you prefer)
4. Upload ALL contents of the `dist` folder to this new folder
5. Access your game at: `https://yoursite.com/perfect20/`

### Option B: Upload to subdomain
1. Create a subdomain in Hostinger (e.g., `game.yoursite.com`)
2. Upload ALL contents of the `dist` folder to the subdomain's root folder
3. Access your game at: `https://game.yoursite.com/`

### Option C: Replace WordPress entirely (not recommended)
1. Backup your WordPress site first!
2. Upload ALL contents of the `dist` folder to `public_html/`
3. Access your game at: `https://yoursite.com/`

## Step 3: Important File Structure
After upload, your file structure should look like:
```
your-chosen-folder/
├── index.html
├── assets/
│   ├── index-[hash].js
│   ├── index-[hash].css
│   └── [other-assets]
└── [other-files]
```

## Step 4: Common Issues and Solutions

### Blank Screen Issues:
1. Check browser console for errors (F12 → Console tab)
2. Ensure all files uploaded correctly
3. Check file permissions (should be 644 for files, 755 for folders)
4. Make sure you're accessing the correct URL

### Path Issues:
- The app now uses relative paths (`./`) which should work in most hosting scenarios
- If you still have issues, try accessing directly: `https://yoursite.com/path-to-game/index.html`

### MIME Type Issues:
- If JavaScript files don't load, add this to your `.htaccess` file in the same folder:
```
AddType application/javascript .js
AddType text/css .css
```

## Step 5: Testing
1. Open your browser's developer tools (F12)
2. Go to the Console tab
3. Navigate to your game URL
4. Look for any error messages and share them if you need help

## WordPress Integration (Optional)
If you want to embed the game in a WordPress page:
1. Install the "Insert Headers and Footers" plugin
2. Add this iframe code to any page/post:
```html
<iframe src="/perfect20/" width="100%" height="800px" frameborder="0"></iframe>
```

Replace `/perfect20/` with your actual path.
