# Vite Source Code Delivery Plugin Demo

这个项目演示了如何创建一个Vite插件，该插件可以在打包时将引用的其它packages的源代码一起打包，方便将完整的源代码交付给客户进行安全验证。

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

本项目中的`source-code-delivery`插件主要使用了`closeBundle`钩子，在打包完成后将源代码复制到dist目录。

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
- `packages`目录（包含依赖包的源代码）

## 插件工作原理

1. 插件在项目构建完成后（`closeBundle`钩子）触发
2. 扫描项目中的`src`和`packages`目录
3. 将这些目录的内容复制到`dist`目录下对应的位置
4. 这样最终的构建输出中就包含了完整的源代码

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
2. 插件会复制整个目录结构，所以要注意排除不必要的文件
3. 在生产环境中使用时，建议添加文件过滤规则 