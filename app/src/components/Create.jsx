import React, { Fragment, useEffect, useState, useRef } from 'react';

import { Navigate } from "react-router-dom";

export default function Create() {

    const [Error, setError] = useState(null)
    const [Result, setResult] = useState(null)
    const [Submitted, setSubmitted] = useState(false)


    // useEffect(() => {
    //     if (Result) {
    //         let resultstatus = Result['status']
    //         if (resultstatus == "QUEUED" || resultstatus == "BUSY") {
    //             setPollingdelay(1000)
    //         }
    //         else {
    //             setPollingdelay(null)
    //         }
    //         setYoutube_id(Result['youtube_id'])
    //         setId(Result['id'])
    //         setStatus(resultstatus)
    //         setError(Result['error'])

    //     }
    // }, [Result]);

    // const getresult = () => {
    //     let headers = new Headers()
    //     headers.append("X-CSRFTOKEN", document.querySelector('[name=csrfmiddlewaretoken]').value)
    //     const request = new Request('/api/resource/' + Id + '/getresult', {
    //         method: 'GET',
    //         headers: headers
    //     });

    //     fetch(request)
    //         .then(async (response) => {
    //             if (response.ok) {
    //                 const jsonResponse = await response.json();
    //                 setResult(jsonResponse)
    //                 setError(null)
    //             }
    //             else {
    //                 const jsonResponse = await response.json();
    //                 try {
    //                     setError(jsonResponse)
    //                 } catch {
    //                     setError("Unknown error")
    //                 }
    //             }
    //         })
    // }

    const create = (url) => {
        let headers = new Headers()
        headers.append("X-CSRFTOKEN", document.querySelector('[name=csrfmiddlewaretoken]').value)
        const formData = new FormData();
        formData.append("url", url);
        let data = new URLSearchParams(formData)
        const request = new Request('/api/resource/', {
            method: 'POST',
            headers: headers,
            body: data
        });

        fetch(request)
            .then(async (response) => {
                if (response.ok) {
                    const jsonResponse = await response.json();
                    setResult(jsonResponse)
                    setSubmitted(true)
                    setError(null)
                }
                else {
                    const jsonResponse = await response.json();
                    try {
                        setError(jsonResponse['non_field_errors'][0])
                    } catch {
                        setError("Unknown error")
                    }
                }
            })
    }

    const handleSubmit = (event) => {
        let url = event.target[0].value
        event.preventDefault();
        create(url)
    };

    // const handleReset = () => {
    //     setStatus("NEW")
    // };

    // const SUBMISSION_STATES = {
    //     NEW:
    //         <>
    //             <button type="submit"
    //                 class="text-white bg-blue-700 hover:bg-blue-800 
    //             focus:ring-4 focus:outline-none focus:ring-blue-300 
    //             font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 
    //             text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
    //                 Submit
    //             </button>
    //         </>,
    //     QUEUED:
    //         <div class="font-sans">
    //             QUEUED
    //             <svg class="animate-spin ml-1 mr-3 h-fit w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    //                 <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
    //                 <path class="opacity-75" fill="blue" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    //             </svg>
    //         </div>,
    //     BUSY:
    //         <div>
    //             <Preview youtube_id={Youtube_id} />
    //             <Infopanel result={Result} />
    //         </div>,
    //     DONE:
    //         <>
    //             <Preview youtube_id={Youtube_id} />
    //             <div class="flex flex-col justify-around gap-4">
    //                 <div class="flex flex-row justify-evenly">
    //                     <a
    //                         href={"/api/resource/" + Id + "/getvideo"}>
    //                         Download Video
    //                         <svg xmlns="http://www.w3.org/2000/svg"
    //                             fill="none" viewBox="0 0 24 24" stroke-width="1.5"
    //                             stroke="currentColor"
    //                             class="w-6 h-6 m-auto">
    //                             <path stroke-linecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
    //                         </svg>
    //                     </a>
    //                     <a href={"/api/resource/" + Id + "/getaudio"}>
    //                         Download Audio
    //                         <svg xmlns="http://www.w3.org/2000/svg"
    //                             fill="none" viewBox="0 0 24 24" stroke-width="1.5"
    //                             stroke="currentColor"
    //                             class="w-6 h-6 m-auto">
    //                             <path stroke-linecap="round" stroke-linejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
    //                         </svg>
    //                     </a>
    //                 </div>
    //                 <button type="reset"
    //                     class="text-white bg-blue-700 hover:bg-blue-800 
    //                 focus:ring-4 focus:outline-none focus:ring-blue-300 
    //                 font-medium rounded-lg text-sm w-full sm:w-auto
    //                 px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 
    //                 dark:focus:ring-blue-800">
    //                     Reset
    //                 </button>
    //             </div>
    //         </>,
    // }

    return (
        <>
            <div class="container mx-auto">
                {Submitted && (
                    <Navigate to={"/detail/" + Result['id']} replace={true} />
                )}
                <form onSubmit={handleSubmit} >
                    <div class="mb-6">
                        <label for="url"
                            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                            youtube url</label>
                        <input type="url" id="url"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="https://www.youtube.com/watch?v=..." required />
                    </div>
                    {Error &&
                        <div class="font-sans text-red-700 italic mb-4">
                            {Error}
                        </div>
                    }
                    <button type="submit"
                        class="text-white bg-blue-700 hover:bg-blue-800 
                            focus:ring-4 focus:outline-none focus:ring-blue-300 
                            font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 
                            text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Submit
                    </button>

                    {/* {
                        SUBMISSION_STATES[Status]
                    } */}
                </form>
            </div>
        </>
    );
}




