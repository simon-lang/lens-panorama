import Vue from 'vue'
import VueRouter, { Location, Route, RouteConfig } from 'vue-router'
import { makeHot, reload } from './util/hot-reload'

const appComponent = () => import('./components/app').then(({ AppComponent }) => AppComponent)
const docsComponent = () => import('./components/docs').then(({ DocsComponent }) => DocsComponent)
const splashComponent = () => import('./components/splash').then(({ SplashComponent }) => SplashComponent)
const clientComponent = () => import('./components/client').then(({ ClientComponent }) => ClientComponent)
const queryComponent = () => import('./components/query').then(({ QueryComponent }) => QueryComponent)
if (process.env.ENV === 'development' && module.hot) {
    const appModuleId = './components/app'
    makeHot(appModuleId, appComponent, module.hot.accept('./components/app', () => reload(appModuleId, (require('./components/app') as any).appComponent)))

    const splashModuleId = './components/splash'
    makeHot(splashModuleId, splashComponent, module.hot.accept('./components/splash', () => reload(splashModuleId, (require('./components/splash') as any).splashComponent)))

    const clientModuleId = './components/client'
    makeHot(clientModuleId, clientComponent, module.hot.accept('./components/client', () => reload(clientModuleId, (require('./components/client') as any).clientComponent)))

    const queryModuleId = './components/query'
    makeHot(queryModuleId, queryComponent, module.hot.accept('./components/query', () => reload(queryModuleId, (require('./components/query') as any).queryComponent)))
}

Vue.use(VueRouter)

export const createRoutes: () => RouteConfig[] = () => [
    {
        path: '/',
        component: appComponent
    },
    {
        path: '/app',
        component: appComponent
    },
    {
        path: '/lens/app',
        component: appComponent
    },
    {
        path: '/docs',
        component: docsComponent
    },
]

export const createRouter = () => new VueRouter({
    mode: 'history',
    routes: createRoutes()
})
