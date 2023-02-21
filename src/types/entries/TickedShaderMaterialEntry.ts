import { ShaderMaterial } from "three";

export default interface TickedShaderMaterialEntry {
    shaderMaterial: ShaderMaterial;
    startTime: number;
}