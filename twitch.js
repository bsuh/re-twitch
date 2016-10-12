(function () {

  const get = url => {
    return new Promise((resolve, reject) => {
      var request = new XMLHttpRequest()
      request.open('GET', url, true)

      request.onload = () => {
        if (request.status >= 200 && request.status < 400) {
          let data
          try {
            data = JSON.parse(request.responseText)
          } catch (e) {
            data = request.responseText
          }

          resolve(data)
        } else {
          reject()
        }
      }

      request.onerror = reject

      request.send()
    })
  }

  const getCORS = url => {
    return get(`https://cors-anywhere.herokuapp.com/${url}`)
  }

  const getClientId = () => {
    return get('https://player.twitch.tv/js/player.js').
      then(data => /{"Client-ID":"(.+?)"}/.exec(data)[1])
  }

  const getAccessToken = (clientId, stream) => {
    return getCORS(`https://api.twitch.tv/api/channels/${stream}/access_token?adblock=true&need_https=true&platform=web&player_type=site&client_id=${clientId}`)
  }

  const getMasterPlaylist = (clientId, stream, accessToken) => {
    const {sig, token} = accessToken
    const random = Math.floor(Math.random()*90000) + 10000
    return getCORS(`https://usher.ttvnw.net/api/channel/hls/${stream.toLowerCase()}.m3u8?token=${token}&sig=${sig}&allow_source=true&allow_spectre=true&player_backend=html5&p=${random}&expgroup=regular&baking_bread=false`)
  }

  const parseSourcePlaylist = masterPlaylist => {
    return /^[^#].+$/m.exec(masterPlaylist)[0]
  }

  const getStreamUrl = stream => {
    return getClientId().then(clientId => {
      return getAccessToken(clientId, stream).then(accessToken => {
        return getMasterPlaylist(clientId, stream, accessToken)
          .then(parseSourcePlaylist)
      })
    })
  }

  window.Twitch = {
    getClientId,
    getAccessToken,
    getMasterPlaylist,
    getStreamUrl
  }

})()
