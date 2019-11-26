let container;
let renderer;
let camera;
let controls;
let scene;
let train;
let car;
let satte;
let trainBody;
let carBody;
let satteBody;
let smallWheelRear;
let smallWheelCenter;
let smallWheelFront;
let bigWheel;
let wheelRear;
let wheelFront;
let lightLeft;
let lightRight;
let trainStart = false;
let trainBack = false;
let trainChange = false;
let carStart = false;
let carBack = false;
let carChange = false;
let satteStart = false;
let satteBack = false;
let satteChange = false;


document.getElementById('sTrain').addEventListener('click', startTrain);
document.getElementById('bTrain').addEventListener('click', backTrain);
document.getElementById('cTrain').addEventListener('click', changeTrain);
document.getElementById('sCar').addEventListener('click', startCar);
document.getElementById('bCar').addEventListener('click', backCar);
document.getElementById('cCar').addEventListener('click', changeCar);
document.getElementById('fSatte').addEventListener('click', flySatte);
document.getElementById('bSatte').addEventListener('click', backSatte);
document.getElementById('cSatte').addEventListener('click', changeSatte);


function startTrain() {
    if (!trainStart) {
        trainStart = true;
        trainBack = false;
    } else if (trainStart) {
        trainStart = false;
    }
}

function backTrain() {
    if (!trainBack) {
        trainBack = true;
        trainStart = false;
    } else if (trainBack) {
        trainBack = false;
    }
}

function changeTrain() {
    if (!trainChange) {
        trainBody.color.setHex(0x990099);
        trainChange = true;
    } else {
        trainBody.color.setHex(0xff1100);
        trainChange = false;
    }
}

function startCar() {
    if (!carStart) {
        carStart = true;
        carBack = false;
    } else if (carStart) {
        carStart = false;
    }
}

function backCar() {
    if (!carBack) {
        carBack = true;
        carStart = false;
    } else if (carBack) {
        carBack = false;
    }
}

function changeCar() {
    if (!carChange) {
        carBody.color.setHex(0xe6e600);
        carChange = true;
    } else {
        carBody.color.setHex(0x11ff11);
        carChange = false;
    }
}

function flySatte() {
    if (!satteStart) {
        satteStart = true;
        satteBack = false;
    } else if (satteStart) {
        satteStart = false;
    }
}

function backSatte() {
    if (!satteBack) {
        satteBack = true;
        satteStart = false;
    } else if (satteBack) {
        satteBack = false;
    }
}

function changeSatte() {
    if (!satteChange) {
        satteBody.color.setHex(0x6600ff);
        satteChange = true;
    } else {
        satteBody.color.setHex(0x0000ff);
        satteChange = false;
    }
}

function init() {
    container = document.querySelector('#c');
    scene = new THREE.Scene();
    scene.background = new THREE.Color('black');

    createCamera();
    createControls();
    createLights();
    createTrain();
    createCar();
    createSatte();
    createRenderer();

    renderer.setAnimationLoop(() => {
        update();
        render();
    })
}

function createCamera() {
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 100);
    camera.position.set(-8, 5, 16);
}

function createControls() {
    controls = new THREE.OrbitControls(camera, container);
}

function createLights() {
    const ambientLight = new THREE.HemisphereLight(0xddeeff, 0x202020, 5);
    const mainLight = new THREE.DirectionalLight(0xffffff, 5);
    mainLight.position.set(10, 10, 10);
    scene.add(ambientLight, mainLight);
}

function createTrainMaterials() {
    trainBody = new THREE.MeshStandardMaterial({
        color: 0xff3333,
        flatShading: true,
    });

    trainBody.color.convertSRGBToLinear();

    const detail = new THREE.MeshStandardMaterial({
        color: 0x333333,
        flatShading: true,
    });

    detail.color.convertSRGBToLinear();

    return {
        trainBody,
        detail,
    };
}

function createTrainGeometries() {
    const nose = new THREE.CylinderBufferGeometry(0.75, 0.75, 3, 12);
    const cabin = new THREE.BoxBufferGeometry(2, 2.25, 1.5);
    const chimney = new THREE.CylinderBufferGeometry(0.3, 0.1, 0.5);
    const wheel = new THREE.CylinderBufferGeometry(0.4, 0.4, 1.75, 16);
    wheel.rotateX(Math.PI / 2);
    return {
        nose,
        cabin,
        chimney,
        wheel,
    };
}

function createTrain() {
    train = new THREE.Group();
    scene.add(train);
    const materials = createTrainMaterials();
    const geometries = createTrainGeometries();
    const nose = new THREE.Mesh(geometries.nose, materials.trainBody);
    nose.rotation.z = Math.PI / 2;
    nose.position.x = -1;
    const cabin = new THREE.Mesh(geometries.cabin, materials.trainBody);
    cabin.position.set(1.5, 0.4, 0);
    const chimney = new THREE.Mesh(geometries.chimney, materials.detail);
    chimney.position.set(-2, 0.9, 0);
    smallWheelRear = new THREE.Mesh(geometries.wheel, materials.detail);
    smallWheelRear.position.set(0, -0.5, 0);
    smallWheelCenter = smallWheelRear.clone();
    smallWheelCenter.position.x = -1;
    smallWheelFront = smallWheelRear.clone();
    smallWheelFront.position.x = -2;
    bigWheel = smallWheelRear.clone();
    bigWheel.scale.set(2, 2, 1.25);
    bigWheel.position.set(1.5, -0.1, 0);
    train.add(nose, cabin, chimney, smallWheelRear, smallWheelCenter, smallWheelFront, bigWheel);
}

