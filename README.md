# Vite Source Code Delivery Plugin Demo

这个项目演示了如何创建一个Vite插件，该插件可以在打包时将引用的其它packages的源代码一起打包，方便将完整的源代码交付给客户进行安全验证。插件会智能分析代码依赖关系，只复制实际被使用的源文件。

## 项目结构

```
.
├── packages/          # 本地依赖包
│   └── utils/        # 工具包示例
│       ├── hello.ts  # 示例函数
│       └── package.json
├── plugins/          # Vite插件目录
│   └── source-code-delivery.ts  # 源代码交付插件
├── src/             # 主应用源码
│   └── main.tsx     # 入口文件
├── vite.config.ts   # Vite配置
└── tsconfig.json    # TypeScript配置
```

## Vite插件开发

Vite插件是一个包含特定钩子函数的对象，可以影响构建过程的不同阶段。一个典型的Vite插件结构如下：

```typescript
export function myPlugin(): Plugin {
    return {
        name: 'my-plugin',        // 插件名称
        configureServer() {},     // 开发服务器配置
        buildStart() {},         // 构建开始时
        transform() {},          // 转换代码时
        buildEnd() {},          // 构建结束时
        closeBundle() {}        // 打包完成时
    }
}
```

本项目中的`source-code-delivery`插件使用了以下钩子：
- `transform`: 用于分析和收集代码依赖关系
- `closeBundle`: 在打包完成后将源代码复制到dist目录

## 使用方式

1. 安装依赖：
```bash
pnpm install
```

2. 开发模式：
```bash
pnpm start
```

3. 构建：
```bash
pnpm build
```

构建完成后，你会在`dist`目录下看到：
- 正常的构建输出（如`index.html`、`assets`等）
- `src`目录（包含主应用的源代码）
- `packages`目录（只包含实际被引用的依赖包源代码）

## 插件工作原理

1. 在代码转换阶段（`transform`钩子）：
   - 分析每个被处理的模块
   - 收集来自`packages`目录的依赖文件路径

2. 在构建完成后（`closeBundle`钩子）：
   - 复制完整的`src`目录到`dist/src`
   - 只复制被实际引用的`packages`文件到`dist/packages`
   - 保持原始的目录结构

这种方式确保了最终的输出只包含实际被使用的源代码，类似于JavaScript的tree-shaking机制。

## 配置说明

1. `vite.config.ts`中配置插件和路径别名：
```typescript
export default defineConfig({
    plugins: [react(), sourceCodeDelivery()],
    resolve: {
        alias: {
            '@packages': path.resolve(__dirname, 'packages')
        }
    }
})
```

2. `tsconfig.json`中配置路径别名：
```json
{
    "compilerOptions": {
        "paths": {
            "@packages/*": ["packages/*"]
        }
    }
}
```

## 注意事项

1. 确保`packages`目录中的源代码是你希望交付给客户的
2. 插件现在只复制实际被引用的文件，这可以显著减少输出大小
3. 由于使用了依赖分析，确保你的代码使用ES模块语法（import/export）
4. 动态导入（dynamic imports）也会被正确处理
5. 如果需要复制额外的文件，可以修改插件的`transform`钩子的过滤条件