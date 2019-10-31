import router from './router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { MessageBox } from 'element-ui'
import { Route } from 'vue-router'

NProgress.configure({ showSpinner: false })

router.beforeEach(async(to: Route, _: Route, next: any) => {
  // Start progress bar
  NProgress.start()
  next()
  // Determine whether the user has logged in
})

router.afterEach((to: Route) => {
  // Finish progress bar
  NProgress.done()
})
