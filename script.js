// Get video feed from back camera
const video = document.createElement('video')
video.setAttribute('autoplay', '')
video.setAttribute('playsinline', '')
document.body.appendChild(video)

navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
  .then((stream) => {
    video.srcObject = stream
    video.play()
  })
  .catch((err) => {
    console.error('Failed to get user media', err)
  })

function getDistanceFromLatLonInMeters (lat1, lon1, lat2, lon2) {
  const earthRadius = 6371000 // Radius of the earth in meters
  const dLat = deg2rad(lat2 - lat1) // deg2rad below
  const dLon = deg2rad(lon2 - lon1)
  const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = earthRadius * c // Distance in meters
  return distance
}

function deg2rad (deg) {
  return deg * (Math.PI / 180)
}

AFRAME.registerComponent('location-based-ar', {
  init: function () {
    navigator.geolocation.watchPosition((position) => {
      const latitude = position.coords.latitude
      const longitude = position.coords.longitude
      const altitude = position.coords.altitude || 0

      // Calculate distance between current location and target location
      const targetLatitude = -21.2665809
      const targetLongitude = -48.5037126
      const distance = getDistanceFromLatLonInMeters(latitude, longitude, targetLatitude, targetLongitude)

      const maxDistance = 100 // In meters
      const image = document.querySelector('#my-image')

      if (distance <= maxDistance) {
        image.classList.add('visible')
      } else {
        image.classList.remove('visible')
      }
    })
  }
})

const scene = document.querySelector('a-scene')
const image = document.querySelector('#my-image')
image.addEventListener('load', () => {
  image.classList.add('loaded')
  image.classList.remove('hidden')
  scene.setAttribute('location-based-ar', '')
})
