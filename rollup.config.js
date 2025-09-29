import typescript from 'rollup-plugin-typescript2';
import terser from '@rollup/plugin-terser';

const obfuscate = {
	ecma: 2020,
	// compress: {
	//   drop_console: true,
	//   drop_debugger: true,
	//   hoist_funs: true,
	//   join_vars: true,
	//   module: true,
	//   toplevel: true,
	// },
	// sourceMap: {
	//   filename: '_publish/trakit-sync-worker.min.js',
	// },
	mangle: {
		properties: /^_/,
	}
};

export default [
	{
		input: 'index.ts',
		output: [
			{
				file: '_publish/trakit-sync.min.js',
				format: 'es',
				plugins: [terser(obfuscate)]
			}
		],
		plugins: [typescript()],
		external: ['@trakit/objects', '@trakit/commands']
	}
];