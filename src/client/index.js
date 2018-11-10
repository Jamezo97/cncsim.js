import * as React from "react";
import {render} from "react-dom";
import * as $ from "jquery";

import './css/main.css';
import logo from "./res/logo.png";

import {CanvasComponent} from "./components/CanvasComponent";
import { isNullOrUndefined } from "../Util";

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            schemaName: "Select A Schema First",
            message: "Heading 2"
        };

        this.rCanvasComponent = React.createRef();
    }

    componentDidMount() {
        // After created and put in page
    }

    /**
     * @return {TestComponent}
     */
    getTestComponent() {
        return this.refTestComponent.current;
    }

    onSelect(str) {
        alert("You clicked: " + str);
    }

    render() {
        return (
            <div>
                <div style={{float: "left"}}>
                </div>
            </div>
            <div className="container-fluid">
                <div className="row">
                    <div className="col-md-12">
                        <img width="20px" src={logo}/>
                        <h1>Hello Example Component</h1>
                        <CanvasComponent
                            ref={this.rCanvasComponent}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

render((<App/>), document.getElementById("app"));