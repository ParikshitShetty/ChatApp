async function postApiService(url,Obj) {
    try {
        const options = {
            method: "POST", 
            mode: "cors", 
            cache: "no-cache", 
            credentials: "include", //include is used to set cookies
            headers: {
              "Content-Type": "application/json",
            },
            redirect: "follow",
            referrerPolicy: "no-referrer", 
            body: JSON.stringify(Obj)
        };
        const response = await fetch(url,options);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        console.error('Fetch error:', error);
        return error;
    }
}
export { postApiService };