export default class AnimationNotFoundError extends Error {
    constructor(
        animationName: string,
        modelName: string,
        availableAnimations: string[]
    ) {
        super(
            `Could not find '${animationName}' in model '${modelName}'\n- ${availableAnimations.join("\n- ")}`
        );
    }
}
