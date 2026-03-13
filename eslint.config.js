import daStyle from 'eslint-config-dicodingacademy';

export default [
  {
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
  },
  {
    ignores: ['node_modules', 'dist', 'build', 'vite.config.js'],
  },
  daStyle,
];
