const fs = require('fs');
const path = require('path');

const backupPath = path.join(process.cwd(), 'data', 'backup-pre-cms.json');

function readJsonSafe(file, defaultVal) {
  try {
    const fullPath = path.join(process.cwd(), 'data', file);
    if (fs.existsSync(fullPath)) {
      return JSON.parse(fs.readFileSync(fullPath, 'utf8'));
    }
  } catch (err) {
    console.warn(`Could not read ${file}:`, err.message);
  }
  return defaultVal;
}

const jsgData = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'src', 'jsgData.json'), 'utf8'));

const backupData = {
  timestamp: new Date().toISOString(),
  label: 'PRE-CMS FULL PRODUCTION BACKUP',
  version: '1.0.0-PROD-BASELINE',
  sourceManifest: {
    siteName: 'JSG Real Estate',
    approvedFrontend: true,
    pixelPerfectPreservation: true
  },
  jsgData,
  sections: readJsonSafe('sections.json', null),
  users: readJsonSafe('users.json', null),
  audit: readJsonSafe('audit.json', []),
  communityImages: readJsonSafe('community_images.json', {}),
  metadata: {
    heroSlidesCount: 4,
    propertiesCount: 16,
    areasCount: 12,
    partnersCount: 5,
    buildingsCount: 4
  }
};

fs.writeFileSync(backupPath, JSON.stringify(backupData, null, 2), 'utf8');
console.log('✅ PRE-CMS Complete Backup saved successfully to:', backupPath);
