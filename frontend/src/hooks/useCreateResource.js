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

        console.log(event.target.url.value)

        await fetch(`/api/resource/`, {
            method: 'POST',
            headers: {
                'X-CSRFTOKEN': document.querySelector('[name=csrfmiddlewaretoken]').value,
            },
            body: ""
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        setCreateResourceError(errorData)
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
