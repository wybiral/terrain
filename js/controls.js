// Key constants
const K_FORWARD = 'W'.charCodeAt(0);
const K_BACKWARD = 'S'.charCodeAt(0);
const K_STRAFE_LEFT = 'A'.charCodeAt(0);
const K_STRAFE_RIGHT = 'D'.charCodeAt(0);

class FirstPersonControls {

    constructor(app) {
        this.app = app;
        this.position = new THREE.Vector3(0, 0, 0);
        this.rotation = new THREE.Vector3(0, 0, 0);
        this.keystate = {};
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

        // Update keystate from down/up events
        window.addEventListener('keydown', (evt) => {
            this.keystate[evt.which] = true;
        }, false);
        window.addEventListener('keyup', (evt) => {
            this.keystate[evt.which] = false;
        }, false);

    }

    update() {
        let speed = 0.5;
        let motion = new THREE.Vector3(0, 0, 0);
        if (this.keystate[K_FORWARD]) {
            motion.z -= speed;
        }
        if (this.keystate[K_BACKWARD]) {
            motion.z += speed;
        }
        if (this.keystate[K_STRAFE_LEFT]) {
            motion.x -= speed;
        }
        if (this.keystate[K_STRAFE_RIGHT]) {
            motion.x += speed;
        }
        let rotation = new THREE.Matrix4().makeRotationY(this.rotation.y);
        motion.applyMatrix4(rotation);
        motion.add(this.position);
        let x = motion.x;
        let z = motion.z;
        let terrain = this.app.terrain;
        // Constrain position to terrain bounds
        if (x < 0 || x >= terrain.width - 1) {
            x = this.position.x;
        }
        if (z < 0 || z >= terrain.height - 1) {
            z = this.position.z;
        }
        this.position.x = x;
        this.position.z = z;
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