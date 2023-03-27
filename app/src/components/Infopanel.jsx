import React, { Fragment, useEffect, useState, useRef } from 'react';

export default function Infopanel(props) {

    return (
        <div class="container mx-auto m-5">
            <div>
                Eta: {props.result['eta']} seconds
            </div>
            <div>
                transfer rate: {props.result['speed']} bytes/s
            </div>
        </div >
    )
}
