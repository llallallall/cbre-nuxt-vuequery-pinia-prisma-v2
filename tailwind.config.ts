/** @type {import('tailwindcss').Config} */
export default {
        content: [
                `./**/components/**/*.{vue,js,ts}`,
                `./**/layouts/**/*.vue`,
                `./**/pages/**/*.vue`,
                `./**/composables/**/*.{js,ts}`,
                `./**/plugins/**/*.{js,ts}`,
                `./**/utils/**/*.{js,ts}`,
                './App.{js,ts,vue}',
                `./app.{js,ts,vue}`,
                `./Error.{js,ts,vue}`,
                `./error.{js,ts,vue}`,
                `./app.config.{js,ts}`,
                './tailwind-theme.js',
        ],
        theme: {
                extend: {
                        colors: {
                                primary: '#003F2D',
                                accent: '#17E88F',
                                dark: '#012A2D',
                                darkgray: '#435254',
                                lightgray: '#CAD1D3',
                                darkgreen: '#032a2d',

                                kakao: '#ffe945',
                                tag: '#1B74E4',

                                cbre_primary_1: '#003f2d', //'deep-teal',
                                cbre_primary_2: '#17E88F', //'mountain-meadow',
                                cbre_primary_3: '#012A2D', //'daintree',
                                cbre_primary_4: '#435254', //'river-bed',
                                cbre_primary_5: '#CAD1D3', //'tiara',
                                cbre_primary_6: '#DADFE0', //'iron',
                                cbre_secondary_1: '#032842', //'blue-whale',
                                cbre_secondary_2: '#538184', //'smalt-blue',
                                cbre_secondary_3: '#80BBAD', //'gulf-stream',
                                cbre_secondary_4: '#DBD99A', //'deco',
                                cbre_secondary_5: '#7F8480', //'xanadu',
                                cbre_secondary_light_1: '#778F9C', //'gothic',
                                cbre_secondary_light_2: '#96B3B6', //'gull-gray',
                                cbre_secondary_light_3: '#C0D4CB', //'conch',
                                cbre_secondary_light_4: '#EFECD2', //'aths-special',
                                cbre_secondary_light_5: '#CBDDC8', //'sea-mist',
                                cbre_system_1: '#000000', //'black',
                                cbre_system_2: '#1A1A1A', //'cod-gray',
                                cbre_system_3: '#333333', //'mine-shaft',
                                cbre_system_4: '#4D4D4D', //'tundora',
                                cbre_system_5: '#666666', //'dove-gray',
                                cbre_system_6: '#808080', //'gray',
                                cbre_system_7: '#999999', //'dusty-gray',
                                cbre_system_8: '#B3B3B3', //'nobel',
                                cbre_system_9: '#CCCCCC', //'silver',
                                cbre_system_10: '#E6E6E6', //'mercury',
                                cbre_system_11: '#FFFFFF', //'white',
                                cbre_system_12: '#E81717', //'alizarin-crimson',
                                cbre_system_13: '#F1D230', //'golden-dream',
                                cbre_system_14: '#E6EAEA', //'porcelain',
                        },
                        zIndex: {
                                100: '100',
                        },
                        animation: {
                                slideHideToRight:
                                        'slideHideToRight 0.5s ease-in-out forwards',
                                slideShowFromRight:
                                        'slideShowFromRight 0.5s ease-in-out forwards',
                                slideHideToTop:
                                        'slideHideToTop 0.5s ease-in-out forwards',
                                slideShowFromTop:
                                        'slideShowFromTop 0.5s ease-in-out forwards',
                        },
                        keyframes: {
                                slideHideToRight: {
                                        '0%': { right: '0px' },
                                        '100%': { right: '-400px' },
                                },
                                slideShowFromRight: {
                                        '0%': { right: '-400px' },
                                        '100%': { right: '0px' },
                                },
                                slideHideToTop: {
                                        '0%': {
                                                top: '80px',
                                                opacity: 1,
                                        },
                                        '100%': {
                                                top: '-1000px',
                                                opacity: 0,
                                        },
                                },
                                slideShowFromTop: {
                                        '0%': {
                                                top: '-1000px',
                                                opacity: 0,
                                        },
                                        '100%': {
                                                top: '80px',
                                                opacity: 1,
                                        },
                                },
                        },
                        fontFamily: {
                                // 1. 기본 'sans'를 사용자 정의 폰트로 시작하도록 확장
                                sans: ['notoSans', 'ui-sans-serif', 'system-ui',],

                                // 2. 사용자 정의 폰트 이름은 그대로 유지
                                primary: ['barlow', 'financier', 'calibre'],
                                barlow: ['barlow'],

                                mono: ['spaceMono'],

                                barlowBlack: 'barlow-black',
                                barlowExtraBold: 'barlow-extrabold',
                                barlowBold: 'barlow-bold',
                                barlowMedium: 'barlow-medium',
                                barlowLight: 'barlow-light',
                                barlowExtraLight: 'barlow-extralight',
                                barlowThin: 'barlow-thin',
                                financier: ['financier'],
                                financierSemibold: ['financier-semibold'],
                                financierMedium: ['financier-medium'],
                                calibre: ['calibre'],
                                calibreBold: ['calibre-bold'],
                                calibreSemiBold: ['calibre-semibold'],
                                calibreMedium: ['calibre-medium'],
                                calibreLight: ['calibre-light'],
                                notoSans: ['notoSans'],
                                notoSansBold: ['notoSans-bold'],
                                spaceMono: ['spaceMono'],
                                spaceMonoBold: ['spaceMono-bold'],
                        },
                },
                screens: {
                        '6xl': '3840px',
                        '5xl': '3440px',
                        '4xl': '2560px',
                        '3xl': '1920px',
                        '2xl': '1536px',
                        xl: '1280px',
                        lg: '1024px',
                        '2md': '860px',
                        md: '768px',
                        '2sm': '700px',
                        sm: '640px',
                        xs: '480px',
                        // => @media (min-width: 480px) { ... }
                        '2xs': '430px',
                        '3xs': '360px',
                        '4xs': '300px',
                        // => @media (min-width: 320px) { ... }
                },
        },
        variants: {
                extend: {
                        placeholder: ['focus'], // placeholder 관련 스타일을 focus 상태에서도 사용할 수 있게 해줍니다.
                },
        },
}
