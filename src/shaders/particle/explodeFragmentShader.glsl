varying float vPercentageOfLifeTime;
varying vec3 vColour;

void main() {
    float strength = step(0.5, distance(gl_PointCoord, vec2(0.5)));

    vec3 colour = mix(vColour, vec3(0.0), strength);

    gl_FragColor = vec4(colour, 1.0 - vPercentageOfLifeTime * 2.0);
}