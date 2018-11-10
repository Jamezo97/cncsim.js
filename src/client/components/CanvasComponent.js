import * as React from "react";

const outerStyle = {
    position: "relative",
    float: "left",
    padding: "0px",
    margin: "0px",
    overflow: "hidden",
    width: "100%",
    height: "100%"
};

const canvasStyle = {
    padding: "0px",
    margin: "0px"
};

const overlayStyle = {
    position: "absolute",
    left: "0px",
    top: "0px",
    zIndex: "10"
};

class CanvasComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            strings: ["Hello", "String", "Test"],
            downloading: false,
        };
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
                <canvas width="1400" height="800" style={canvasStyle}>
                    Your browser doesn't appear to support the <code>&lt;canvas&gt;</code> element.
                </canvas>
                <canvas style={overlayStyle}></canvas>
            </div>
        );
    }//style="position: relative; float: left; padding: 0px; margin: 0px; overflow: hidden; width: 100%; height: 100%;"

}

export {CanvasComponent}