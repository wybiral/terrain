class FirstPersonControls {

    constructor(app) {
        this.app = app;
        this.position = new THREE.Vector3(0, 0, 0);
        this.rotation = new THREE.Vector3(0, 0, 0);
        this.bindEvents();
    }

    bindEvents() {
        // You can only request pointer lock from a user triggered event
        let el = document.querySelector('canvas');
        document.body.addEventListener('mousedown', function() {
            if (!el.requestPointerLock) {
                el.requestPointerLock = el.mozRequestPointerLock;
            }
            el.requestPointerLock()
        }, false);

        // Update rotation from mouse motion
        document.body.addEventListener('mousemove', (evt) => {
            let sensitivity = 0.005
            this.rotation.x -= evt.movementY * sensitivity;
            this.rotation.y -= evt.movementX * sensitivity;
            // Constrain viewing angle
            if (this.rotation.x < -Math.PI / 2) {
                this.rotation.x = -Math.PI / 2;
            }
            if (this.rotation.x > Math.PI / 2) {
                this.rotation.x = Math.PI / 2;
            }
        }, false);
    }

    update() {
        let x = this.position.x;
        let z = this.position.z;
        let terrain = this.app.terrain;
        let scale = terrain.mesh.scale.y;
        this.position.y = 5 + terrain.getHeightAt(x, z) * scale;
        // Apply current transformations to camera
        let camera = this.app.camera;
        camera.position.copy(this.position);
        camera.rotation.set(0, 0, 0);
        camera.rotateY(this.rotation.y);
        camera.rotateX(this.rotation.x);
    }

}