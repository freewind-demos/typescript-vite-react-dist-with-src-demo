import { Plugin } from 'vite'
import * as fs from 'fs'
import * as path from 'path'

function copyFile(src: string, dest: string) {
    if (!fs.existsSync(path.dirname(dest))) {
        fs.mkdirSync(path.dirname(dest), { recursive: true })
    }
    fs.copyFileSync(src, dest)
}

export function sourceCodeDelivery(): Plugin {
    const usedFiles = new Set<string>()

    return {
        name: 'source-code-delivery',

        // 在转换代码时收集依赖信息
        async transform(code: string, id: string) {
            if (id.includes('/packages/')) {
                usedFiles.add(id)
            }
            return null
        },

        // 在构建完成后复制源代码
        closeBundle() {
            const srcDir = path.resolve('src')
            const distSrcDir = path.resolve('dist/src')

            // 复制src目录
            if (fs.existsSync(srcDir)) {
                const entries = fs.readdirSync(srcDir, { withFileTypes: true })
                for (const entry of entries) {
                    const srcPath = path.join(srcDir, entry.name)
                    const destPath = path.join(distSrcDir, entry.name)
                    if (entry.isDirectory()) {
                        fs.mkdirSync(destPath, { recursive: true })
                        fs.cpSync(srcPath, destPath, { recursive: true })
                    } else {
                        copyFile(srcPath, destPath)
                    }
                }
            }

            // 只复制被使用的packages文件
            for (const file of Array.from(usedFiles)) {
                const relativePath = path.relative(process.cwd(), file)
                const destPath = path.resolve('dist', relativePath)
                copyFile(file, destPath)
            }
        }
    }
} 