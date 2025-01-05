export default {
  '*.{ts,tsx}': (stagedFiles) => [
    `prettier --write ${stagedFiles.join(' ')}`,
    'npm run lint',
    'npm run lint:types',
    'npm run test',
  ],
  '*.js': (stagedFiles) => [
    `prettier --write ${stagedFiles.join(' ')}`,
    'eslint .',
  ],
};
