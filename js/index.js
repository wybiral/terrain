class App {
    constructor() {
        // Grab window properties
        let width = window.innerWidth;
        let height = window.innerHeight;
        let pixelRatio = window.devicePixelRatio;
        let aspect = width / height;
        // Setup three.js
        this.camera = new THREE.PerspectiveCamera(45, aspect, 0.5, 1500);
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer({antialias: false});
        this.renderer.setPixelRatio(pixelRatio);
        this.renderer.setSize(width, height);
        document.body.appendChild(this.renderer.domElement);
        // Catch resize events
        window.onresize = (evt) => {
            this.resize(window.innerWidth, window.innerHeight);
        };
    }

    /* Resize viewport */
    resize(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    /* Start the main loop */
    start() {
        this.loop();
    }

    loop() {
        requestAnimationFrame(() => this.loop());
        this.update();
        this.render();
    }

    update() {
        // Just spin in circles for now
        this.camera.rotation.y += 0.001;
    }

    render() {
        let scene = this.scene;
        let camera = this.camera;
        let renderer = this.renderer;
        renderer.render(scene, camera);
    }
}


window.onload = function() {
    let app = new App();

    // Let there be light
    let light = new THREE.DirectionalLight(0xe0e0e0);
    light.position.set(1, 1, 0).normalize();
    app.scene.add(light);

    Terrain.fromImage('images/terrain.png').then(function(terrain) {

        var texture = THREE.ImageUtils.loadTexture('images/texture.png');
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(terrain.width / 100, terrain.height / 100);

        app.scene.add(terrain.build(texture));

        // Scale terrain peaks
        terrain.mesh.scale.y = 50.0;

        // Position camera
        let camera = app.camera;
        camera.position.x = terrain.width / 2;
        camera.position.y = 50;
        camera.position.z = terrain.height / 2;

        app.start();
    }).catch(function(e) {
        throw e;
    });
};
