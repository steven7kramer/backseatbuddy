/**
 * Facilitates the drawing of Avatars by providing methods to draw certain characteristics.
 * Uses the SVGJS library. Documentation: https://svgjs.com/docs/2.7/getting-started/
 *
 * @param int size The size of the avatar
 * @constructor
 */
function BackseatPainter(size, container) {

    var object = {};

    // Defining all colors
    const BACKSEAT_PINK = "#e83273";
    const BACKSEAT_LBLUE = "#1d70b8";
    const BACKSEAT_DBLUE = "#2d2e83";
    const FACE_COLOR = "#1d70b8";

    // Check whether the size variable is properly defined
    if (typeof(size) !== "number" || size <= 0) {
        console.error("BackseatPainter() failed: " + size + " is not a valid size.");
        return false;
    }

    // Check whether the container variable is properly defined
    if (typeof(container) !== "string") {
        console.error("BackseatPainter() failed: " + container + " is not a valid container name.");
        return false;
    }

    // Create the canvas
    object.draw = SVG(container).size(size, size);

    /**
     * Stores the size of the drawing
     */
    object.size = size;

    /**
     * Stores the size of the drawing
     */
    object.faceSize = size;

    /**
     * Draws the face
     */
    object.drawFace = function() {
        var scale = this.faceSize;
        var offset = (this.faceSize - scale) * 0.5;
        this.draw.rect(scale, scale).fill(FACE_COLOR).move(offset, offset);
        this.drawEyes();
    }

    /**
     * Draws the eyes
     */
    object.drawEyes = function () {

        // Draw the left eye
        var scale = this.faceSize * 0.25;
        var yOffset = scale;
        var xOffset = scale / 2;
        this.draw.rect(scale, scale).fill("#fff").move(xOffset, yOffset);

        // Draw right eye
        xOffset += scale * 2;
        this.draw.rect(scale, scale).fill("#fff").move(xOffset, yOffset);

        // Draw the right iris
        scale = scale * 0.5;
        xOffset += scale / 2;
        yOffset += scale / 2;
        this.draw.rect(scale, scale).fill(BACKSEAT_DBLUE).move(xOffset, yOffset);

        // Draw the left iris
        xOffset -= scale * 4;
        this.draw.rect(scale, scale).fill(BACKSEAT_DBLUE).move(xOffset, yOffset);
    }

    /**
     * Draws the glasses
     */
    object.drawGlasses = function(type) {
        // Check the type of the glasses
        switch (type) {
            case "none":
                // No glasses, draw nothing
                break;
            case "classic":
                // Draw classic, black, cool sunglasses
                this.draw.rect(this.faceSize * 0.4, this.faceSize * 0.3).fill({color: "#000", opacity:0.75}).stroke({color: "#000", width: 5}).move(this.faceSize * 0.05, this.faceSize * 0.20);
                this.draw.rect(this.faceSize * 0.4, this.faceSize * 0.3).fill({color: "#000", opacity:0.75}).stroke({color: "#000", width: 5}).move(this.faceSize * 0.55, this.faceSize * 0.20);

                var lineY = this.faceSize * 0.35;
                this.draw.line(0, lineY, this.faceSize * 0.05, lineY).stroke({ color: "#000", width: 5 });
                this.draw.line(this.faceSize * 0.45, lineY, this.faceSize * 0.55, lineY).stroke({ color: "#000", width: 5 });
                this.draw.line(this.faceSize * 0.95, lineY, this.faceSize, lineY).stroke({ color: "#000", width: 5 });
                break;
            case "futuristic":
                // Gewoon een snelle planga
                break;
            case "modern":
                // Pink, trendy, a bit gay glasses
                this.draw.circle(this.faceSize * 0.45).fill({color: BACKSEAT_PINK, opacity:0.5}).stroke({color: BACKSEAT_PINK, width: 10}).move(this.faceSize * 0.025, this.faceSize * 0.15);
                this.draw.circle(this.faceSize * 0.45).fill({color: BACKSEAT_PINK, opacity:0.5}).stroke({color: BACKSEAT_PINK, width: 10}).move(this.faceSize * 0.525, this.faceSize * 0.15);
                break;
            default:
            console.error("BackseatPainter.drawGlasses() failed: Glasses of type " + type + " are not supported");
        }
    }

    return object;
}
