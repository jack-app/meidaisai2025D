const host = new URL(location.href).host

const isDev = 
       host.startsWith('localhost') 
    || host.startsWith('127.0.0.1') 
    || host.startsWith('::1')

if (isDev) {
    console.log('開発環境')
}

const config = isDev ? {
// 開発環境の場合
apiEndpoint: new URL('http://127.0.0.1:5001/metype-ffe25/asia-northeast1/appFunction')
} : {
// 本番環境の場合
apiEndpoint: new URL('https://metype-ffe25.web.app/')
}

console.log(config)

export default config