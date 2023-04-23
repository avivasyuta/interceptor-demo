import { useState, useEffect } from 'react'

import HttpRequestMock from 'http-request-mock';
const mocker = HttpRequestMock.setup();

mocker.mock({
    url: 'https://jsonplaceholder.typicode.com/posts/1',
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    async response(requestInfo) {
        // 1. intercept a request, do something (here, output the original request information)
        console.log('original request info: ', requestInfo);

        // 2. then make the original call and capture the response
        const res = await requestInfo.doOriginalCall();

        // 3. and do something again.
        console.log('original response:', res);
        return {fake: 133};
    },
});

function App() {
    const [fetchResponse, setFetchResponse] = useState(null)
    const [xhrResponse, setXhrResponse] = useState(null)

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/posts/1')
            .then((response) => {
                console.log('response', response)
                return response.json()
            })
            .then((json) => setFetchResponse(json));

        const xhr = new XMLHttpRequest();
        xhr.responseType = 'json';
        xhr.open('GET', 'https://jsonplaceholder.typicode.com/posts/1', true);
        xhr.send(null);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                setXhrResponse(xhr.response)
            }
        }
    }, [])

    return (
        <>
            <h3>XHR Response</h3>
            <pre>
                {JSON.stringify(xhrResponse, null, 4)}
            </pre>

            <h3>Fetch Response</h3>
            <pre>
                {JSON.stringify(fetchResponse, null, 4)}
            </pre>
        </>
    )
}

export default App
