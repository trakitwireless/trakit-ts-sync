import typescript from 'rollup-plugin-typescript2';
import terser from '@rollup/plugin-terser';
//import json from '@rollup/plugin-json';

const obfuscate = {
	ecma: 2020,
	// sourceMap: {
	//   filename: '_publish/trakit-sync-worker.min.js',
	// },
	compress: {
		drop_console: !true,
		drop_debugger: !true,
		hoist_funs: true,
		module: true,
		toplevel: true,
	},
	mangle: {
		properties: {
			regex: /^[#_]/,
		}
	}
	//format: {
	//	semicolons: false,
	//},
};

export default [
	{
		input: './sync/index.ts',
		output: [
			{
				file: '_publish/trakit-sync.min.js',
				format: 'es',
				exports: 'named',
				plugins: [terser(obfuscate)]
			}
		],
		plugins: [
			//json(),
			typescript({
				tsconfig: './tsconfig.json',
				//tsconfigOverride: {
				//	compilerOptions: {
				//		declaration: false,
				//	}
				//}
			})
		],
		external: [
			'@trakit/objects',
			'@trakit/commands',
		],
	}
];