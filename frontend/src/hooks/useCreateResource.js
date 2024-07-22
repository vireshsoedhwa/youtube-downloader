import { useState } from "react";



const useCreateResource = () => {
    const [createResourceIsSuccesful, setCreateResourceIsSuccesful] = useState(false);
    const [createResourceIsLoading, setCreateResourceIsLoading] = useState(false);
    const [createResourceIsSubmitted, setCreateResourceIsSubmitted] = useState(false);
    const [createResourceError, setCreateResourceError] = useState(false);

    const createResource = async (event) => {
        event.preventDefault();
        setCreateResourceIsSubmitted(true);
        setCreateResourceIsLoading(true);

        await fetch(`/api/resource/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFTOKEN': document.querySelector('[name=csrfmiddlewaretoken]').value,
                'mode': 'same-origin'
            },
            body: JSON.stringify({
                url: event.target.url.value
            })
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        setCreateResourceError(errorData)
                        console.log(JSON.stringify(errorData))
                        throw new Error('error creating')
                    })
                }
                return response.json();
            })
            .then((data) => {
                setCreateResourceIsSuccesful(true)
            })
            .catch((error) => {
                setCreateResourceIsSuccesful(false)
            })
            .finally(() => {
                setCreateResourceIsLoading(false)
            })
    }
    return {
        createResourceIsSuccesful,
        createResourceIsLoading,
        createResourceIsSubmitted,
        createResourceError,
        createResource
    }
}

export default useCreateResource
