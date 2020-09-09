// Key constants
const K_FORWARD = 'W'.charCodeAt(0);
const K_BACKWARD = 'S'.charCodeAt(0);
const K_STRAFE_LEFT = 'A'.charCodeAt(0);
const K_STRAFE_RIGHT = 'D'.charCodeAt(0);

const K_UP = 38;
const K_DOWN = 40;
const K_LEFT = 37;
const K_RIGHT = 39;
const K_SPACE = 32;
const K_SHIFT = 16;

class FirstPersonControls {

    constructor(app) {
        this.app = app;
        this.onGround = true;
        this.position = new THREE.Vector3(0, 0, 0);
        this.rotation = new THREE.Vector3(0, 0, 0);
        this.velocity = new THREE.Vector3(0, 0, 0);
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
            let sensitivity = 0.002
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

    update(delta) {
        let speed = delta * 2.0;
        let motion = new THREE.Vector3(0, 0, 0);
        if (this.keystate[K_SHIFT]) {
            // Holding shift increases speed
            speed *= 1.5;
        }
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
        if (this.keystate[K_UP]) {
            this.rotation.x += speed * 0.5;
        }
        if (this.keystate[K_DOWN]) {
            this.rotation.x -= speed * 0.5;
        }
        if (this.keystate[K_LEFT]) {
            this.rotation.y += speed * 0.5;
        }
        if (this.keystate[K_RIGHT]) {
            this.rotation.y -= speed * 0.5;
        }
        if (this.keystate[K_SPACE] && this.onGround) {
            motion.y = delta * 60;
            this.onGround = false;
        }
        let rotation = new THREE.Matrix4().makeRotationY(this.rotation.y);
        motion.applyMatrix4(rotation);
        this.velocity.add(motion);
        let nextPosition = this.position.clone();
        nextPosition.add(this.velocity);
        if (this.onGround) {
            this.velocity.x *= 0.95;
            this.velocity.z *= 0.95;
        } else {
            // Less friction in air
            this.velocity.x *= 0.97;
            this.velocity.z *= 0.97;
            // Gravity
            this.velocity.y -= delta * 3;
        }
        let x = nextPosition.x;
        let y = nextPosition.y;
        let z = nextPosition.z;
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
        let ground = 7 + terrain.getHeightAt(x, z) * scale;
        if (this.onGround || y <= ground) {
            y = ground;
            this.velocity.y = 0;
            this.onGround = true;
        }
        this.position.y = y;
        // Apply current transformations to camera
        let camera = this.app.camera;
        camera.position.copy(this.position);
        camera.rotation.set(0, 0, 0);
        camera.rotateY(this.rotation.y);
        camera.rotateX(this.rotation.x);
    }

}