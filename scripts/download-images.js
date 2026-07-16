const fs = require('fs');
const https = require('https');
const path = require('path');

function download(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`Downloaded ${url} to ${filepath}`);
          resolve();
        });
      } else {
        reject(new Error(`Failed to download ${url}: ${res.statusCode}`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function main() {
  const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  try {
    // Let's download the main image
    await download('https://thehairfactory.pk/cdn/shop/files/200ml_4_1_1.webp', path.join(uploadDir, 'shampoo-1.webp'));
    
    // We can also copy the same image for variant/shade views or use high-quality Unsplash placeholders
    fs.copyFileSync(path.join(uploadDir, 'shampoo-1.webp'), path.join(uploadDir, 'shampoo-2.webp'));
    fs.copyFileSync(path.join(uploadDir, 'shampoo-1.webp'), path.join(uploadDir, 'shampoo-3.webp'));
    
    console.log('Images setup completed successfully.');
  } catch (err) {
    console.error('Error downloading images:', err);
  }
}

main();
