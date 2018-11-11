
import {FAUNC} from "./FAUNC";

class CNCSimulator {

    constructor() {
        this.controller = new FAUNC();

        /**
         * @type {Element}
         */
        this.canvasRender = null;
        /**
         * @type {Element}
         */
        this.canvasOverlay = null;
    }

    setCanvas(canvasRender, canvasOverlay) {
        this.canvasRender = canvasRender;
        this.canvasOverlay = canvasOverlay;
    }

}

export {CNCSimulator};