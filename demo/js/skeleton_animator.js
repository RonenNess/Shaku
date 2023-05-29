/**
 * Render a 2d skeleton-based animation using a skeleton (joints with transformations) and skin (sprites to attach to skeleton).
 * Author: Ronen Ness.
 * Since: 2023.
 */
class SkeletonRenderer
{
    /**
     * Create the skeleton renderer.
     * @param {*} skeleton Tree of bones representing the skeleton bones at idle position. Made of a dictionary of bones.
     *                     Every bone dictionary has:
     *                          {
     *                              name: bone identifier (to attach skin parts to). don't use forward slashes ( / ) in name, as we use them internally to seperate paths.
     *                              origin [default=1]: where this bone starts from parent bone, values range from 0 (at parent origin) to 1 (at parent edge). 0.5 for example will erect this bone from the center of its parent bone.
     *                              rotation [default=0]: rotation from parent bone.
     *                              scale [default=1]: scale the bone length and sprite.
     *                              constLength [default=undefined]: if provided, will set the bone to this length regardless of the sprite attached to it. If not provided, will calculate length based on the sprite attached to the bone.
     *                              children [default=[]]: list with child bones.
     *                          }
     * @param {Array<*>} animation Animation to play. Made of an array of animation steps, where every step contains the following values:
     *                          {
     *                              duration: animation step duration in seconds.
     *                              transitionToNext: how we want to transition between this animation step and the next. Valid values are:
     *                                                  'linear' (default), 'smoothStep', 'quadLerp', 'squaredLerp'.
     *                              transformations: dictionary of transformations to apply on bones during this step. 
     *                                               Key should be bone path seperated with forward slashes (for example 'root/chest/head') and values should be dictionaries with:
     *                              {
     *                                  rotation: rotation to add to bone rotation in skeleton during this animation step.
     *                                  scale: scale to apply on bone during this animation step.
     *                                  boneScale: increase just the length of this particular bone without scaling children.
     *                              }
     *                          }
     * @param {*} skin Dictionary with sprites to attach to skeleton. Key is bone identifier, value is whatever data you need to render the sprite + a required 'boneLength' numeric value to stretch the bones to fit the sprite. 
     *  Ror example it can be something like this:
     *               bone_name: [
     *                  {
     *                      boneLength [MANDATORY]: length to apply on the parent bone. unless you provide 'constLength' to bones, their size will be calculated by the 'boneLength' of the sprites attached to them.
     *                      sourceRect [suggestion]: source rectangle in texture.
     *                      texture [suggestion]: texture identifier or instance.
     *                      rotation [suggestion]: sprite rotation relative to bone rotation.
     *                      origin [suggestion]: sprite origin.
     *                  }
     *               ]
     *               Note: only 'boneLength' is mandatory, the other params (texture, rotation, origin) are just recommendation and you can attach and use them however you like.
     * @param {Number=} scale Scale the entire skeleton uniformly.
     */
    constructor(skeleton, animation, skin, scale)
    {
        this.skeleton = skeleton;
        this.animation = animation;
        this.skin = skin;
        this.scale = scale || 1;
        this.rotation = 0;
        this.position = Shaku.utils.Vector2.zero();
        this.resetAnimation();
    }

    /**
     * Reset animation.
     */
    resetAnimation()
    {
        this.__animationStepProgress = 0;
        this.__currAnimationStepData = this.animation[0];
        this.__currAnimationNextStepData = this.animation[1] || this.__currAnimationStepData;
        this.__currAnimationStepIndex = 0;
    }

    /**
     * Update skeleton animation.
     * @param {Number} deltaTime Delta time in seconds to advance animation.
     */
    update(deltaTime)
    {
        // no animation to play
        if (!this.__currAnimationStepData) { return; }

        // update current step progress and check if finished step
        this.__animationStepProgress += deltaTime;
        while (this.__animationStepProgress >= this.__currAnimationStepData.duration) {

            // proceed to next step and if wrap around go back to first step
            this.__animationStepProgress -= this.__currAnimationStepData.duration;
            this.__currAnimationStepIndex++;
            if (this.__currAnimationStepIndex >= this.animation.length) { this.__currAnimationStepIndex = 0; }

            // get current step data
            this.__currAnimationStepData = this.animation[this.__currAnimationStepIndex];

            // get next step data
            this.__currAnimationNextStepData = this.animation[this.__currAnimationStepIndex + 1] || this.animation[0];
        }
    }

