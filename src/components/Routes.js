import {Component} from "react";
import {Route, Switch} from 'react-router-dom';

import Welcome from "./user/Welcome";
import CheckWeather from "./pages/check-weather/CheckWeather";

class Routes extends Component {
    render() {
        return (
            <Switch>
                <Route exact path="/" render={() => (<Welcome />)}/>
                <Route exact path="/check-weather" render={() => (<CheckWeather />)}/>
            </Switch>
        )
    }
}

export default Routes;