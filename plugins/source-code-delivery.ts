import { Plugin } from 'vite'
import * as fs from 'fs'
import * as path from 'path'

function copyDirectory(src: string, dest: string) {
    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true })
    }

    const entries = fs.readdirSync(src, { withFileTypes: true })

    for (const entry of entries) {
        const srcPath = path.join(src, entry.name)
        const destPath = path.join(dest, entry.name)

        if (entry.isDirectory()) {
            copyDirectory(srcPath, destPath)
        } else {
            fs.copyFileSync(srcPath, destPath)
        }
    }
}

export function sourceCodeDelivery(): Plugin {
    return {
        name: 'source-code-delivery',
        closeBundle() {
            const srcDir = path.resolve('src')
            const packagesDir = path.resolve('packages')
            const distSrcDir = path.resolve('dist/src')
            const distPackagesDir = path.resolve('dist/packages')

            // Copy source code
            if (fs.existsSync(srcDir)) {
                copyDirectory(srcDir, distSrcDir)
            }

            // Copy packages
            if (fs.existsSync(packagesDir)) {
                copyDirectory(packagesDir, distPackagesDir)
            }
        }
    }
} 