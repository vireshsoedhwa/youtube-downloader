import React, { Fragment, useEffect, useState, useRef } from 'react';

export default function Preview(props) {

    return (
        <div class="container mx-auto m-5 w-1/2"
        >
            <img class="object-contain hover:object-scale-down"
                src={"https://img.youtube.com/vi/" + props.youtube_id + "/sddefault.jpg"}
            />
        </div >
    )
}
