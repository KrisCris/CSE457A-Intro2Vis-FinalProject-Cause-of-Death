import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import { resolve } from 'path';
import dsv from '@rollup/plugin-dsv';

export default ({ ...mode }) => {
  console.log(mode)
  return defineConfig({
    base: '',
    plugins: [
      vue(),
      dsv(),
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), 'src/assets/icons')],
        symbolId: 'icon-[dir]-[name]',
      }),
    ],
  })
}