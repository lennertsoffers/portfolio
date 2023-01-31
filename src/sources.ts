import LoadCycleEntry from "./types/LoadCycleEntry";

const sources: LoadCycleEntry[] = [
    {
        index: 1,
        name: "scene 1 textures",
        displayName: "textures",
        sourceEntries: [
            {
                name: "rocks_1",
                type: "texture",
                path: "textures/terrain/baked_rocks_1-min.jpg"
            },
            {
                name: "rocks_2",
                type: "texture",
                path: "textures/terrain/baked_rocks_2-min.jpg"
            },
            {
                name: "rocks_3",
                type: "texture",
                path: "textures/terrain/baked_rocks_3-min.jpg"
            },
            {
                name: "wood",
                type: "texture",
                path: "textures/terrain/baked_wood-min.jpg"
            },
            {
                name: "objects",
                type: "texture",
                path: "textures/terrain/baked_objects-min.jpg"
            },
            {
                name: "iron",
                type: "texture",
                path: "textures/terrain/baked_iron-min.jpg"
            }
        ]
    },
    {
        index: 1,
        name: "scene 1 models",
        displayName: "3d objects",
        sourceEntries: [
            {
                name: "world 1",
                type: "gltf",
                path: "models/world1.glb"
            },
            {
                name: "character",
                type: "gltf",
                path: "models/character.glb"
            }
        ]
    }
];

export default sources; 