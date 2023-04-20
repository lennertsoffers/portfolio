import LoadCycleEntry from "./types/entries/LoadCycleEntry";

const sources: LoadCycleEntry[] = [
    {
        name: "world 1 textures",
        sourceEntries: [
            {
                name: "rocks_1",
                type: "texture",
                path: "textures/terrain/rocks_1.jpg"
            },
            {
                name: "rocks_2",
                type: "texture",
                path: "textures/terrain/rocks_2.jpg"
            },
            {
                name: "rocks_3",
                type: "texture",
                path: "textures/terrain/rocks_3.jpg"
            },
            {
                name: "rocks_4",
                type: "texture",
                path: "textures/terrain/rocks_4.jpg"
            },
            {
                name: "objects_1",
                type: "texture",
                path: "textures/terrain/objects_1.jpg"
            },
            {
                name: "objects_2",
                type: "texture",
                path: "textures/terrain/objects_2.jpg"
            },
            {
                name: "objects_3",
                type: "texture",
                path: "textures/terrain/objects_3.jpg"
            },
            {
                name: "wood_1",
                type: "texture",
                path: "textures/terrain/wood_1.jpg"
            },
            {
                name: "wood_2",
                type: "texture",
                path: "textures/terrain/wood_2.jpg"
            },
            {
                name: "world",
                type: "gltf",
                path: "models/world.glb"
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
            },
            {
                name: "action_box",
                type: "gltf",
                path: "models/action_box.glb"
            },
            {
                name: "moon",
                type: "gltf",
                path: "models/moon.glb"
            }
        ]
    },
    {
        name: "world 2 textures",
        sourceEntries: []
    }
];

export default sources;
