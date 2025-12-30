module.exports = {
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: true,
  clean: true,
  minify: true,
  treeshake: true,
  sourcemap: true,
  external: ["react", "react-dom"],
  outDir: "dist",
  banner: {
    js: '"use client";',
  },
};
