import * as React from "react";
import {render} from "react-dom";
import * as $ from "jquery";

import './css/main.css';
import logo from "./res/logo.png";
import {CNCSimulator} from "../cnc/CNCSimulator";
import {CanvasComponent} from "./components/CanvasComponent";
import {ControlsComponent} from "./components/ControlsComponent";
import {DraggableComponent} from "./components/DraggableComponent";



import { isNullOrUndefined } from "../Util";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            leftWidth: 100,
            rightWidth: 100,
            barWidth: 20,
            pageHeight: 100
        };

        this.viewportState = {
            dividerX: -1,
            width: -1,
            height: -1
        };

        this.rCanvasRef = React.createRef();
        this.rControlRef = React.createRef();

        window.addEventListener("resize", this.recalculateViewport.bind(this));
    }

    /**
     * @return {CanvasComponent}
     */
    getCanvasComponent() {
        return this.rCanvasRef.current;
    }

    /**
     * @return {ControlsComponent}
     */
    getControlsComponent() {
        return this.rControlRef.current;
    }

    componentWillMount() {
        this.updateViewportBounds();
        this.viewportState.dividerX = this.viewportState.width - this.state.barWidth - 400;
        if(this.viewportState.dividerX < 0) this.viewportState.dividerX = 0;
        this.recalculateViewport();
    }

    updateViewportBounds() {
        this.viewportState.width = document.getElementsByTagName("html")[0].clientWidth;
        this.viewportState.height = window.innerHeight;
    }

    componentDidMount() {
        this.getCanvasComponent().getCanvasGL();
    }

    /**
     * @return {TestComponent}
     */
    getTestComponent() {
        return this.refTestComponent.current;
    }

    recalculateViewport() {
        this.state.leftWidth = this.viewportState.dividerX;
        this.state.rightWidth = this.viewportState.width - this.viewportState.dividerX - this.state.barWidth;
        this.state.pageHeight = this.viewportState.height;

        this.setState(this.state);
    }

    onBarDragged(dx) {
        this.viewportState.dividerX += dx;
        if(this.viewportState.dividerX < 0) {
            this.viewportState.dividerX = 0;
        } else if(this.viewportState.dividerX+this.state.barWidth > this.viewportState.width) {
            this.viewportState.dividerX = this.viewportState.width - this.state.barWidth;
        }
        this.recalculateViewport();
    }

    render() {
        return (
            <div>
                <div style={{height: `${this.state.pageHeight}px`}}>
                    <div style={{float: "left", width: `${this.state.leftWidth}px`, height: "100%"}}>
                        <CanvasComponent
                            cnc={this.mCNC}
                            ref={this.rCanvasRef}
                            canvasWidth={this.state.leftWidth}
                            canvasHeight={this.state.pageHeight}
                        />
                    </div>
                    <div style={{float: "left", width: `${this.state.barWidth}px`, height: "100%", backgroundColor: "#ccc"}}>
                        <DraggableComponent 
                            onDrag={this.onBarDragged.bind(this)}
                        />
                    </div>
                    <div style={{float: "left", width: `${this.state.rightWidth}px`, height: "100%"}}>
                        <ControlsComponent 
                            cnc={this.mCNC}
                            ref={this.rControlRef}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

render((<App/>), document.getElementById("app"));