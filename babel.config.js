module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@': './src',
          assets: './assets',
        },
      },
    ],
    ["@babel/plugin-proposal-decorators", { "legacy": true }],
    'react-native-worklets/plugin',
  ],
};
