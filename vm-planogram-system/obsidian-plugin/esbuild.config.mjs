import esbuild from "esbuild";
import process from "process";
import fs from "fs";

const prod = (process.argv[2] === 'production');
const watch = process.argv.includes('--watch');

// Enhanced banner with version info
const banner = `/*
VM Planogram Plugin v2.0.0 - Enhanced
Built: ${new Date().toISOString()}
Mode: ${prod ? 'Production' : 'Development'}
*/`;

const config = {
    entryPoints: ['src/main.ts'],
    bundle: true,
    external: ['obsidian', 'electron', 'fs', 'path', 'os', 'crypto', 'buffer'],
    platform: 'browser',
    format: 'cjs',
    target: 'es2020',
    logLevel: 'info',
    sourcemap: prod ? false : 'inline',
    minify: prod,
    outfile: 'main.js',
    banner: {
        js: banner
    },
    define: {
        'process.env.NODE_ENV': prod ? '"production"' : '"development"',
        'process.env.VERSION': '"2.0.0"'
    },
    loader: {
        '.html': 'text',
        '.css': 'text',
        '.svg': 'text'
    }
};

if (watch) {
    const ctx = await esbuild.context(config);
    await ctx.watch();
    console.log('👀 Watching for changes...');

    // Optional: Add hot reload notification
    const server = await ctx.serve({
        servedir: '.',
        port: 8080,
    });
    console.log(`📡 Development server running at http://localhost:${server.port}`);
} else {
    await esbuild.build(config).catch(() => process.exit(1));

    if (prod) {
        console.log('✅ Production build complete');

        // Copy to plugin installation directory
        const targetDir = '/Volumes/pi_ext_drive/obsidian/tools/.obsidian/plugins/vm-planogram/';
        const files = ['main.js', 'manifest.json'];

        files.forEach(file => {
            if (fs.existsSync(file)) {
                fs.copyFileSync(file, `${targetDir}${file}`);
                console.log(`📋 Copied ${file} to plugin directory`);
            }
        });
    }
}