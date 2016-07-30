class Terrain {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.geometry = new THREE.PlaneBufferGeometry(
            width,
            height,
            width - 1,
            height - 1
        );
        let rotation = new THREE.Matrix4().makeRotationX(-Math.PI / 2);
        this.geometry.applyMatrix(rotation);
        this.array = this.geometry.attributes.position.array;
        this.mesh = null;
    }

    build(texture) {
        this.geometry.computeBoundingSphere();
        this.geometry.computeVertexNormals();
        this.material = new THREE.MeshLambertMaterial({
            map: texture
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.x = this.width / 2;
        this.mesh.position.z = this.height / 2;
        return this.mesh;
    }

    static fromImage(src) {
        return new Promise(function(resolve, reject) {
            let img = new Image();
            img.onload = function() {
                let width = img.width;
                let height = img.height;
                let canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                let ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                let pixels = ctx.getImageData(0, 0, width, height).data;
                let terrain = new Terrain(width, height);
                for (let i = 0; i < width * height; i++) {
                    terrain.array[i * 3 + 1] = pixels[i * 4] / 256;
                }
                resolve(terrain);
            };
            img.onabort = reject;
            img.onerror = reject;
            img.src = src;
        });
    }
}
