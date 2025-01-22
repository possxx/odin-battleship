const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
	entry: {
		index: ['./src/styles.css', './src/index.js'],
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js',
		clean: true,
	},
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: [MiniCSSExtractPlugin.loader, 'css-loader'],
				exclude: /\.module\.css$/i,
			},
			{
				test: /\.css$/i,
				use: [
					MiniCSSExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1,
							modules: true,
						},
					},
				],
				include: /\.module\.css$/i,
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: 'asset/resource',
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: 'asset/resource',
			},
		],
	},
	plugins: [
		new HTMLWebpackPlugin({
			template: './src/index.html',
		}),
		new MiniCSSExtractPlugin({
			filename: 'styles.css',
		}),
	],
};
