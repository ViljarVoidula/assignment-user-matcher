import eslint from '@eslint/js';
import importX from 'eslint-plugin-import-x';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
    {
        ignores: [
            '**/coverage/**',
            '**/dist/**',
            '**/node_modules/**',
            '**/*.d.ts',
            '.agents/**',
            '.claude/**',
            '.codex/**',
            '.github/skills/**',
            '.impeccable/**',
            'docs/**',
            'example/**',
        ],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ['**/*.ts'],
        languageOptions: {
            globals: globals.node,
        },
        plugins: {
            'import-x': importX,
        },
        rules: {
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                { argsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_', varsIgnorePattern: '^_' },
            ],
            'import-x/first': 'error',
            'import-x/no-duplicates': 'warn',
            'import-x/no-self-import': 'error',
            'no-console': ['warn', { allow: ['info', 'warn', 'error'] }],
            'no-duplicate-imports': 'off',
            'no-empty': 'warn',
            'prefer-const': 'warn',
        },
    },
    {
        files: ['tests/**', '**/*.test.ts', 'benchmark-*.ts'],
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-expressions': 'off',
            '@typescript-eslint/ban-ts-comment': 'warn',
            '@typescript-eslint/no-require-imports': 'off',
            'no-console': 'off',
            'no-debugger': 'warn',
        },
    },
);
