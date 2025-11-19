// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
        modules: [
                'nuxt-icon',
                '@nuxtjs/tailwindcss',
                '@pinia/nuxt',
                '@sidebase/nuxt-auth',
                'nuxt-headlessui',
                'nuxt-mapbox',
                "@vue-final-modal/nuxt"
        ],
        //css: ['vue-final-modal/style.css'],
        auth: {
                origin: 'https://cbre-korea.onrender.com/',
                //origin: 'http://localhost:3000',
                url: 'https://cbre-korea.onrender.com/',
                baseURL: '/api/auth',
                provider: {
                        type: 'authjs',
                },
        },
        app: {
                head: {
                        charset: 'utf-8',
                        viewport: 'width=device-width, initial-scale=1',
                        script: [],
                        link: [
                                {
                                        rel: 'stylesheet',
                                        href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css',
                                },
                        ],
                },
                pageTransition: { name: 'page', mode: 'out-in' },
        },
        runtimeConfig: {
                MINIO_SERVER_URL: process.env.MINIO_SERVER_URL,
                MINIO_SERVER_PORT: Number(process.env.MINIO_SERVER_PORT),
                MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
                MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,

                githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
                authSecret: process.env.AUTH_SECRET,
                API_ROUTE_SECRET: process.env.API_ROUTE_SECRET,

                public: {
                        githubClientID: process.env.GITHUB_CLIENT_ID,
                        googleApiToken: process.env.GOOGLE_API_TOKEN,
                        kakaoLocalApiToken: process.env.KAKAO_LOCAL_API_TOKEN,
                },
        },
        build: {
                transpile: [/echarts/, /resize-detector/, /tslib/, /xlsx/, /vue3-table-lite/, /vue3-pdf-app/],
        },
        vite: {
                ssr: {
                        noExternal: [
                                'vue3-pdf-app',
                        ],
                },
        },
        mapbox: {
                accessToken: process.env.MAPBOX_ACCESS_TOKEN,
        },
        headlessui: {
                prefix: 'Headless',
        },
        devtools: { enabled: false },
        css: [
                '/assets/css/mosha-vue-toastify.css',
        ]
})