import { AmbientLight, MeshBasicMaterial, MeshStandardMaterial, PointLight, Vector3 } from "three";
import GltfUtils from "../../utils/GltfUtils";
import World from "./World";

export default class MainWorld extends World {
    public loadWorld(): void {
        // --- TEXTURES --- //
        const rocks1Texture = this.application.resourceManager
            .getLoadedResource("rocks_1")
            .getTexture();
        const rocks2Texture = this.application.resourceManager
            .getLoadedResource("rocks_2")
            .getTexture();
        const rocks3Texture = this.application.resourceManager
            .getLoadedResource("rocks_3")
            .getTexture();
        const rocks4Texture = this.application.resourceManager
            .getLoadedResource("rocks_4")
            .getTexture();
        const objects1Texture = this.application.resourceManager
            .getLoadedResource("objects_1")
            .getTexture();
        const objects2Texture = this.application.resourceManager
            .getLoadedResource("objects_2")
            .getTexture();
        const objects3Texture = this.application.resourceManager
            .getLoadedResource("objects_3")
            .getTexture();
        const wood1Texture = this.application.resourceManager
            .getLoadedResource("wood_1")
            .getTexture();
        const wood2Texture = this.application.resourceManager
            .getLoadedResource("wood_2")
            .getTexture();

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
        const rocks4Material = new MeshBasicMaterial({
            map: rocks4Texture
        });
        const objects1Material = new MeshBasicMaterial({
            map: objects1Texture
        });
        const objects2Material = new MeshBasicMaterial({
            map: objects2Texture
        });
        const objects3Material = new MeshBasicMaterial({
            map: objects3Texture
        });
        const wood1Material = new MeshBasicMaterial({
            map: wood1Texture
        });
        const wood2Material = new MeshBasicMaterial({
            map: wood2Texture
        });


        // Light materials
        const portalLightMaterial = new MeshBasicMaterial({
            color: 0x86ff64
        });
        const poleLightMaterial = new MeshBasicMaterial({
            color: 0xdcd16d
        });
        const textLightMaterial = new MeshBasicMaterial({
            color: 0xffffff
        });

        const worldGltf = this.application.resourceManager
            .getLoadedResource("world")
            .getGltf();

        const rocks1Mesh = GltfUtils.getChildAsMesh("rocks_1", worldGltf);
        const rocks2Mesh = GltfUtils.getChildAsMesh("rocks_2", worldGltf);
        const rocks3Mesh = GltfUtils.getChildAsMesh("rocks_3", worldGltf);
        const rocks4Mesh = GltfUtils.getChildAsMesh("rocks_4", worldGltf);
        const objects1Mesh = GltfUtils.getChildAsMesh("objects_1", worldGltf);
        const objects2Mesh = GltfUtils.getChildAsMesh("objects_2", worldGltf);
        const objects3Mesh = GltfUtils.getChildAsMesh("objects_3", worldGltf);
        const wood1Mesh = GltfUtils.getChildAsMesh("wood_1", worldGltf);
        const wood2Mesh = GltfUtils.getChildAsMesh("wood_2", worldGltf);

        const portalLightMesh = GltfUtils.getChildAsMesh("portal_light", worldGltf);
        const poleLightMesh = GltfUtils.getChildAsMesh("pole_light", worldGltf);
        const textLightMesh = GltfUtils.getChildAsMesh("text_light", worldGltf);

        rocks1Mesh.material = rocks1Material;
        rocks2Mesh.material = rocks2Material;
        rocks3Mesh.material = rocks3Material;
        rocks4Mesh.material = rocks4Material;
        objects1Mesh.material = objects1Material;
        objects2Mesh.material = objects2Material;
        objects3Mesh.material = objects3Material;
        wood1Mesh.material = wood1Material;
        wood2Mesh.material = wood2Material;

        portalLightMesh.material = portalLightMaterial;
        poleLightMesh.material = poleLightMaterial;
        textLightMesh.material = textLightMaterial;

        textLightMesh.position.add(new Vector3(2.41, -0.036, 0.1905))

        // --- LIGHTS --- //
        const light = new PointLight(0xffffff, 100, 0);
        light.position.set(5, 5, 5);
        const sun = new AmbientLight(0xffffff, 0.5);

        const moonLight = new PointLight(0xffffff, 100, 0);
        moonLight.position.set(6, 6, -18);

        // --- MOON --- //
        const moonGltf = this.application.resourceManager
            .getLoadedResource("moon")
            .getGltf();
        const moonMesh = GltfUtils.getChildAsMesh("moon", moonGltf);
        const moonMaterial = new MeshStandardMaterial({
            color: 0xcccccc
        });
        moonMesh.material = moonMaterial;
        moonMesh.position.set(7, 7, -20);

        this.application.scene.add(
            rocks1Mesh,
            rocks2Mesh,
            rocks3Mesh,
            rocks4Mesh,
            objects1Mesh,
            objects2Mesh,
            objects3Mesh,
            wood1Mesh,
            wood2Mesh,
            portalLightMesh,
            poleLightMesh,
            textLightMesh,
            light,
            sun,
            moonMesh,
            moonLight
        );

        // --- BOUNDING BOXES --- //
        const boundingBoxGltf = this.application.resourceManager
            .getLoadedResource("bounding_box")
            .getGltf();
        const boundingBoxWallsMesh = GltfUtils.getChildAsMesh(
            "bounding_box_walls",
            boundingBoxGltf
        );
        const boundingBoxFloorMesh = GltfUtils.getChildAsMesh(
            "bounding_box_floor",
            boundingBoxGltf
        );
        const boundingBoxCameraMesh = GltfUtils.getChildAsMesh(
            "bounding_box_camera",
            boundingBoxGltf
        );

        this.addWallsCollisionMeshes(boundingBoxWallsMesh);
        this.addFloorCollisionMeshes(boundingBoxFloorMesh);
        this.addCameraCollisionMeshes(boundingBoxCameraMesh);

        // --- ACTION BOXES --- //
        const actionBoxGltf = this.application.resourceManager
            .getLoadedResource("action_box")
            .getGltf();
        const actionBoxAboutMe = GltfUtils.getChildAsMesh(
            "action_box_about_me",
            actionBoxGltf
        );
        const actionBoxInternship = GltfUtils.getChildAsMesh(
            "action_box_internship",
            actionBoxGltf
        );
        const actionBoxProjects = GltfUtils.getChildAsMesh(
            "action_box_projects",
            actionBoxGltf
        );

        this.addActionCollisionMeshes(
            actionBoxAboutMe,
            actionBoxInternship,
            actionBoxProjects
        );

        this._loaded = true;
    }
}
