import { MeshBasicMaterial } from "three";
import GltfUtils from "../../utils/GltfUtils";
import World from "./World";

export default class MainWorld extends World {
    public loadWorld(): void {
        const rocks1Texture = this.application.resourceManager.getLoadedResource("rocks_1").getTexture();
        const rocks2Texture = this.application.resourceManager.getLoadedResource("rocks_2").getTexture();
        const rocks3Texture = this.application.resourceManager.getLoadedResource("rocks_3").getTexture();
        const woodTexture = this.application.resourceManager.getLoadedResource("wood").getTexture();
        const objectsTexture = this.application.resourceManager.getLoadedResource("objects").getTexture();
        const ironTexture = this.application.resourceManager.getLoadedResource("iron").getTexture();

        // Object materials
        const rocks1Material = new MeshBasicMaterial({
            map: rocks1Texture
        });
        const rocks2Material = new MeshBasicMaterial({
            map: rocks2Texture
        });
        const rocks3Material = new MeshBasicMaterial({
            map: rocks3Texture
        });
        const ironMaterial = new MeshBasicMaterial({
            map: ironTexture
        });
        const woodMaterial = new MeshBasicMaterial({
            map: woodTexture
        });
        const objectsMaterial = new MeshBasicMaterial({
            map: objectsTexture
        });

        // Light materials
        const portalLightMaterial = new MeshBasicMaterial({
            color: 0x86FF64
        });
        const poleLightMaterial = new MeshBasicMaterial({
            color: 0xDCD16D
        });
        const textLightMaterial = new MeshBasicMaterial({
            color: 0xffffff
        });

        const worldGltf = this.application.resourceManager.getLoadedResource("world_1").getGltf();
        const rocks1Mesh = GltfUtils.getChildAsMesh("rocks_1", worldGltf);
        const rocks2Mesh = GltfUtils.getChildAsMesh("rocks_2", worldGltf);
        const rocks3Mesh = GltfUtils.getChildAsMesh("rocks_3", worldGltf);
        const ironMesh = GltfUtils.getChildAsMesh("iron", worldGltf);
        const woodMesh = GltfUtils.getChildAsMesh("wood", worldGltf);
        const objectsMesh = GltfUtils.getChildAsMesh("objects", worldGltf);

        const portalLightMesh = GltfUtils.getChildAsMesh("portal_light", worldGltf);
        const poleLightMesh = GltfUtils.getChildAsMesh("pole_light", worldGltf);
        const textLightMesh = GltfUtils.getChildAsMesh("text_light", worldGltf);

        rocks1Mesh.material = rocks1Material;
        rocks2Mesh.material = rocks2Material;
        rocks3Mesh.material = rocks3Material;
        ironMesh.material = ironMaterial;
        woodMesh.material = woodMaterial;
        objectsMesh.material = objectsMaterial;

        portalLightMesh.material = portalLightMaterial;
        poleLightMesh.material = poleLightMaterial;
        textLightMesh.material = textLightMaterial;

        this.application.scene.add(
            rocks1Mesh,
            rocks2Mesh,
            rocks3Mesh,
            ironMesh,
            woodMesh,
            objectsMesh,
            portalLightMesh,
            poleLightMesh,
            textLightMesh
        );
    }
}