const fs = require('fs');
const files = [
  { path: 'src/routes/vendor/portfolioAlbumRoutes.js', role: 'isVendor' },
  { path: 'src/routes/vendor/reviewRoutes.js', role: 'isVendor' },
  { path: 'src/routes/vendor/categoryRoutes.js', role: 'isVendor' },
  { path: 'src/routes/panel/reviewRoutes.js', role: 'isPanelUser' },
  { path: 'src/routes/panel/portfolioRoutes.js', role: 'isPanelUser' },
  { path: 'src/routes/panel/categoryRoutes.js', role: 'isPanelUser' },
  { path: 'src/routes/consumer/reviewRoutes.js', role: 'isConsumer' }
];

for (const file of files) {
  if (fs.existsSync(file.path)) {
    let content = fs.readFileSync(file.path, 'utf8');
    content = content.replace(/import authMiddleware from '#middleware\/authMiddleware\.js';/g, `import { authenticate, ${file.role} } from '#middleware/authMiddleware.js';`);
    content = content.replace(/authMiddleware,/g, `authenticate, ${file.role},`);
    fs.writeFileSync(file.path, content);
    console.log('Fixed ' + file.path);
  } else {
    console.log('Not found ' + file.path);
  }
}
