// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import daStyle from 'eslint-config-dicodingacademy';

export default [{
  files: ['**/*.{js,jsx}'],
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
}, {
  ignores: ['node_modules', 'dist', 'build', 'vite.config.js'],
}, daStyle, ...storybook.configs["flat/recommended"]];
