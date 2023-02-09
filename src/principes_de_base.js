import * as THREE from 'three';

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({canvas});

  const rtWidth = 512;
  const rtHeight = 512;
  const renderTarget = new THREE.WebGLRenderTarget(rtWidth, rtHeight, {
    depthBuffer : true,
    stencilBuffer: true,
  });

  const rtFov = 75;
  const rtAspect = rtWidth/rtHeight;
  const rtNear = 0.1;
  const rtFar = 50;
  const rtCamera = new THREE.PerspectiveCamera(rtFov, rtAspect, rtNear, rtFar);
  rtCamera.position.z = 3;

  const rtScene = new THREE.Scene();
  rtScene.background = new THREE.Color('#97D8B2');
  
  {
    const rtColor = 0xAAAAAA;
    const rtIntensity = 4;
    const rtLight = new THREE.DirectionalLight(rtColor, rtIntensity);
    rtLight.position.set(-1, 2, 4);
    rtScene.add(rtLight);
  }



  const fov = 75;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 5;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.z = 2;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#170312');

  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    scene.add(light);
  }

  const shape = new THREE.Shape();
  const x = -2.5;
  const y = -5;
  shape.moveTo(x + 2.5, y + 2.5);
  shape.bezierCurveTo(x + 2.5, y + 2.5, x + 2, y, x, y);
  shape.bezierCurveTo(x - 3, y, x - 3, y + 3.5, x - 3, y + 3.5);
  shape.bezierCurveTo(x - 3, y + 5.5, x - 1.5, y + 7.7, x + 2.5, y + 9.5);
  shape.bezierCurveTo(x + 6, y + 7.7, x + 8, y + 4.5, x + 8, y + 3.5);
  shape.bezierCurveTo(x + 8, y + 3.5, x + 8, y, x + 5, y);
  shape.bezierCurveTo(x + 3.5, y, x + 2.5, y + 2.5, x + 2.5, y + 2.5);

  const extrudeSettings = {
    steps: 2,  // ui: steps
    depth: 2,  // ui: depth
    bevelEnabled: true,  // ui: bevelEnabled
    bevelThickness: 1,  // ui: bevelThickness
    bevelSize: 1,  // ui: bevelSize
    bevelSegments: 2,  // ui: bevelSegments
  };

  const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
  
  const boxWidth = 1;
  const boxHeight = 1;
  const boxDepth = 1;
  const cubeGeometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

  function makeInstance(scene, geometry, color, x, z) {
    const material = new THREE.MeshPhongMaterial({color});

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    cube.position.x = x;
    cube.position.z = z;

    return cube;
  }

  const rtCubes = [
    makeInstance(rtScene, geometry, '#531253',  0, -15),
    makeInstance(rtScene, cubeGeometry, '#531253', -2, 0),
    makeInstance(rtScene, cubeGeometry, '#531253',  2, 0),
  ];

  const material = new THREE.MeshPhongMaterial({map: renderTarget.texture,});
  const cube = new THREE.Mesh(cubeGeometry, material);
  scene.add(cube);
  
  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const pixelRatio = window.devicePixelRatio;
    const width  = canvas.clientWidth  * pixelRatio | 0;
    const height = canvas.clientHeight * pixelRatio | 0;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render(time) {
    time *= 0.001;  // convert time to seconds

    rtCubes.forEach((cube, ndx) => {
      const speed = 1 + ndx * .1;
      const rot = time * speed;
      cube.rotation.x = rot;
      cube.rotation.y = rot;
    });

    if (resizeRendererToDisplaySize(renderer)){
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth/canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    renderer.setRenderTarget(renderTarget);
    renderer.render(rtScene, rtCamera);
    renderer.setRenderTarget(null);

    

    cube.rotation.x = time;
    cube.rotation.y = time * 1.1;
    
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

}

/* global Split */

// This code is only related to handling the split.
// Our three.js code has not changed
Split(['#view', '#controls'], {  // eslint-disable-line new-cap
  sizes: [75, 25],
  minSize: 20,
  elementStyle: (dimension, size, gutterSize) => {
    return {
      'flex-basis': `calc(${size}% - ${gutterSize}px)`,
    };
  },
  gutterStyle: (dimension, gutterSize) => {
    return {
      'flex-basis': `${gutterSize}px`,
    };
  },
});

main();
