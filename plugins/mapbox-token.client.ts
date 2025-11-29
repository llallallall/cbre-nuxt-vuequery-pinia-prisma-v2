import mapboxgl from 'mapbox-gl'

export default defineNuxtPlugin((nuxtApp) => {
    const config = useRuntimeConfig()
    const token = config.public.mapbox.accessToken

    if (token) {
        mapboxgl.accessToken = token
        console.log('Mapbox token injected from runtime config')
    } else {
        console.warn('Mapbox token not found in runtime config')
    }
})
