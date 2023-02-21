import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, Points, ShaderMaterial, Vector3 } from "three";
import Application from "../../Application";
import Tickable from "../../types/interfaces/Tickable";
import TickedShaderMaterialEntry from "../../types/entries/TickedShaderMaterialEntry";

// Shaders
// @ts-ignore
import explodeVertexShader from "../../shaders/particle/explodeVertexShader.glsl";
// @ts-ignore
import explodeFragmentShader from "../../shaders/particle/explodeFragmentShader.glsl";
// @ts-ignore
import ambientVertexShader from "../../shaders/particle/ambientVertexShader.glsl";
// @ts-ignore
import ambientFragmentShader from "../../shaders/particle/ambientFragmentShader.glsl";
import MathUtils from "../../utils/MathUtils";

export default class ParticleManager implements Tickable {
    private _application: Application;
    private _tickedShaderMaterials: TickedShaderMaterialEntry[];

    constructor(application: Application) {
        this._application = application;
        this._tickedShaderMaterials = [];
    }

    public spawnAmbientParticles(centerPosition: Vector3, count: number, decay: number, colour: Color, offset: number): void {
        const particleGeometry = new BufferGeometry();
        const particlePositions = new Float32Array(count * 3);
        const particleSizes = new Float32Array(count);
        const particleSpeeds = new Float32Array(count);
        const particleAliveTimes = new Float32Array(count);

        for (let i = 0; i < count * 3; i += 3) {
            particlePositions[i + 0] = centerPosition.x + MathUtils.randomGaussian(-offset, offset);
            particlePositions[i + 1] = centerPosition.y + MathUtils.randomGaussian(-offset / 2, offset / 2);
            particlePositions[i + 2] = centerPosition.z + MathUtils.randomGaussian(-offset, offset);

            particleSizes[i / 3] = 1.0 + Math.random() * this._application.dimensions.pixelRatio;
            particleSpeeds[i / 3] = (Math.random() + 0.5);
            particleAliveTimes[i / 3] = (Math.random() * (decay - 5000 + 1) + 5000) * 2;
        }

        particleGeometry.setAttribute("position", new BufferAttribute(particlePositions, 3));
        particleGeometry.setAttribute("aSize", new BufferAttribute(particleSizes, 1));
        particleGeometry.setAttribute("aSpeed", new BufferAttribute(particleSpeeds, 1));
        particleGeometry.setAttribute("aAliveTime", new BufferAttribute(particleAliveTimes, 1));

        const particleMaterial = new ShaderMaterial({
            depthWrite: false,
            blending: AdditiveBlending,
            vertexColors: true,
            vertexShader: ambientVertexShader,
            fragmentShader: ambientFragmentShader,
            uniforms: {
                uTime: {
                    value: 0
                },
                uColour: {
                    value: colour
                },
            }
        });
        this._tickedShaderMaterials.push({
            shaderMaterial: particleMaterial,
            startTime: this._application.timedLoop.elapsedTime
        });

        const particles = new Points(particleGeometry, particleMaterial);
        this._application.scene.add(particles);

        setTimeout(() => {
            this._application.scene.remove(particles);
            particleMaterial.dispose();
            particleGeometry.dispose();
        }, decay);
    }


    public spawnParticleExplosion(centerPosition: Vector3, count: number, decay: number, colour: Color, size: number = 2, speed: number = 1, offset: number = 0.03) {
        const particleGeometry = new BufferGeometry();
        const particlePositions = new Float32Array(count * 3);
        const particleDirections = new Float32Array(count * 3);
        const particleSpeeds = new Float32Array(count);
        const particleAliveTimes = new Float32Array(count);

        for (let i = 0; i < count * 3; i += 3) {
            particlePositions[i + 0] = centerPosition.x + (1 - Math.random() * 2) * offset;
            particlePositions[i + 1] = centerPosition.y + (1 - Math.random() * 2) * offset;
            particlePositions[i + 2] = centerPosition.z + (1 - Math.random() * 2) * offset;

            particleDirections[i + 0] = 1 - Math.random() * 2;
            particleDirections[i + 1] = 1 - Math.random() * 2;
            particleDirections[i + 2] = 1 - Math.random() * 2;

            particleSpeeds[i / 3] = (Math.random() + 0.5) * speed;
            particleAliveTimes[i / 3] = (Math.random() * (decay - 100 + 1) + 100) * 2;
        }

        particleGeometry.setAttribute("position", new BufferAttribute(particlePositions, 3));
        particleGeometry.setAttribute("aDirection", new BufferAttribute(particleDirections, 3));
        particleGeometry.setAttribute("aSpeed", new BufferAttribute(particleSpeeds, 1));
        particleGeometry.setAttribute("aAliveTime", new BufferAttribute(particleAliveTimes, 1));

        const particleMaterial = new ShaderMaterial({
            depthWrite: false,
            blending: AdditiveBlending,
            vertexColors: true,
            vertexShader: explodeVertexShader,
            fragmentShader: explodeFragmentShader,
            uniforms: {
                uSize: {
                    value: size * this._application.dimensions.pixelRatio
                },
                uTime: {
                    value: 0
                },
                uColour: {
                    value: colour
                },
            }
        });
        this._tickedShaderMaterials.push({
            shaderMaterial: particleMaterial,
            startTime: this._application.timedLoop.elapsedTime
        });

        const particles = new Points(particleGeometry, particleMaterial);
        this._application.scene.add(particles);

        setTimeout(() => {
            this._application.scene.remove(particles);
            particleMaterial.dispose();
            particleGeometry.dispose();
        }, decay);
    }

    public tick(_deltaTime: number, elapsedTime: number): void {
        this._tickedShaderMaterials.forEach((tickedShaderMaterialEntry) => {
            tickedShaderMaterialEntry.shaderMaterial.uniforms.uTime.value = elapsedTime - tickedShaderMaterialEntry.startTime;
        });
    }
}