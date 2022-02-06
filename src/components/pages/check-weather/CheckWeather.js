import React, {Component} from "react";
import {
    Box,
    Container,
    TextField,
    Autocomplete,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer
} from "@mui/material";
import Paper from '@mui/material/Paper';
import {toast, ToastContainer} from "react-toastify";
import TurkeyMap from 'turkey-map-react';
import "antd/dist/antd.css";
import { Tooltip } from "antd";

import instance from "../../../api/WeatherApi";
import {turkeyCities} from "../../data/TurkeyCities";
import classes from "../../user/Welcome.module.scss";
import {BAD_REQUEST, UNAUTHORIZED} from "../../../helpers/constants";

class CheckWeather extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apiKey: '',
            apiResult: []
        }
    }

    componentDidMount() {
        this.setState({apiKey: sessionStorage.getItem('apiKey')})
    }

    getWeatherStatus(apiKey, lat, lon) {
        instance.get(`/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`)
            .then((response) => this.setState(prevState => ({
                apiResult: [...prevState.apiResult, response.data]
            }))).catch(function (error) {
            if(error.response.status === UNAUTHORIZED) {
                toast.error("Looks like your API Key is deprecated or wrong.")
                sessionStorage.removeItem('apiKey')
                setTimeout(
                    function () {
                        window.location = '/';
                    }, 3000
                );
            }
            else if(error.response.status === BAD_REQUEST) {
                toast.warning("We're having a crisis in our servers...")
            }
        })
    }

    getLatitudeAndLongitude(cityName) {
        let selectedCity = turkeyCities.filter(city => city.label === cityName)[0]
        let [cityLatitude, cityLongitude] = [selectedCity.latitude, selectedCity.longitude]
        if (this.state.apiResult.filter(city => city.name === selectedCity.label).length > 0) {
            toast.warning("Whoops, looks like you already listed that city!")
        } else (
            this.getWeatherStatus(this.state.apiKey, cityLatitude, cityLongitude)
        )
    }

    kelvinToCelsius(kelvinValue) {
        let celsiusValue = (kelvinValue - 273.15)
        return (Math.round(celsiusValue * 100) / 100).toFixed(2);
    }


    render() {
        let data = this.state.apiResult;
        return (
            <Container>
                <Box
                    className={classes.citySelectWrapper}
                    sx={{
                        margin: 'auto',
                        width: 300,
                        height: 110,
                    }}
                >
                    <Autocomplete
                        onChange={(event) => this.getLatitudeAndLongitude(event.target.innerHTML)}
                        disablePortal
                        id="combo-box-demo"
                        options={turkeyCities}
                        sx={{width: 300}}
                        renderInput={(params) => <TextField {...params} label="Choose City"/>}
                    />
                </Box>
                <Box sx={{
                    margin: 'auto',
                    width: '100%',
                    height: '100%'
                }}>
                    <TurkeyMap
                        onClick={(event) => this.getLatitudeAndLongitude(event.name)}
                        cityWrapper={(cityComponent, cityData) => (
                            <Tooltip
                                title={`${cityData.plateNumber} - ${cityData.name}`}
                                key={cityData.id}
                            >
                                {cityComponent}
                            </Tooltip>
                        )}
                    />
                </Box>
                <Box sx={{margin: 'auto', width: '100%', height: '100%'}}>
                    <TableContainer component={Paper}>
                        <Table aria-label="collapsible table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>City</TableCell>
                                    <TableCell align="right">Latitude</TableCell>
                                    <TableCell align="right">Longitude</TableCell>
                                    <TableCell align="right">Temperature</TableCell>
                                    <TableCell align="right">Humidity</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map(city => (
                                    <React.Fragment key={city.id}>
                                        <TableRow sx={{'& > *': {borderBottom: 'unset'}}}>
                                            <TableCell component="th" scope="row">{city.name}</TableCell>
                                            <TableCell align="right">{city.coord.lat}</TableCell>
                                            <TableCell align="right">{city.coord.lon}</TableCell>
                                            <TableCell
                                                align="right">{this.kelvinToCelsius(`${city.main.temp}`)}</TableCell>
                                            <TableCell align="right">%{city.main.humidity}</TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
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

export default CheckWeather;