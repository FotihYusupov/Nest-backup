export default {
  parser: '@typescript-eslint/parser',
  parser_options: {
    project: 'tsconfig.json',
    // eslint-disable-next-line no-undef
    tsconfig_root_dir: __dirname,
    source_type: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignore_patterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface_name_prefix': 'off',
    '@typescript-eslint/explicit_function_return_type': 'off',
    '@typescript-eslint/explicit_module_boundary_types': 'off',
    '@typescript-eslint/no_explicit_any': 'off',
    // 'prettier/prettier': ['error', {end_of_line: 'auto'}];
  },
};
