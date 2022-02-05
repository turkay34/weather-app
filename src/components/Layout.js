import {Component} from "react";
import Routes from "./Routes";
import {BrowserRouter} from "react-router-dom";

class Layout extends Component {
    render() {
        return (
            <BrowserRouter>
                <Routes/>
            </BrowserRouter>
        )
    }
}

export default Layout;