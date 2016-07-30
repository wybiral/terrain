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

    build() {
        this.geometry.computeBoundingSphere();
        this.geometry.computeVertexNormals();
        this.material = new THREE.MeshLambertMaterial({
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.x = this.width / 2;
        this.mesh.position.z = this.height / 2;
        return this.mesh;
    }
}
