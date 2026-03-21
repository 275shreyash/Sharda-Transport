import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const frontendDir = path.join(rootDir, 'frontend');
const backendDir = path.join(rootDir, 'backend');

// 1. Create frontend and backend directories
if (!fs.existsSync(frontendDir)) fs.mkdirSync(frontendDir);
if (!fs.existsSync(backendDir)) fs.mkdirSync(backendDir);

// 2. Read package.json
const pkgPath = path.join(rootDir, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));

// 3. Create frontend package.json
const frontendPkg = {
    name: "frontend",
    private: true,
    version: "0.0.0",
    type: "module",
    scripts: {
        dev: "vite",
        build: "vite build",
        lint: "eslint .",
        preview: "vite preview"
    },
    dependencies: {
        "lucide-react": pkg.dependencies["lucide-react"],
        "react": pkg.dependencies["react"],
        "react-dom": pkg.dependencies["react-dom"],
        "react-router-dom": pkg.dependencies["react-router-dom"],
        "recharts": pkg.dependencies["recharts"],
        "socket.io-client": pkg.dependencies["socket.io-client"]
    },
    devDependencies: pkg.devDependencies,
    overrides: pkg.overrides
};
fs.writeFileSync(path.join(frontendDir, 'package.json'), JSON.stringify(frontendPkg, null, 2));

// 4. Create backend package.json
const backendPkg = {
    name: "backend",
    private: true,
    version: "0.0.0",
    type: "module",
    scripts: {
        start: "node index.js",
        dev: "node --watch index.js",
        "create-admin": "node scripts/create-admin.js"
    },
    dependencies: {
        "bcryptjs": pkg.dependencies["bcryptjs"],
        "cors": pkg.dependencies["cors"],
        "dotenv": pkg.dependencies["dotenv"],
        "express": pkg.dependencies["express"],
        "json2csv": pkg.dependencies["json2csv"],
        "jsonwebtoken": pkg.dependencies["jsonwebtoken"],
        "mongoose": pkg.dependencies["mongoose"],
        "nodemailer": pkg.dependencies["nodemailer"],
        "socket.io": pkg.dependencies["socket.io"]
    }
};
fs.writeFileSync(path.join(backendDir, 'package.json'), JSON.stringify(backendPkg, null, 2));

function safeMove(srcPath, destPath) {
    if (fs.existsSync(srcPath)) {
        try {
            fs.cpSync(srcPath, destPath, { recursive: true });
            fs.rmSync(srcPath, { recursive: true, force: true });
        } catch (e) {
            console.error(`Failed to remove ${srcPath}:`, e.message);
        }
    }
}

// 5. Move frontend files
const frontendFiles = ['src', 'public', 'index.html', 'vite.config.js', 'eslint.config.js'];
frontendFiles.forEach(file => safeMove(path.join(rootDir, file), path.join(frontendDir, file)));

// 6. Move backend files (content of server folder goes into backend folder)
const serverDir = path.join(rootDir, 'server');
if (fs.existsSync(serverDir)) {
    const serverFiles = fs.readdirSync(serverDir);
    serverFiles.forEach(file => {
        safeMove(path.join(serverDir, file), path.join(backendDir, file));
    });
    try { fs.rmSync(serverDir, { recursive: true, force: true }); } catch (e) { }
}

// 7. Move scripts directory to backend
safeMove(path.join(rootDir, 'scripts'), path.join(backendDir, 'scripts'));

// 8. Copy .env to both frontend and backend
const envFile = path.join(rootDir, '.env');
if (fs.existsSync(envFile)) {
    fs.copyFileSync(envFile, path.join(backendDir, '.env'));
    safeMove(envFile, path.join(frontendDir, '.env'));
}

console.log("Splitting finished.");
