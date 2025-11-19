export const mapStyleId: string = 'light-v11'
export const mapAccessToken: string = process.env.MAPBOX_ACCESS_TOKEN as string

export const mapCenter: [number, number] = [127.442, 35.787]
export const mapZoom: number = 6.4
export const maxZoom: number = 18
export const minZoom: number = 5
export const mapPitch: number = 10 // 0 - 85
export const mapBearing: number = 0 // 0 - 360

// add-3d-buildings
export const LAYER_3D_BUILDINGS = {
        id: 'add-3d-buildings',
        source: 'composite',
        sourceLayer: 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        minzoom: 15,
        paint: {
                'fill-extrusion-color': '#aaa',

                // Use an 'interpolate' expression to
                // add a smooth transition effect to
                // the buildings as the user zooms in.
                'fill-extrusion-height': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        15,
                        0,
                        15.05,
                        ['get', 'height'],
                ],
                'fill-extrusion-base': [
                        'interpolate',
                        ['linear'],
                        ['zoom'],
                        15,
                        0,
                        15.05,
                        ['get', 'min_height'],
                ],
                'fill-extrusion-opacity': 0.6,
        },
}

// Define the Layers
export const LAYER_CLUSTERS = {
        id: 'clusters',
        type: 'circle',
        source: 'cbre-assets',
        filter: ['has', 'point_count'],
        paint: {
                // Use step expressions (https://docs.mapbox.com/mapbox-gl-js/style-spec/#expressions-step)
                // with three steps to implement three types of circles:
                //   * Blue, 20px circles when point count is less than 100
                //   * Yellow, 30px circles when point count is between 100 and 750
                //   * Pink, 40px circles when point count is greater than or equal to 750
                'circle-color': [
                        'step',
                        ['get', 'point_count'],
                        '#17E88F',
                        10,
                        '#018e69',
                        20,
                        '#003F2D',
                ],
                'circle-radius': [
                        'step',
                        ['get', 'point_count'],
                        20, // size 1
                        10, // * step 1
                        30, // size 2
                        20, // * step 2
                        40, // size 3
                ],
                'circle-opacity': 0.5,
                'circle-stroke-width': 1,
                'circle-stroke-color': '#fff',
                'circle-stroke-opacity': 1,
        },
}

export const LAYER_CLUSTER_COUNT = {
        id: 'cluster-count',
        type: 'symbol',
        source: 'cbre-assets',
        filter: ['has', 'point_count'],
        layout: {
                'text-field': ['get', 'point_count_abbreviated'],
                'text-font': ['Arial Unicode MS Bold'],
                'text-size': 12,
        },
        paint: {
                'text-color': '#FFFFFF',
        },
}

export const LAYER_UNCLUSTERED_POINT = {
        id: 'unclustered-point',
        type: 'symbol',
        source: 'cbre-assets',
        filter: ['!', ['has', 'point_count']],
        layout: {
                'icon-image': 'pin',
                'icon-size': 0.7,
                'icon-anchor': 'bottom',
                'icon-ignore-placement': true,
                'icon-allow-overlap': true,
        },
        paint: {
                // 'circle-color': '#11b4da',
                // 'circle-radius': 4,
                // 'circle-stroke-width': 1,
                // 'circle-stroke-color': '#fff'
        },
}

export const MapStyle = [
        { name: 'Light', value: 'mapbox://styles/mapbox/light-v11' },
        { name: 'Dark', value: 'mapbox://styles/mapbox/dark-v11' },
        { name: 'Streets', value: 'mapbox://styles/mapbox/streets-v12' },
        { name: 'Outdoors', value: 'mapbox://styles/mapbox/outdoors-v12' },
        { name: 'Satellite', value: 'mapbox://styles/mapbox/satellite-v9' },
        {
                name: 'SatelliteStreets',
                value: 'mapbox://styles/mapbox/satellite-streets-v12',
        },
        {
                name: 'NavigationDay',
                value: 'mapbox://styles/mapbox/navigation-day-v1',
        },
        {
                name: 'NavigationNight',
                value: 'mapbox://styles/mapbox/navigation-night-v1',
        },
]

export const MapLang = [
        { name: 'English', value: 'en' },
        { name: 'Korean', value: 'ko' },
]

export const MapDefaultOptions = {
        MapStyle: MapStyle[0],
        MapLang: MapLang[0],
        MapRatio: 60,
        MapPitch: 10,
        MapBearing: 0,
}
