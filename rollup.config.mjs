import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';
import svg from 'rollup-plugin-svg-import';
import copy from 'rollup-plugin-copy'

import packageJson from './package.json' assert { type: 'json' };

const plugins = [
  peerDepsExternal(),
  resolve(),
  commonjs(),
  // terser(),
  postcss(),
  svg({
    /**
     * If `true`, instructs the plugin to import an SVG as string.
     * For example, for Server Side Rendering.
     * Otherwise, the plugin imports SVG as DOM node.
     */
    stringify: false
  }),
];

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        dir: 'dist/cjs',
        format: 'cjs',
        sourcemap: true,
        preserveModules: true,
        preserveModulesRoot: 'src',
      }
    ],
    plugins: plugins.concat(
      [
        typescript({
          tsconfig: './tsconfig.rollup.json',
          declarationDir: 'dist/cjs'
        })
      ]
    ),
  },
  {
    input: 'src/index.ts',
    output: [
      {
        dir: 'dist/esm',
        format: 'esm',
        sourcemap: true,
        preserveModules: true,
        preserveModulesRoot: 'src',
      },
    ],
    plugins: plugins.concat(
      [
        typescript({
          tsconfig: './tsconfig.rollup.json',
          declarationDir: 'dist/esm',
        })
      ],
      copy({
        // copy json directory
        targets: [
          { src: 'src/json/emoji-datasource-light.json', dest: 'dist/json' },
        ]
      })
    ),
  },
];
