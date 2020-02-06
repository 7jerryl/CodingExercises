module.exports = {
  mode: 'production',
  entry: {
    entry: `${__dirname}/registrationInterface.jsx`,
  },
  output: {
    path: __dirname,
    filename: 'app-bundle.js',
  },
  watch: true,
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-react'],
            },
          },
        ],
      },
    ],
  },
};
