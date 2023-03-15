const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = (env) => {
	const config = {
		entryFolder: "script",
		outputFilename: "script.js",
		configFile: "./tsconfig-script.json",
		includeFolder: "script",
	};

	if (env.target === "worker") {
		config.entryFolder = "worker";
		config.outputFilename = "worker.js";
		config.configFile = "./tsconfig-worker.json";
		config.includeFolder = "worker";
	}

	return {
		plugins: [new MiniCssExtractPlugin()],
		mode: "production",
		entry: path.resolve(__dirname, "src", config.entryFolder, "index.ts"),
		output: {
			path: path.resolve(__dirname, "public", "bundle"),
			filename: config.outputFilename,
		},
		resolve: {
			extensions: [".ts", ".tsx", ".js"],
			fallback: {
				path: false,
				fs: false,
			},
		},
		module: {
			rules: [
				{
					test: /\.(ts|js)?$/,
					include: [
						path.resolve(__dirname, "src", config.includeFolder),
					],
					exclude: /node_modules/,
					use: [
						{
							loader: "babel-loader",
						},
						{
							loader: "ts-loader",
							options: {
								configFile: path.resolve(config.configFile),
							},
						},
					],
				},
				{
					test: /\.scss$/,
					use: [
						MiniCssExtractPlugin.loader,
						"css-loader",
						"sass-loader",
					],
					exclude: /node_modules/,
					include: [
						path.resolve(__dirname, "src", config.includeFolder),
					],
				},
			],
		},
	};
};
