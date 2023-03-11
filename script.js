// Get video feed from webcam
const video = document.getElementById('video')
navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
  video.srcObject = stream
  video.play()
})

// Set up AR.js
const canvas = document.getElementById('canvas')
canvas.style.width = window.innerWidth + 'px'
canvas.style.height = window.innerHeight + 'px'
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(window.innerWidth, window.innerHeight)
const arToolkitSource = new THREEx.ArToolkitSource({ sourceElement: video, width: window.innerWidth, height: window.innerHeight })
arToolkitSource.init(() => {
  setTimeout(() => arToolkitSource.onResize(renderer.domElement), 1)
})
const arToolkitContext = new THREEx.ArToolkitContext({ cameraParametersUrl: './camera_para.dat', detectionMode: 'mono' })
arToolkitContext.init(() => {
  camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix())
})
const markerControls = new THREEx.ArMarkerControls(arToolkitContext, camera, { type: 'pattern', patternUrl: './pattern-teste (1).patt', changeMatrixMode: 'cameraTransformMatrix' })

// Create and position image on marker
const loader = new THREE.TextureLoader()
loader.load('./teste.jpeg', (texture) => {
  const geometry = new THREE.PlaneGeometry(1, 1)
  const material = new THREE.MeshBasicMaterial({ map: texture })
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(0, 0.5, 0) // Position the image on the marker
  markerRoot.add(mesh)
})

// Render
const scene = new THREE.Scene()
const camera = new THREE.Camera()
const markerRoot = new THREE.Group()
markerRoot.add(camera)
scene.add(markerRoot)
function render () {
  requestAnimationFrame(render)
  if (arToolkitSource.ready) {
    arToolkitContext.update(arToolkitSource.domElement)
    scene.visible = camera.visible
  }
  renderer.render(scene, camera)
}
render()
