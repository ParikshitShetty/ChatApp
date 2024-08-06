import React from 'react';
import { MdDownloadForOffline } from "react-icons/md";
// Common functions
import { fileNameSplitter } from '../../common/fileSizeCalculator';

function Download({message}) {
    const downloadFile = async(file) => {
        try {
          const url = import.meta.env.VITE_DOWNLOAD_FILE;
          const options = {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", //include is used to set cookies
            headers: {
              "Content-Type": "application/json",
            },
            redirect: "follow",
            referrerPolicy: "no-referrer", 
            body: JSON.stringify({file})
          };
          const response = await fetch(url,options);
          const responseBlob = await response.blob();
  
          const downloadUrl = window.URL.createObjectURL(responseBlob);
          const a = document.createElement('a');
          a.style.display = 'none';
          a.href = downloadUrl;
          a.download = file.split('/').pop(); // Extract the file name
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
          console.error("Error while downloading file: ",error)
        }
    }

  return (
    <>
        <div className='flex justify-between items-center py-1'>
            <p className='first-letter:uppercase break-words w-[80%]'>{fileNameSplitter(message?.path)}</p>
            <MdDownloadForOffline onClick={() => downloadFile(message?.path)}
            className='w-6 h-6 cursor-pointer' />
        </div>
    </>
  )
}

export default Download