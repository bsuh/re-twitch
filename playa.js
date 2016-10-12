(function (Twitch, Hls) {

  const video = document.getElementById('video')
  let hls

  if (Hls.isSupported()) {
    document.getElementById('browser_warning').style.display = 'none'
  } else {
    document.getElementById('form').style.display = 'none'
  }

  const loadStream = () => {
    video.style.display = 'none'
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
      Twitch.getStreamUrl(document.getElementById('stream_name').value).
        then((url) => {
          hls.loadSource(url)
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            video.style.display = 'block'
            video.play()
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
