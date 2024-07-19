import { useState } from "react";


const usePreviewResource = () => {
    const [PreviewResourceData, setPreviewResourceData] = useState(false);
    const [PreviewResourceIsSuccesful, setPreviewResourceIsSuccesful] = useState(false);
    const [PreviewResourceIsLoading, setPreviewResourceIsLoading] = useState(false);
    const [PreviewResourceIsSubmitted, setPreviewResourceIsSubmitted] = useState(false);
    const [PreviewResourceError, setPreviewResourceError] = useState(false);

    const PreviewResource = async (id) => {
        setPreviewResourceIsSubmitted(true);
        setPreviewResourceIsLoading(true);

        await fetch(`/api/resource/${id}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFTOKEN': document.querySelector('[name=csrfmiddlewaretoken]').value,
                'mode': 'same-origin'
            }
        })
            .then((response) => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        setPreviewResourceError(errorData)
                        console.log(JSON.stringify(errorData))
                        throw new Error('error creating')
                    })
                }
                return response.json();
            })
            .then((data) => {
                setPreviewResourceData(data)
                setPreviewResourceIsSuccesful(true)
            })
            .catch((error) => {
                console.log("step 2")
                console.log(error.message)
                setPreviewResourceIsSuccesful(false)
            })
            .finally(() => {
                setPreviewResourceIsLoading(false)
            })
    }
    return {
        PreviewResourceData,
        PreviewResourceIsSuccesful,
        PreviewResourceIsLoading,
        PreviewResourceIsSubmitted,
        PreviewResourceError,
        PreviewResource
    }
}

export default usePreviewResource
