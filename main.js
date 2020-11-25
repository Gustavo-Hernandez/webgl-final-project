let scene, camera, renderer, sun, spaceship, asteroid;
let t;
function init() {
  scene = new THREE.Scene();
  t = 0;
  //Model and material loaders.
  let objLoader = new THREE.OBJLoader();
  let mtlLoader = new THREE.MTLLoader();
  let textureLoader = new THREE.TextureLoader();
  const light = new THREE.AmbientLight(0x858585);
  //Create Camera: Parameters are:
  /*
   * FOV,
   * aspectRatio,
   * nearClipPlane,
   * farClipPlane
   */
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  //Implementing webgl renderer.
  renderer = new THREE.WebGLRenderer({ antialias: true });
  //Setup renderer width and height.
  renderer.setSize(window.innerWidth, window.innerHeight);

  //Adding our renderer to HTML code.
  document.body.appendChild(renderer.domElement);

  //Sun texture loading
  const sunTexture = textureLoader.load("textures/sun.jpg");
  const asteroidTexture = textureLoader.load("textures/asteroid.jpg");

  //Sphere Geometry and Material setup.
  //SphereGeometry Params: radius, widthSegments, heightSegments.
  const sphereGeometry = new THREE.SphereGeometry(5, 32, 32);
  const sphereMaterial = new THREE.MeshBasicMaterial({ map: sunTexture });

  //Spacechip model load.
  mtlLoader.load("materials/spaceship.mtl", (mtl) => {
    mtl.preload();
    objLoader.setMaterials(mtl);
    objLoader.load("models/spaceship.obj", (model) => {
      spaceship = model;
      spaceship.rotation.y = 59.68;
      spaceship.position.y = -5;
      spaceship.position.z = -12;
      scene.add(spaceship);
    });
  });

  //Asteroid model load.
  new THREE.OBJLoader().load("models/rock.obj", (object) => {
    object.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.material.map = asteroidTexture;
      }
    });
    object.position.x = -30;
    object.position.y = 15;
    object.position.z = -15;
    asteroid = object;
    scene.add(asteroid);
  });

  //Sun model creation.
  sun = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sun.position.x = 25;
  sun.position.y = 20;
  sun.position.z = -50;
  scene.add(sun);
  scene.add(light);
}

let asteroidVectorA = [0.05,-0.05];
let flip = true;

//Create loop to render the scene everytime screen is refreshed.
function animate() {
  requestAnimationFrame(animate);

  //Increase time.
  t += 0.01;

  sun.rotation.y += 0.01;

  if(asteroid){
    asteroid.rotation.x += 0.01
    asteroid.position.x += asteroidVectorA[0];
    asteroid.position.y += asteroidVectorA[1];
    if(flip){
      if(asteroid.position.x >= 30 || asteroid.position.y <= -15){
        flip = false;
        asteroid.position.x = 30;
        asteroid.position.y = 15;
        asteroidVectorA[0] = -((Math.random()/10)+0.1);
        asteroidVectorA[1] = -((Math.random()/10)+0.03);
      }
    }
    else{
      if(asteroid.position.x <= -30 || asteroid.position.y <= -15){
        flip = true;
        asteroid.position.x = -30;
        asteroid.position.y = 15;
        asteroidVectorA[0] = ((Math.random()/10)+0.1);
        asteroidVectorA[1] = -((Math.random()/10)+0.03);
      }
    }
  }

  //Apply sin(t) function to position in order to create an animation.
  if (spaceship) {
    spaceship.position.y += -0.01 * Math.sin(t - 0.32);
    spaceship.position.x += 0.07 * Math.sin(t + Math.PI / 2);
  }
  renderer.render(scene, camera);
}

//Windows resizing listener.
window.addEventListener("resize", onWindowResize, false);

// This function updates camera aspect and projection
// matrix, update renderer.
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

init();
animate();
