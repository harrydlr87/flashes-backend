const s = require('shelljs');

// Steps to build the app

// 1. Remove previous build
s.rm('-rf', 'src/app/public');
s.mkdir('src/app/public');

// 2. Copy the new frontend build
s.cp('-R', '../landing-page-frontend/dist/.', 'src/app/public');
