module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    semi: [2, "always"],
    quotes: [2, "double"],
    "indent": [2, 4],
    "no-new": 0
  },
  globals: {
    "it": true,
    "describe": true,
    "context": true,
    "expect": true,
    "Phaser": true
  }
}
