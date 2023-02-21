varying float vPercentageOfLifeTime;
varying vec3 vColour;

float alpha(float x) {
    return -(4.0 * pow(x, 2.0)) + (4.0 * x);
}

void main() {
    float strength = step(0.5, distance(gl_PointCoord, vec2(0.5)));

    vec3 colour = mix(vColour, vec3(0.0), strength);

    gl_FragColor = vec4(colour, alpha(vPercentageOfLifeTime * 2.0));
}