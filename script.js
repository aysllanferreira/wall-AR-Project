// Create video element for camera feed
const video = document.createElement('video')
video.setAttribute('autoplay', '')
video.setAttribute('playsinline', '')
document.body.appendChild(video)

// Get video feed from webcam
navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
  video.srcObject = stream
  video.play()
})

AFRAME.registerComponent('image-loader', {
  init: function () {
    this.el.addEventListener('loaded', () => {
      this.el.object3D.visible = false
    })
  }
})

AFRAME.registerComponent('location-based-ar', {
  init: function () {
    navigator.geolocation.watchPosition((position) => {
      const latitude = position.coords.latitude
      const longitude = position.coords.longitude
      const altitude = position.coords.altitude || 0

      const marker = document.querySelector('a-marker')
      const markerPosition = new THREE.Vector3(-21.2665809, altitude, -48.5037126)
      const worldPosition = ARjs.Helpers.getMarkerWorldPosition(marker.object3D, markerPosition)
      marker.object3D.position.set(worldPosition.x, worldPosition.y, worldPosition.z)

      const distance = ARjs.Helpers.distanceBetweenPoints(markerPosition, new THREE.Vector3(latitude, altitude, -longitude))
      const maxDistance = 0.05
      const image = document.querySelector('#my-image')

      if (distance <= maxDistance) {
        image.setAttribute('visible', 'true')
      } else {
        image.setAttribute('visible', 'false')
      }
    })
  }
})
