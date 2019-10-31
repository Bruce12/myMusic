import Vue, { DirectiveOptions } from 'vue'

import 'normalize.css'
import ElementUI from 'element-ui'

import '@/styles/element-variables.less'
import '@/styles/index.less'
// import * as filters from '@/filters'
import router from '@/router'
// import * as directives from '@/directives'
import App from '@/App.vue'
import '@/pwa/register-service-worker'
import '@/permission'

Vue.use(ElementUI)
// Register global directives
// Object.keys(directives).forEach(key => {
//   Vue.directive(key, (directives as { [key: string ]: DirectiveOptions })[key])
// })

// Register global filter functions
// Object.keys(filters).forEach(key => {
//   Vue.filter(key, (filters as { [key: string ]: Function })[key])
// })
Vue.config.productionTip = false

new Vue({
  router,
  render: (h) => h(App)
}).$mount('#app')
