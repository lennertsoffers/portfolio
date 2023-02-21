attribute vec3 aDirection;
attribute float aSpeed;
attribute float aAliveTime;

uniform float uTime;
uniform float uSize;
uniform vec3 uColour;

varying float vPercentageOfLifeTime;
varying vec3 vColour;

void main() {
    float percentageOfLifeTime = uTime / aAliveTime;
    vec3 movement = uTime * aDirection * aSpeed * 0.0001 * (1.0 - percentageOfLifeTime);
    vec3 particlePostion = position + movement;

    vec4 modelPosition = modelMatrix * vec4(particlePostion, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;

    gl_Position = projectionPosition;
    gl_PointSize = uSize / -viewPosition.z * 10.0;

    vPercentageOfLifeTime = percentageOfLifeTime;
    vColour = uColour;
}
