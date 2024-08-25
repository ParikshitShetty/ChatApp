const base64Encoder = async (fileObj) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        try {
          // Use a regex to remove data URL part
          const base64String = reader.result
            .replace('data:', '')
            .replace(/^.+,/, '');
          console.log(base64String);
          resolve(base64String);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject; // Handle any errors that occur during file reading
      reader.readAsDataURL(fileObj.fileBuf);
    });
};

export { base64Encoder };