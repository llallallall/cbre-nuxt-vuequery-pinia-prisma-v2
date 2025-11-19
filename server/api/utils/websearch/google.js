export default function () {
        return new Promise((resolve, reject) => {
                const apiKey = 'AIzaSyDH8eL2szZ_IwFUDBl2D75C6tJt3rZBFr4'
                const link =
                        'https://maps.googleapis.com/maps/api/js?key=' +
                        apiKey +
                        '&callback=initGoogle' +
                        '&region=KR' +
                        '&language=en' +
                        '&libraries=places'

                //console.log(link)
                let googleScript = document.querySelector(
                        `script[src="${link}"]`
                )

                if (!googleScript) {
                        googleScript = document.createElement('script')
                        googleScript.src = link
                        googleScript.async = true
                        document.head.append(googleScript)

                        let googleInitScript = document.createElement('script')
                        let funcText = document.createTextNode(
                                'function initGoogle(){}'
                        )
                        googleInitScript.appendChild(funcText)
                        document.head.appendChild(googleInitScript)

                        googleScript.addEventListener('error', () => {
                                reject()
                        })

                        googleScript.addEventListener('load', () => {
                                resolve()
                        })
                }
        })
}
