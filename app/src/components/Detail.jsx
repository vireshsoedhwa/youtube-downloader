import React, { Fragment, useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom'

import Infopanel from './Infopanel';
import { useInterval } from './helper';

export default function Detail() {
    let { id } = useParams();
    const [Detail, setDetail] = useState("");
    const [Busy, setBusy] = useState(true);
    const [Error, setError] = useState(null);
    const [Pollingdelay, setPollingdelay] = useState(null)

    useInterval(async () => {
        fetchDetail()
    }, Pollingdelay);


    useEffect(() => {
        fetchDetail()
    }, []);

    useEffect(() => {
        if (Detail.status == "QUEUED" || Detail.status == "BUSY") {
            setPollingdelay(2000)
            setBusy(true)
        }
        else {
            setBusy(false)
            setPollingdelay(null)
        }
    }, [Detail]);




    const fetchDetail = async () => {
        try {
            const response = await fetch("/api/resource/" + id,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            setDetail(result);
        } catch (error) {
            setError(error);
        } finally {
            setBusy(true);
        }
    };


    return (
        <div class="container mx-auto m-5">

            <div class="flex flex-col justify-around gap-4">
                <h1 class="text-center">{Detail.title}</h1>
                {Busy ?
                    <>
                        <Infopanel result={Detail} />
                    </>
                    :
                    <div class="flex flex-row justify-evenly">
                        <a
                            href={"/api/resource/" + Detail.id + "/getvideo"}>
                            Download Video
                            <svg xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor"
                                class="w-6 h-6 m-auto">
                                <path stroke-linecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                            </svg>
                        </a>
                        <a href={"/api/resource/" + Detail.id + "/getaudio"}>
                            Download Audio
                            <svg xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                stroke="currentColor"
                                class="w-6 h-6 m-auto">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
                            </svg>
                        </a>
                    </div>
                }
                {Error &&
                    <div class="font-sans text-red-700 italic mb-4">
                        {Error}
                    </div>
                }

                <img class="object-contain"
                    src={"https://img.youtube.com/vi/" + Detail.youtube_id + "/sddefault.jpg"}
                />
            </div>
        </div >
    )
}
