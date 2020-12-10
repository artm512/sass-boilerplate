const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // Sass(SCSSファイル)をwebpackで取り込みつつ、cssファイルとして出力するプラグイン

// [定数] webpack の出力オプションを指定
// 'production' or 'development'
const MODE = "development";

// ソースマップの利用有無(productionのときはソースマップを利用しない)
const enabledSourceMap = MODE === "development";

// webpack-dev-serverを立ち上げた時のドキュメントルート
const outputPath = path.resolve(__dirname, 'pages');

module.exports = {
  // モード値を production に設定すると最適化された状態で、
  // development に設定するとソースマップ有効でJSファイルが出力される
  mode: MODE,

  // ローカル開発用環境を立ち上げる
  devServer: {
    contentBase: outputPath,
    open: true // 実行時にブラウザが自動的に localhost を開く
  },

  // メインとなるJavaScriptファイル（エントリーポイント）
  entry: "./src/index.js",
  // ファイルの出力設定
  output: {
    //  出力ファイルのディレクトリ名
    path: `${__dirname}/dist`,
    // 出力ファイル名
    filename: "index.js",
  },

  module: {
    // use配列で指定したLoaderが後ろから順番に適用される
    rules: [
      // Sassファイルの読み込み
      {
        // 対象となるファイルの拡張子
        test: /\.scss/,
        // ローダー名
        use: [
          {
            loader: MiniCssExtractPlugin.loader, // CSSを別ファイルとして書き出すオプションを有効にする。style-loaderと併用するとバンドル時にエラーになる。
          },
          {
            loader: "css-loader", // CSSをJSにバンドルする機能。css内のurl()メソッドや@import文をJavaScriptのrequire()メソッドに変換。webpackが画像も依存解決する。
            options: {
              // オプションでCSS内のurl()メソッドの取り込みを禁止する
              url: false,
              // ソースマップを有効にする
              sourceMap: enabledSourceMap,

              // 0 => no loaders (default);
              // 1 => postcss-loader;
              // 2 => postcss-loader, sass-loader
              importLoaders: 2
            }
          },
          {
            loader: "sass-loader", // sassをCSSに変換する機能。
            options: {
              // ソースマップの利用有無
              sourceMap: enabledSourceMap
            },
          },
        ]
      },
      {
        // 対象となるファイルの拡張子
        test: /\.(gif|png|jpg|eot|wof|woff|ttf|svg)$/,
        // 画像をBase64として取り込む
        type: "asset/inline", // webpack5からの機能。url-loaderを補完。
      },
    ]
  },
  // ES5(IE11等)向けの指定（webpack 5以上で必要）
  target: ["web", "es5"],

  plugins: [
    // CSSファイルを外だしにするプラグイン
    new MiniCssExtractPlugin({
      // ファイル名を設定
      filename: "style.css",
    }),
  ],
};