function createCarMaterials() {
    carBody = new THREE.MeshStandardMaterial({
        color: 0x33aa33,
        flatShading: true,
    });

    carBody.color.convertSRGBToLinear();

    const detail = new THREE.MeshStandardMaterial({
        color: 0x333333,
        flatShading: true,
    });

    const lights = new THREE.MeshStandardMaterial({
        color: 0x555555,
        flatShading: true,
    });

    detail.color.convertSRGBToLinear();
    lights.color.convertSRGBToLinear();

    return {
        carBody,
        detail,
        lights,
    };
}

function createCarGeometries() {
    const up = new THREE.CylinderBufferGeometry(0.75, 1.5, 1, 4);
    const bot = new THREE.BoxBufferGeometry(4, 0.8, 2.3);
    const wheel = new THREE.CylinderBufferGeometry(0.4, 0.4, 2.5, 16);
    const lights = new THREE.BoxBufferGeometry(0.4, 0.4, 0.4);
    return {
        up,
        bot,
        wheel,
        lights,
    };
}

function createCar() {
    car = new THREE.Group();
    scene.add(car);
    const materials = createCarMaterials();
    const geometries = createCarGeometries();
    const up = new THREE.Mesh(geometries.up, materials.carBody);
    up.rotation.y = Math.PI / 4;
    up.position.set(-7, 0.75, 0);
    const bot = new THREE.Mesh(geometries.bot, materials.carBody);
    bot.position.set(-7, 0, 0);
    wheelRear = new THREE.Mesh(geometries.wheel, materials.detail);
    wheelRear.rotation.x = Math.PI / 2;
    wheelRear.position.set(-6, -0.4, 0);
    wheelFront = wheelRear.clone();
    wheelFront.position.x = -8;
    lightLeft = new THREE.Mesh(geometries.lights, materials.lights);
    lightLeft.position.set(-8.85, 0, 0.7);
    lightRight = lightLeft.clone();
    lightRight.position.set(-8.85, 0, -0.7);
    
    car.add(up, bot, wheelRear, wheelFront, lightLeft, lightRight);
    car.position.z = -5;
}

function createSatteMaterials() {
    satteBody = new THREE.MeshStandardMaterial({
        color: 0x0000ff,
        flatShading: true,
    });

    satteBody.color.convertSRGBToLinear();

    const detail = new THREE.MeshStandardMaterial({
        color: 0x333333,
        flatShading: true,
    });

    satteBody.color.convertSRGBToLinear();

    return {
        satteBody,
        detail,
    };
}

function createSatteGeometries() {
    const sphere = new THREE.SphereBufferGeometry(1.5, 16, 8);
    const stick = new THREE.CylinderBufferGeometry(0.3, 0.3, 5, 16);

    return {
        sphere, 
        stick,
    };
}

function createSatte() {
    satte = new THREE.Group();
    scene.add(satte);
    const materials = createSatteMaterials();
    const geometries = createSatteGeometries();
    const sph = new THREE.Mesh(geometries.sphere, materials.satteBody);
    sph.position.set(8, 0, 0);
    const wing = new THREE.Mesh(geometries.stick, materials.detail);
    wing.position.set(8, 0, 0);
    wing.rotation.x = Math.PI / 2;
    const outLeft = wing.clone();
    outLeft.scale.set(2, 0.5, 2);
    outLeft.position.set(8, 0, 3.5);
    const outRight = outLeft.clone();
    outRight.position.set(8, 0, -3.5);

    satte.add(sph, wing, outLeft, outRight);
    satte.position.z = 8;
}

function createRenderer() {
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.physicallyCorrectLights = true;
    renderer.gammaFactor = 2.2;
    renderer.gammaOutput = true;
    container.appendChild(renderer.domElement);
}

function update() {
    if (trainStart) {
        smallWheelRear.rotation.z += 0.03;
        smallWheelCenter.rotation.z += 0.03;
        smallWheelFront.rotation.z += 0.03;
        bigWheel.rotation.z += 0.03;
        train.position.x -= 0.02;
    }

    if (trainBack) {
        smallWheelRear.rotation.z -= 0.03;
        smallWheelCenter.rotation.z -= 0.03;
        smallWheelFront.rotation.z -= 0.03;
        bigWheel.rotation.z -= 0.03;
        train.position.x += 0.02;
    }

    if (carStart) {
        wheelRear.rotation.y += 0.03;
        wheelFront.rotation.y += 0.03;
        car.position.x -= 0.02;
        lightLeft.material.color.setHex(0xffffff);
    } else if (!carStart) {
        lightLeft.material.color.setHex(0x555555);
    }

    if (carBack) {
        wheelRear.rotation.y -= 0.03;
        wheelFront.rotation.y -= 0.03;
        car.position.x += 0.02;
    }

    if (satteStart) {
        satte.position.x -= 0.02;
    }

    if (satteBack) {
        satte.position.x += 0.02;
    }

}

function render() {
    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}


window.addEventListener('resize', onWindowResize);

init();