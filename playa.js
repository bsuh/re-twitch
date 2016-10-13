(function (Twitch, Hls) {

  const video = document.getElementById('video')
  const container = document.getElementById('container')
  let hls

  if (Hls.isSupported()) {
    document.getElementById('browser_warning').style.display = 'none'
  } else {
    document.getElementById('form').style.display = 'none'
  }

  const loadStream = () => {
    container.style.display = 'none'
    document.getElementById('offline_warning').style.display = 'none'

    if (hls) {
      hls.destroy();
      if (hls.bufferTimer) {
        clearInterval(hls.bufferTimer)
        hls.bufferTimer = undefined
      }
    }

    hls = new Hls()
    hls.attachMedia(video)
    hls.on(Hls.Events.MEDIA_ATTACHED, () => {
      const stream = document.getElementById('stream_name').value
      Twitch.getStreamUrl(stream).
        then((url) => {
          hls.loadSource(url)
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            container.style.display = 'block'
            video.play()
            document.getElementById('chat_iframe').src = `https://www.twitch.tv/${stream}/chat`
          })
        }, () => {
          document.getElementById('offline_warning').style.display = 'block'
        })
    })
  }

  window.Playa = {
    loadStream
  }

})(window.Twitch, window.Hls);
