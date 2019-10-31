const path = require('path')
const watch = require('node-watch')
const dirTree = require('directory-tree')

// If your port is set to 80,
// use administrator privileges to execute the command line.
// For example, on Mac: sudo npm run / sudo yarn
const devServerPort = 3002 // TODO: get this variable from setting.ts
const mockServerPort = 3001 // TODO: get this variable from setting.ts
const name = '云音乐' // TODO: get this variable from setting.ts

const apis = []
const mockApiPath = path.join(__dirname, '/mock/api')
function recursivePath(list) {
  for (let i = 0; i < list.length; i++) {
    let path = list[i].path.replace(mockApiPath, '')
    if (path.endsWith('GET') ||
      path.endsWith('POST') ||
      path.endsWith('PUT') ||
      path.endsWith('OPTIONS') ||
      path.endsWith('DELETE') ||
      path.endsWith('PATCH') ||
      path.endsWith('HEAD')
    ) {
      path = new RegExp(path.replace(/#/g, '/').replace(/\/\//g, '/').replace(/\{[\w-]+\}/g, '[\\w-]+').replace(/\/(\w+)\/?$/, ':$1'))
      apis.push(path)
    } else if (list[i].children && list[i].children.length) {
      recursivePath(list[i].children)
    }
  }
}
function updateMockApi() {
  const tree = dirTree(mockApiPath)
  if (tree && tree.children && tree.children.length) {
    recursivePath(tree.children)
  }
}
if (process.env.SCRIPT_ENV === 'serve') {
  updateMockApi()

  watch(mockApiPath, {
    recursive: true
  }, function(evt, name) {
    apis.length = 0
    updateMockApi()
  })
}

module.exports = {
  publicPath: '',
  lintOnSave: true,
  productionSourceMap: false,
  devServer: {
    port: devServerPort,
    open: true,
    overlay: {
      warnings: false,
      errors: true
    },
    proxy: {
      // change xxx-api/login => /mock-api/v1/login
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      '/api': {
        target: `http://www.ly-dev.ymt360.com`,
        // target: `http://crm.ymt360.com`,
        router: function(req) {
          let url = req.url.replace(/\/$/, '')
          url = [url, req.method].join(':')
          for (var i = 0; i < apis.length; i++) {
            if (apis[i].test(url)) {
              return `http://localhost:${mockServerPort}`
            }
          }
          return `http://www.ly-dev.ymt360.com`
        },
        changeOrigin: true, // needed for virtual hosted sites
        // pathRewrite: {
        //   '^/api': ''
        // },
        ws: false // proxy websockets
      }
    }
  },
  // webpack配置
  configureWebpack: {
    performance: {
      maxEntrypointSize: 3072000,
      maxAssetSize: 3072000
    }
  },
  pwa: {
    name: name,
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: path.resolve(__dirname, 'src/pwa/service-worker.js')
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [
        path.resolve(__dirname, 'src/styles/_variables.less'),
        path.resolve(__dirname, 'src/styles/_mixins.less')
      ]
    }
  },
  chainWebpack(config) {
    // provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    config.set('name', name)

    // https://webpack.js.org/configuration/devtool/#development
    config
      .when(process.env.NODE_ENV === 'development',
        config => config.devtool('cheap-source-map')
      )

    config
      .when(process.env.NODE_ENV !== 'development',
        config => {
          config
            .optimization.splitChunks({
              chunks: 'all',
              cacheGroups: {
                libs: {
                  name: 'chunk-libs',
                  test: /[\\/]node_modules[\\/]/,
                  priority: 10,
                  chunks: 'initial' // only package third parties that are initially dependent
                },
                elementUI: {
                  name: 'chunk-elementUI', // split elementUI into a single package
                  priority: 20, // the weight needs to be larger than libs and app or it will be packaged into libs or app
                  test: /[\\/]node_modules[\\/]_?element-ui(.*)/ // in order to adapt to cnpm
                },
                commons: {
                  name: 'chunk-commons',
                  test: path.resolve(__dirname, 'src/components'),
                  minChunks: 3, //  minimum common number
                  priority: 5,
                  reuseExistingChunk: true
                }
              }
            })
          config.optimization.runtimeChunk('single')
        }
      )
  }
}
