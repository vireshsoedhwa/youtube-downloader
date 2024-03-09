import { useEffect, useState } from 'react';


const useGetResourcesbySession = () => {
    const [Resources, setResources] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);


    setIsLoading(true);
    fetch(`/resource/get_list_by_session`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            setResources(data);
            setIsLoading(false);
        })
        .catch(error => {
            setError(error.message);
            setIsLoading(false);
        });

    return { Resources, isLoading, error, fetchresources };

}

export default useGetResourcesbySession;

