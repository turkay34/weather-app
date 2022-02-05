import {Component} from "react";
import {Container, Box, TextField} from "@mui/material";
import {ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import logo from "../../assets/img/sky-atlas.png";

import classes from "./Welcome.module.scss";

class Welcome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiKey: ''
        }
    }

    componentDidMount() {
        if(sessionStorage.getItem('apiKey')) {
            toast.success("Directing to weather check page!")
            setTimeout(
                function () {
                    window.location = '/check-weather';
                }, 3000
            );
        }
    }

    apiSubmit(event) {
        if (this.state.apiKey === '') {
            event.preventDefault()
            toast.error("Whoops, api key can not be empty!")
        } else {
            sessionStorage.setItem('apiKey', this.state.apiKey)
        }
    }

    render() {
        return (
            <Container>
                <Box
                className={classes.welcomeWrapper}
                sx={{
                    margin: 'auto',
                    width: 600,
                    height: 400,
                }}
            >
                    <img src={logo} alt="skyatlas"/>
                    <h1>Weather Application</h1>
            </Box>
                <Box
                    className={classes.apiWrapper}
                    sx={{
                        margin: 'auto',
                        width: 500,
                        height: 300,
                    }}
                >
                    <TextField fullWidth onChange={(element) => this.setState({apiKey: element.target.value})}
                               label="Enter your API Key" variant="outlined"/>
                    <a onClick={this.apiSubmit.bind(this)} className={classes.apiSubmit}
                       href="/check-weather">Submit Key</a>
                </Box>
                <ToastContainer
                    position="top-right"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover/>
            </Container>
        )
    }
}

export default Welcome;