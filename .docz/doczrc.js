export default {
  title: "Unikit",
  native: true,
  files: "src/**/*.{md,markdown,mdx}",
  menu: ["Getting Started", "Primitives", "UI"],
  codeSandbox: false,
  notUseSpecifiers: true,
  filterComponents: files =>
    files.filter(filepath => /\/[\w]*\.(js|jsx|ts|tsx)$/.test(filepath))
};
