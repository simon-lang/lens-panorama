import Vue from 'vue'
import VueRouter, { Location, Route, RouteConfig } from 'vue-router'
import { makeHot, reload } from './util/hot-reload'

const appComponent = () => import('./components/app').then(({ AppComponent }) => AppComponent)
const splashComponent = () => import('./components/splash').then(({ SplashComponent }) => SplashComponent)
if (process.env.ENV === 'development' && module.hot) {
    const appModuleId = './components/app'
    makeHot(appModuleId, appComponent, module.hot.accept('./components/app', () => reload(appModuleId, (require('./components/app') as any).appComponent)))

    const splashModuleId = './components/splash'
    makeHot(splashModuleId, splashComponent, module.hot.accept('./components/splash', () => reload(splashModuleId, (require('./components/splash') as any).splashComponent)))
}

Vue.use(VueRouter)

export const createRoutes: () => RouteConfig[] = () => [
    {
        path: '/',
        component: splashComponent
    },
    {
        path: '/app',
        component: appComponent
    },
]

export const createRouter = () => new VueRouter({
    mode: 'history',
    routes: createRoutes()
})
