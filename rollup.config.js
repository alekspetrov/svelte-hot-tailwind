import svelte from 'rollup-plugin-svelte-hot'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'
import hmr from 'rollup-plugin-hot'
import analyze from 'rollup-plugin-analyzer'
// import html from '@rollup/plugin-html'
import sveltePreprocess from 'svelte-preprocess'
import postcss from 'rollup-plugin-postcss'
import { pathToFileURL } from 'url'
import path from 'path'

// Set this to true to pass the --single flag to sirv (this serves your
// index.html for any unmatched route, which is a requirement for SPA
// routers using History API / pushState)
//
// NOTE This will have no effect when running with Nollup. For Nollup, you'd
// have to add the --history-api-fallback yourself in your package.json
// scripts (see: https://github.com/PepsRyuu/nollup/#nollup-options)
//
const spa = false

// NOTE The NOLLUP env variable is picked by various HMR plugins to switch
// in compat mode. You should not change its name (and set the env variable
// yourself if you launch nollup with custom comands).
const nollup = !!process.env.NOLLUP
const watch = !!process.env.ROLLUP_WATCH
const useLiveReload = !!process.env.LIVERELOAD

const dev = watch || useLiveReload
const production = !dev

const hot = watch && !useLiveReload

export default {
  input: 'src/main.js',
  output: {
    sourcemap: dev,
    format: 'iife',
    name: 'app',
    file: 'public/build/bundle.js'
  },
  plugins: [
    svelte({
      preprocess: sveltePreprocess({ postcss: true }),
      // Enable run-time checks when not in production
      dev: !production,
      // We'll extract any component CSS out into a separate file — better for
      // performance
      // NOTE when hot option is enabled, this gets automatically be turned to
      // false because CSS extraction doesn't work with HMR currently
      css: css => {
        css.write('public/build/bundle.css')
      },
      hot: hot && {
        // Optimistic will try to recover from runtime
        // errors during component init
        optimistic: true,
        // Turn on to disable preservation of local component
        // state -- i.e. non exported `let` variables
        noPreserveState: false

        // See docs of rollup-plugin-svelte-hot for all available options:

        // https://github.com/rixo/rollup-plugin-svelte-hot#usage
      }
    }),
    postcss({
      modules: true,
      extract: true,
      extract: path.resolve('public/build/utils.css')
    }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration —
    // consult the documentation for details:
    // https://github.com/rollup/rollup-plugin-commonjs
    resolve({
      browser: true,
      dedupe: ['svelte']
    }),
    commonjs(),

    // In dev mode, call `npm run start:dev` once
    // the bundle has been generated
    dev && !nollup && serve(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    useLiveReload && livereload('public'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),

    hmr({
      public: 'public',
      inMemory: true,
      // This is needed, otherwise Terser (in npm run build) chokes
      // on import.meta. With this option, the plugin will replace
      // import.meta.hot in your code with module.hot, and will do
      // nothing else.
      compatModuleHot: !hot
    }),

    production && analyze()

    // Generate index.html
    // html({
    //   // HTML attrs lang, link, script
    //   attributes: {
    //     html: { lang: 'ru' }
    //   },
    //   // All the meta info comes here
    //   meta: [{ description: 'Some description...' }],
    //   // Document title
    //   title: 'Hello World',
    //   // PublicPath default: ''
    //   publicPath: ''
    //   // Template function
    // })
  ],
  watch: {
    clearScreen: false
  }
}

function serve() {
  let started = false
  return {
    name: 'svelte/template:serve',
    writeBundle() {
      if (!started) {
        started = true
        const flags = ['run', 'start', '--', '--dev']
        if (spa) {
          flags.push('--single')
        }
        require('child_process').spawn('npm', flags, {
          stdio: ['ignore', 'inherit', 'inherit'],
          shell: true
        })
      }
    }
  }
}
