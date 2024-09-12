async function postApiService(url,Obj) {
    try {
        const options = {
            method: "POST", 
            mode: "cors", 
            cache: "no-cache", 
            credentials: "same-origin", //include is used to set cookies
            headers: {
              "Content-Type": "application/json",
            },
            redirect: "follow",
            referrerPolicy: "no-referrer", 
            body: JSON.stringify(Obj)
        };
        const response = await fetch(url,options);
        const responseJson = await response.json();
        return responseJson;
    } catch (error) {
        return error;
    }
}
export { postApiService };