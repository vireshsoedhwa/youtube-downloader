import React, { Fragment, useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom'

import { useInterval } from './helper';

export default function Home(props) {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useInterval(async () => {
        fetchData()
    }, 5000);

    useEffect(() => {
        fetchData()
    }, []);


    const fetchData = async () => {
        try {
            const response = await fetch(`/api/resource/get_list_by_session`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const result = await response.json();
            setData(result);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div>
                <svg class="animate-spin h-10 w-10 m-10" viewBox="0 0 24 24">
                    <circle class="opacity-0" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-50" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            </div>
        )
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <>
            <div>
                <div class="relative overflow-x-auto overflow-visible">
                    <table class="table-auto w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" class="px-6 py-3">
                                    #
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Source
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    ETA
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Video
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Audio
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data && (
                                <>
                                    {data.map((item) => (
                                        <tr key={item.id} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                            <th scope="row" class="pl-2 py-2 w-28 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {/* <Link to={'/detail/' + item.id}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                        className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                                    </svg>
                                                </Link> */}

                                                <Link to={'/detail/' + item.id}>
                                                    <img class="h-20 object-scale-down"
                                                        src={"https://img.youtube.com/vi/" + item.youtube_id + "/sddefault.jpg"}
                                                    />
                                                </Link>

                                            </th>
                                            <td class="px-6 py-4">

                                                <a target="_blank" href={item.url}>
                                                    <div class="flex flex-col">
                                                        {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                            strokeWidth={1.5}
                                                            stroke="currentColor"
                                                            className="w-6 h-6">
                                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                                d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                                                        </svg> */}
                                                        <p class="">
                                                            {item.title.substring(0, 30)} {item.title.length >= 30 && '...'}
                                                        </p>
                                                    </div>
                                                </a>

                                            </td>
                                            <td class="px-6 py-4">
                                                {item.status === "DONE" ?
                                                    <>
                                                        {item.status}
                                                    </>
                                                    :
                                                    <>
                                                        {item.eta} sec
                                                    </>
                                                }
                                            </td>
                                            {item.status === "DONE" &&
                                                <>
                                                    <td class="px-6 py-4">
                                                        <a
                                                            href={"/api/resource/" + item.id + "/getvideo"}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                                                stroke="currentColor"
                                                                class="w-6 h-6 mx-0">
                                                                <path stroke-linecap="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25h-9A2.25 2.25 0 002.25 7.5v9a2.25 2.25 0 002.25 2.25z" />
                                                            </svg>
                                                        </a>
                                                    </td>
                                                    <td class="px-6 py-4">
                                                        <a href={"/api/resource/" + item.id + "/getaudio"}>
                                                            <svg xmlns="http://www.w3.org/2000/svg"
                                                                fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                                                stroke="currentColor"
                                                                class="w-6 h-6 mx-0">
                                                                <path stroke-linecap="round" stroke-linejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
                                                            </svg>
                                                        </a>
                                                    </td>
                                                </>
                                            }
                                        </tr>
                                    ))}
                                </>)}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}



