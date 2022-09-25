module.exports = {
  extends: ["next", "turbo", "prettier", "plugin:nestjs/recommended"],
  plugins: ["nestjs"],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
    "react/jsx-key": "off",
  },
};
