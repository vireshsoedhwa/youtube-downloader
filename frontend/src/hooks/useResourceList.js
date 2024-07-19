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

        console.log("getting resource list")

        await fetch(`/api/resource/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // 'X-CSRFTOKEN': document.querySelector('[name=csrfmiddlewaretoken]').value,
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
                console.log("step 1")
                setResourceListData(data)
                console.log(data)
                setResourceListIsSuccesful(true)
            })
            .catch((error) => {
                console.log("step 2")
                console.log(error.message)
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
