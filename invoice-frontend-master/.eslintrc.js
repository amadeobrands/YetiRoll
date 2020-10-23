module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'react', 'react-hooks'],
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier/@typescript-eslint',
        'plugin:prettier/recommended',
    ],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    rules: {
        'react/prop-types': 0,
        'react/display-name': 0,
        '@typescript-eslint/explicit-function-return-type': [
            'error',
            {
                allowExpressions: true,
            },
        ],
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/ban-ts-ignore': 0,
        '@typescript-eslint/ban-ts-comment': 0,
        '@typescript-eslint/no-empty-interface': 'warn',
        'react-hooks/rules-of-hooks': 'off',
        'react-hooks/exhaustive-deps': 'error',
    },
    overrides: [
        {
            files: ['styled.ts'],
            rules: {
                '@typescript-eslint/explicit-function-return-type': 0,
            },
        },
    ],
};
