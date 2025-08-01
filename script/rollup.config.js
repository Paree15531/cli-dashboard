import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { terser } from "rollup-plugin-terser";
import copy from "rollup-plugin-copy";

export default {
  input: "src/index.ts",
  output: {
    file: "dist/index.js",
    format: "cjs", // Node.js 使用 CommonJS
    banner: "#!/usr/bin/env node", // 添加 shebang
    sourcemap: false,
  },
  plugins: [
    // 解析 node_modules 中的模块
    nodeResolve({
      preferBuiltins: true, // 优先使用 Node.js 内置模块
      exportConditions: ["node"], // 针对 Node.js 环境
    }),
    // 转换 CommonJS 模块
    commonjs(),

    // 支持 JSON 导入
    json(),

    // 复制静态文件
    copy({
      targets: [
        { src: "README.md", dest: "dist" },
        { src: "package.json", dest: "dist" },
      ],
    }),
    // 生产环境压缩代码
    process.env.NODE_ENV === "production" &&
      terser({
        mangle: false, // 不混淆变量名，便于调试
        compress: {
          drop_console: false, // 保留 console.log
        },
      }),
  ].filter(Boolean),
// 外部依赖 - 不打包进 bundle
  external: ["blessed", "blessed-contrib", "systeminformation"],
};
