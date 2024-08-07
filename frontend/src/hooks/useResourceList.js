import { useState } from "react";


const useResourceList = () => {
    const [ResourceListData, setResourceListData] = useState(false);
    const [ResourceListIsSuccesful, setResourceListIsSuccesful] = useState(false);
    const [ResourceListIsLoading, setResourceListIsLoading] = useState(false);
    const [ResourceListIsSubmitted, setResourceListIsSubmitted] = useState(false);
    const [ResourceListError, setResourceListError] = useState(false);

    const ResourceList = async () => {
        setResourceListIsSubmitted(true);
        setResourceListIsLoading(true);

        await fetch(`/api/resource/`, {
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
                        setResourceListError(errorData)
                        console.log(JSON.stringify(errorData))
                        throw new Error('error creating')
                    })
                }
                return response.json();
            })
            .then((data) => {
                setResourceListData(data)
                setResourceListIsSuccesful(true)
            })
            .catch((error) => {
                setResourceListError(error)
                setResourceListIsSuccesful(false)
            })
            .finally(() => {
                setResourceListIsLoading(false)
            })
    }
    return {
        ResourceListData,
        ResourceListIsSuccesful,
        ResourceListIsLoading,
        ResourceListIsSubmitted,
        ResourceListError,
        ResourceList
    }
}

export default useResourceList
