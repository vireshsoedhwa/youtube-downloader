import React, { Fragment, useEffect, useState, useRef } from 'react';

export default function Home(props) {

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`/resource/get_list_by_session`, {
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

        fetchData();
    }, []); // Empty dependency array ensures that this effect runs once, similar to componentDidMount



    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }


    return (
        <>
            <div>

                <div class="relative overflow-x-auto">
                    <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" class="px-6 py-3">
                                    ID
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    URL
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    STATUS
                                </th>
                                <th scope="col" class="px-6 py-3">
                                    Time Left (seconds)
                                </th>
                            </tr>
                        </thead>
                        <tbody>


                            {data && (
                                <>
                                    {data.map((item) => (

                                        <tr key={item.id} class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                            <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                                {item.id}
                                            </th>
                                            <td class="px-6 py-4">
                                                {item.url}
                                            </td>
                                            <td class="px-6 py-4">
                                                {item.status}
                                            </td>
                                            <td class="px-6 py-4">
                                                {item.eta}
                                            </td>
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
