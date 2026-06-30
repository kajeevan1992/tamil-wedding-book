import React, { useState, useCallback, useRef } from 'react'
import { GoogleMap, Marker, useLoadScript, useJsApiLoader, Autocomplete } from '@react-google-maps/api'


const mapStyle = {
    height: '300px',
    width: '100%'
}

export default function MapView(props) {
    // const autocompleteRef = useRef();


    const DEFAULT_ZOOM = 5
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: `${process.env.REACT_APP_GOOGLE_MAP_API_KEY}`,
        libraries: ['places']
    });

    const [map, setMap] = useState(null)
    const [markerPosition, setMarkerPosition] = useState({
        lat: 28.0289837,
        lng: 1.6666663,
    })

    const [defaultLocation, setDefaultLocation] = useState({
        lat: 28.0289837,
        lng: 1.6666663,
    })

    const onLoad = useCallback((map) => {
        const bounds = new window.google.maps.LatLngBounds({
            lat: 28.0289837,
            lng: 1.6666663,
        });
        map.fitBounds(bounds);
        setMap(map)
    }, []);





    const onUnmount = useCallback(() => {
        setMap(null)
    }, [])


    const handelClickOnMap = () => {

    }

    // Autocomplete
    //! Ref incase of any issue: https://codesandbox.io/s/react-google-maps-api-multiple-markers-infowindow-forked-dpueyy?file=/src/App.js
    const [searchResult, setSearchResult] = useState("Result: none");

    function onLoadAutocomplete(autocomplete) {
        setSearchResult(autocomplete);
    }

    function onPlaceChanged() {
        if (searchResult !== null) {
            //variable to store the result
            const place = searchResult.getPlace();
            //variable to store the name from place details result 
            const name = place.name;
            //variable to store the status from place details result
            const status = place.business_status;
            //variable to store the formatted address from place details result
            const formattedAddress = place.formatted_address;
            // console.log(place);
            //console log all results
            console.log(`Name: ${name}`);
            console.log(`Business Status: ${status}`);
            console.log(`Formatted Address: ${formattedAddress}`);
        } else {
            alert("Please enter text");
        }
    }
    return (
        <div>
            {
                isLoaded && <>
                    {props.searchProps && <div className={`${props.searchProps.mbClassName ? props.searchProps.mbClassName : 'mb-4'}`}>
                        {props.label && <label className={`${props.searchProps.labelClassName ? props.searchProps.labelClassName : ''}`}>{props.label}</label>}
                        <div className={`${props.searchProps.icon ? 'input-group password-hidden' : ''} ${props.searchProps.className !== null ? props.searchProps.className : ''}`}>
                            <Autocomplete
                                onPlaceChanged={onPlaceChanged}
                                onLoad={onLoadAutocomplete}
                            >
                                <input
                                    type="text"
                                    placeholder={props.searchProps.placeholder}
                                    value={props.searchProps.address}
                                    className={`form-control own-input ${props.searchProps?.allBorders ? '' : 'only-b-brdr-grey'} ${props.searchProps.inputClass}`}
                                />
                            </Autocomplete>
                            {props.searchProps.icon && <span
                                className={`input-group-text cursor-pointer  ${props.searchProps?.allBorders ? 'borderd-password-toggle' : 'transparent-password-toggle'}`}>
                                <i className={props.searchProps.icon}></i>
                            </span>}
                        </div>
                        {
                            props.searchProps.errors[props.searchProps.selector] &&
                            <div className="invalid-feedback">
                                {props.searchProps.errors[props.searchProps.selector][0]}
                            </div>
                        }
                    </div>
                    }
                    <GoogleMap
                        onLoad={onLoad}
                        center={defaultLocation}
                        zoom={DEFAULT_ZOOM}
                        mapContainerStyle={mapStyle}
                        onClick={handelClickOnMap}
                        onUnmount={onUnmount}
                    >
                        <Marker position={markerPosition} />
                    </GoogleMap>
                </>
            }
        </div>
    )
}
