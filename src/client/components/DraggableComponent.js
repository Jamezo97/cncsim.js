import * as React from "react";


class DraggableComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isDragging: false
        };

        this.onDragHandler = props.onDrag;

        this.lastX = 0;
        this.sumX = 0;

        window.addEventListener("mousemove", this.onMouseMove.bind(this));
        window.addEventListener("mouseup", this.onMouseUp.bind(this));
    }

    componentDidMount() {
        
    }

    onMouseDown(event) {
        this.lastX = event.clientX;
        this.state.isDragging = true;
        this.setState(this.state);
    }
    onMouseUp(event) {
        this.state.isDragging = false;
        this.setState(this.state);
    }
    onMouseMove(event) {
        if(this.state.isDragging) {
            let dx = event.clientX - this.lastX;
            this.lastX = event.clientX;
            this.sumX += dx;
            this.onDragHandler(dx);
        }
    }

    render() {
        return (
            <div style={{width: "100%", height: "100%", backgroundColor: this.state.isDragging?"#999":"#ccc", cursor: "w-resize"}}
                onMouseDown={this.onMouseDown.bind(this)}
            >
                
            </div>
        );
    }

}

export {DraggableComponent}