    /**
     * Walk over the skeleton in current animation step.
     * @param {Function} handler Method to invoke on sprites in skeleton for every sprite.
     * Method receive the following params:
     *  bone: bone instance with all its data as provided in the skeleton.
     *  parent bone: parent bone instance.
     *  sprite: current sprite data as provided in the skin.
     *  transformations: current absolute transformations: {position = render position, rotation = sprite rotation, scale = scale factor}.
     */
    walk(handler)
    {
        // walk bones recursively and fill the return array
        // every bone contains: origin, rotation, name, scale, constLength, spriteLengthComponent, children.
        // transform = {position, rotation}
        // parent = parent bone.
        // parentLen = parent bone length.
        // bone full path, components separated with forward slashes.
        const walkBones = (currBone, parentTransform, parent, parentLen, bonePath) => {

            // get current bone length
            let boneLen = currBone.constLength;

            // get sprites for current bone (and if got a single value, convert to array)
            var sprites = this.skin[currBone.name] || _emptyList;
            if (!Array.isArray(sprites)) { sprites = [sprites]; }

            // no const len? calculate from sprites
            if (boneLen === undefined) {

                // get sprites and find max bone len
                boneLen = 0;
                for (let sprite of sprites) {
                    boneLen = Math.max(boneLen, sprite.boneLength || 0);
                }
            }

            // calculate current transformations
            const transformations = {position: parentTransform.position.clone(), scale: parentTransform.scale * (currBone.scale || 1), rotation: parentTransform.rotation + (currBone.rotation || 0)};

            // apply animation transformations
            if (this.__currAnimationStepData) {

                // get current and next transformations + calculate lerp values
                const currAnimationTransform = (this.__currAnimationStepData.transformations || _emptyDict)[bonePath] || _emptyDict;
                const nextAnimationTransform = (this.__currAnimationNextStepData.transformations || _emptyDict)[bonePath] || _emptyDict;
                if (currAnimationTransform != nextAnimationTransform) {
                    const transitionType = (this.__currAnimationNextStepData.transitionToNext || 'linear');
                    var lerpValue = (this.__animationStepProgress / this.__currAnimationStepData.duration);

                    // get curr and next rotation
                    const currRotation = currAnimationTransform.rotation || 0;
                    const nextRotation = nextAnimationTransform.rotation || 0;

                    // get curr and next scale
                    const currScale = currAnimationTransform.scale || 1;
                    const nextScale = nextAnimationTransform.scale || 1;

                    // get curr and next bone scale
                    const currBoneScale = currAnimationTransform.boneScale || 1;
                    const nextBoneScale = nextAnimationTransform.boneScale || 1;

                    // apply transition type
                    if (transitionType === 'linear') {
                    }
                    else if (transitionType == 'smoothStep') {
                        lerpValue = ss(lerpValue);
                    }
                    else if (transitionType == 'quadLerp') {
                        lerpValue = quadlerp(lerpValue);
                    }
                    else if (transitionType == 'squaredLerp') {
                        lerpValue = squaredlerp(lerpValue);
                    }
                    else {
                        throw new Error(`Unknown transition type '${transitionType}'!`);
                    }

                    // apply transition
                    transformations.rotation += (currRotation !== nextRotation) ? Shaku.utils.MathHelper.lerpDegrees(currRotation, nextRotation, lerpValue) : nextRotation;
                    transformations.scale *= (currScale !== nextScale) ?  Shaku.utils.MathHelper.lerp(currScale, nextScale, lerpValue) : nextScale;
                    boneLen *= (currBoneScale !== nextBoneScale) ? Shaku.utils.MathHelper.lerp(currBoneScale, nextBoneScale, lerpValue) : nextBoneScale;
                }
            }

            // wrap rotation
            while (transformations.rotation < 0) { transformations.rotation += 360; }
            while (transformations.rotation > 360) { transformations.rotation -= 360; }

            // set current bone position
            if (parentLen) { 
                const origin = (currBone.origin === undefined) ? 1 : currBone.origin;
                transformations.position.addSelf(Shaku.utils.Vector2.fromDegrees(parentTransform.rotation || 0).mulSelf(parentLen * origin)); 
            }

            // apply scale on bone length
            boneLen *= (transformations.scale || 1);

            // invoke handler
            for (let sprite of sprites) {
                handler(currBone, parent, sprite, transformations);
            }

            // iterate children
            if (currBone.children && currBone.children.length) {
                for (let child of currBone.children) {
                    walkBones(child, transformations, currBone, boneLen, bonePath ? (bonePath + '/' + child.name) : child.name);
                }
            }
        }

        // create phantom root bone for walking the skeleton
        if (!this._root) {
            this._root = {
                origin: 0,
                rotation: 0,
                name: '__root__',
                scale: 1,
                constLength: 0,
                children: [this.skeleton]
            }
        }

        // start walking skeleton
        walkBones(this._root, {position: this.position, rotation: this.rotation, scale: this.scale}, null, 1, null);
    }
}

// light optimization
const _emptyDict = {};
const _emptyList = [];

function lerp(a, b, t) {
    return a + (b-a) * t;
}

function llerp(t) {
    return t;
}

function squaredlerp(t) {
    return t*t;
}

function quadlerp(t) {
    return 1.0 - (1.0 - t) * (1.0 - t);
}

function ss(t) {
    return lerp(quadlerp(t),squaredlerp(t),t);
}


// export the skeleton renderer
window.SkeletonRenderer = SkeletonRenderer;