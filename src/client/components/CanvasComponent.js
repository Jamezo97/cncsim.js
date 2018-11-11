import * as React from "react";

const outerStyle = {
    position: "relative",
    float: "left",
    padding: "0px",
    margin: "0px",
    overflow: "hidden",
    width: "100%",
    height: "100%",
    backgroundColor: "#fee"
};

const canvasStyle = {
    position: "absolute",
    left: "0px",
    top: "0px",
    zIndex: "1",
    width: "100%",
    height: "100%"
};

const overlayStyle = {
    position: "absolute",
    left: "0px",
    top: "0px",
    zIndex: "10",
    width: "100%",
    height: "100%"
};

class CanvasComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            
        };
        this.rCanvasRefGL = React.createRef();
        this.rCanvasRefOverlay = React.createRef();
    }

    /**
     * @return {HTMLCanvasElement}
     */
    getCanvasGL() {
        return this.rCanvasRefGL.current;
    }

    /**
     * @return {HTMLCanvasElement}
     */
    getCanvasOverlay() {
        return this.rCanvasRefOverlay.current;

    }

    componentDidMount() {

    }

    onMouseDown(event) {
        
    }

    onMouseMove(event) {
        
    }

    onMouseUp(event) {
        
    }

    render() {
        return (
            <div style={outerStyle}
                onMouseDown={this.onMouseDown.bind(this)}
                onMouseMove={this.onMouseDown.bind(this)}
                onMouseUp={this.onMouseDown.bind(this)}>
                <canvas style={canvasStyle} width={this.props.canvasWidth} height={this.props.canvasHeight}>
                    Your browser doesn't appear to support the <code>&lt;canvas&gt;</code> element.
                </canvas>
                <canvas style={overlayStyle} width={this.props.canvasWidth} height={this.props.canvasHeight}></canvas>
            </div>
        );
    }//style="position: relative; float: left; padding: 0px; margin: 0px; overflow: hidden; width: 100%; height: 100%;"

}

export {CanvasComponent}