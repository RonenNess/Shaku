
/**
 * Render a 2d skeleton-based animation using a skeleton (joints with transformations) and skin (sprites to attach to skeleton).
 * Author: Ronen Ness.
 * Since: 2023.
 */
class SkeletonRenderer
{
    /**
     * Create the skeleton renderer.
     * @param {*} skeleton List of dictionaries where every dictionary represent an animation keyframe and all bones in it.
     *                     every step have these values:
     *                      {
     *                          duration: duration, in seconds, to wait on this animation step.
     *                          root: root bone located at the skeleton origin position. every bone contains:
     *                              {
     *                                  name: bone identifier (to attach skin parts to).
     *                                  origin [default=1]: where this bone starts from parent bone, values range from 0 (at parent origin) to 1 (at parent edge). 0.5 for example will erect this bone from the center of its parent bone.
     *                                  rotation [default=0]: rotation from parent bone.
     *                                  scale [default=1]: scale the bone length and sprite.
     *                                  constLength [default=undefined]: if provided, will set the bone to this length regardless of the sprite attached to it. If not provided, will calculate length based on the sprite attached to the bone.
     *                                  spriteLengthComponent [default='height']: can either be 'width' or 'height', determine which component of the attached sprite to use as bone length.
     *                                  children [default=[]]: list with child bones.
     *                              }
     *                      }
     * @param {*} skin Dictionary with sprites to attach to skeleton. Key is bone identifier, value is sprites data list or a single sprite data object:
     *               bone_name: [
     *                  {
     *                      sourceRect: {x,y,width,height} source rectangle in texture.
     *                      texture: texture identifier or instance.
     *                      rotation: sprite rotation relative to bone rotation.
     *                      origin: sprite origin.
     *                  }
     *               ]
     *               Note: only 'sourceRect' is mandatory, the other params (texture, rotation, origin) are just recommendation and you can attach and use them however you like.
     * @param {Number=} scale Scale the entire skeleton uniformly.
     */
    constructor(skeleton, skin, scale)
    {
        this.skeleton = skeleton;
        this.skin = skin;
        this.scale = scale || 1;
        this.rotation = 0;
        this.position = Shaku.utils.Vector2.zero();
        this.reset();
    }

    /**
     * Reset animation.
     */
    reset()
    {
        this._stepProgress = 0;
        this._currStepData = this.skeleton[0];
        this._currStepIndex = 0;
    }

    /**
     * Update skeleton animation.
     * @param {Number} deltaTime Delta time in seconds to advance animation.
     */
    update(deltaTime)
    {
        // update current step progress and check if finished step
        this._stepProgress += deltaTime;
        while (this._stepProgress >= this._currStepData.duration) {

            // proceed to next step and if wrap around go back to first step
            this._stepProgress -= this._currStepData.duration;
            this._currStepIndex++;
            if (this._currStepIndex >= this.skeleton.length) { this._currStepIndex = 0; }

            // get current step data
            this._currStepData = this.skeleton[this._currStepIndex];
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
        const walkBones = (currBone, parentTransform, parent, parentLen) => {

            // get current bone length
            let boneLen = currBone.constLength;

            // get sprites for current bone (and if got a single value, convert to array)
            var sprites = this.skin[currBone.name] || [];
            if (!Array.isArray(sprites)) { sprites = [sprites]; }

            // no const len? calculate from sprites
            if (boneLen === undefined) {

                // get sprites and find max bone len
                boneLen = 0;
                for (let sprite of sprites) {
                    boneLen = Math.max(boneLen, sprite.sourceRect[currBone.spriteLengthComponent || 'height']);
                }
            }

            // calculate current transformations
            const transformations = {position: parentTransform.position.clone(), scale: parentTransform.scale * (currBone.scale || 1), rotation: parentTransform.rotation + (currBone.rotation || 0)};
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
                    walkBones(child, transformations, currBone, boneLen);
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
                children: [this._currStepData.root]
            }
        }

        // start walking skeleton
        walkBones(this._root, {position: this.position, rotation: this.rotation, scale: this.scale}, null, 1);
    }
}


// export the skeleton renderer
window.SkeletonRenderer = SkeletonRenderer;