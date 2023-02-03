import LoadCycleEntry from "./types/entries/LoadCycleEntry";

const sources: LoadCycleEntry[] = [
    {
        name: "world 1 textures",
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
            },
            {
                name: "world_1",
                type: "gltf",
                path: "models/world1.glb"
            },
            {
                name: "character",
                type: "gltf",
                path: "models/character.glb"
            },
            {
                name: "bounding_box",
                type: "gltf",
                path: "models/bounding_box.glb"
            }
        ]
    },
    {
        name: "world 2 textures",
        sourceEntries: [
        ]
    }
];

export default sources; 