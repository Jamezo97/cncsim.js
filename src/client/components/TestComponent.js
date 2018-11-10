import * as React from "react";

class TestComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            strings: ["Hello", "String", "Test"],
            downloading: false,
        };
    }

    componentDidMount() {
        
    }

    onLiClicked(item, event) {
        if(this.props.onSelect) {
            this.props.onSelect(item);
        }
    }

    render() {
        let els = this.state.strings.map((item) => {
            return (<li key={item}><a href="#" onClick={this.onLiClicked.bind(this, item)}>{item}</a></li>)
        });
        return (
            <div className="example">
                <h2>
                    {this.props.text}
                </h2>
                <p>
                    <button disabled={this.state.disableButton} className={"btn btn-success"}>Test Button</button>
                </p>
                <ul>{els}</ul>
            </div>
        );
    }

}

export {TestComponent}