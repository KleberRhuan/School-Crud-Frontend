import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'

export default [
  {
    ignores: ['dist', 'node_modules', 'cypress', 'build', '*.config.js', '*.config.ts']
  },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
      parser: tsparser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      '@typescript-eslint': tseslint,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      
      // === REGRAS DE REFATORAÇÃO (PROGRESSIVAS) ===
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true }
      ],
      
      // Complexidade e tamanho de funções (warnings para implementação gradual)
      'complexity': ['warn', { max: 15 }], // Mais permissivo inicialmente
      'max-lines-per-function': ['warn', { max: 150, skipBlankLines: true, skipComments: true }],
      'max-params': ['warn', { max: 6 }],
      'max-depth': ['warn', { max: 5 }],
      'max-statements': ['warn', { max: 25 }],
      
      // TypeScript específico
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      
      // Práticas de código limpo
      'prefer-const': 'error',
      'no-var': 'error',
      'no-duplicate-imports': 'error',
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-template': 'warn',
      'object-shorthand': 'warn',
      'prefer-destructuring': ['warn', { object: true, array: false }],
      
      // Convenções de nomenclatura (warnings)
      '@typescript-eslint/naming-convention': [
        'warn',
        {
          selector: 'variableLike',
          format: ['camelCase', 'PascalCase', 'UPPER_CASE']
        },
        {
          selector: 'function',
          format: ['camelCase', 'PascalCase'] // Permitir PascalCase para React components
        },
        {
          selector: 'class',
          format: ['PascalCase']
        },
        {
          selector: 'interface',
          format: ['PascalCase']
        },
        {
          selector: 'typeAlias',
          format: ['PascalCase']
        }
      ],
      
      // Estrutura e organização (warnings)
      'sort-imports': ['warn', { 
        ignoreCase: true, 
        ignoreDeclarationSort: true,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single']
      }],
      
      // React específico
      'react-hooks/exhaustive-deps': 'warn',
      
      // Prevenção de más práticas (mais permissivo)
      'no-magic-numbers': ['warn', { 
        ignore: [-1, 0, 1, 2, 3, 4, 5, 8, 10, 20, 50, 100], 
        ignoreArrayIndexes: true,
        enforceConst: true,
        ignoreDefaultValues: true
      }],
      'no-nested-ternary': 'warn',
      'no-else-return': 'warn',
      
      // Performance
      'prefer-spread': 'warn',
      'prefer-rest-params': 'warn',
      
      // Permitir undefined no global para testes
      'no-undef': 'off' // TypeScript já faz essa verificação
    }
  },
  // Configuração específica para arquivos de teste
  {
    files: ['**/*.test.{ts,tsx}', '**/*.spec.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-magic-numbers': 'off',
      'max-lines-per-function': 'off',
      'complexity': 'off',
      'max-statements': 'off'
    }
  },
  // Configuração para arquivos de configuração
  {
    files: ['*.config.{js,ts}', 'vite.config.ts', 'src/setupTests.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-magic-numbers': 'off',
      '@typescript-eslint/naming-convention': 'off'
    }
  }
] 