const path = require('path')
/* 解析路径 上一级目录 */
const resolve = (dir) => {
  return path.join(__dirname, dir)
}

module.exports = {
  // 为我们提供运行环境，一个环境定义了一组预定义的全局变量
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  // 配置解析器支持的语法
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  // 一个配置文件可以被基础配置中的已启用的规则继承。
  extends: [
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended', //
  ],
  plugins: ['react', '@typescript-eslint', 'react-hooks', 'prettier'],
  settings: {
    react: {
      pragma: 'React',
      version: 'detect',
    },
  },
  // 自定义全局变量
  globals: {
    window: true,
    '@': true,
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          // ['@', resolve('.')],
          ['@src', resolve('src')],
          ['@pages', resolve('src/pages')],
          ['@models', resolve('src/models')],
          ['@components', resolve('src/components')],
          ['@utils', resolve('src/utils')],
          ['@i18n', resolve('src/i18n')],
          ['@icons', resolve('src/icons')],
          ['@common', resolve('src/common')],
          ['@assets', resolve('src/assets')],
          ['@hooks', resolve('src/hooks')],
        ],
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
      },
    },
  },
  // 0: off , 1: warn, 2: error , 复杂的 [level, options]
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/prop-types': 'off',
    // 'no-console': ['warn', {allow: ['warn', 'error']}],
    'no-console': 0,
    eqeqeq: ['warn', 'always'],
    'prefer-const': ['error', {destructuring: 'all', ignoreReadBeforeAssign: true}],
    '@typescript-eslint/explicit-function-return-type': 0, //都要定义return
    '@typescript-eslint/no-explicit-any': 0, // 参数类似为any的错误提示
    // '@typescript-eslint/no-unused-vars': 0, // 是否参数定义不使用
    '@typescript-eslint/interface-name-prefix': 0, // 接口名称前缀
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/no-triple-slash-reference': 0,
    '@typescript-eslint/no-var-requires': 0,
    '@typescript-eslint/ban-ts-ignore': 0,
    '@typescript-eslint/no-this-alias': 0,
    '@typescript-eslint/no-unused-vars': 2,
    '@typescript-eslint/triple-slash-reference': ['error', {path: 'always', types: 'never', lib: 'never'}],
    // React相关校验规则
    'react/jsx-indent': [2, 2], // 缩进 2
    'react/jsx-no-undef': [2, {allowGlobals: true}],
    'react/prop-types': 0, // prop 属性值的定义校验
    '@typescript-eslint/no-unused-vars': 0,
    'react/react-in-jsx-scope': 0, // 无需强制要import React
  },
}
