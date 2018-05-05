const supportedExtensions = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
    'image/svg+xml': 'svg'
};

export const getDataUrlFromBlob = (blob: Blob) =>
    new Promise<string>(resolve => {
        const fileReader = new FileReader();

        fileReader.onload = () => resolve(fileReader.result);
        fileReader.readAsDataURL(blob);
    });

export const getImageFromDataUrl = (dataUrl: string) =>
    new Promise<HTMLImageElement>(resolve => {
        const image = new Image();

        image.src = dataUrl;
        image.onload = () => resolve(image);
    });

export const getImageFromFile = (file: File) => getDataUrlFromBlob(file).then(getImageFromDataUrl);

export const resizeImage = (file: File, optimalSize: number) =>
    new Promise<File>(async (resolve, reject) => {
        const image = await getImageFromFile(file);
        const newSize = getOptimalSize(image.naturalWidth, image.naturalHeight, optimalSize);

        if (newSize.width !== image.naturalWidth || newSize.height !== image.naturalHeight) {
            const canvas = document.createElement('canvas');

            canvas.width = newSize.width;
            canvas.height = newSize.height;

            const context = canvas.getContext('2d');

            context.drawImage(image, 0, 0, newSize.width, newSize.height);
            canvas.toBlob(result => {
                if (result === null) {
                    return reject();
                }

                const imgFile = new File(
                    [result],
                    `image.${supportedExtensions[file.type] || 'png'}`,
                    {
                        type: supportedExtensions[file.type] ? file.type : 'image/png'
                    }
                );

                resolve(imgFile);
            });

            return;
        }

        resolve(file);
    });

function getOptimalSize(width: number, height: number, maxSize: number) {
    let newWidth = 0;
    let newHeight = 0;

    if (width > height) {
        const ratio = width / maxSize;
        newWidth = maxSize;
        newHeight = Math.ceil(height / ratio);
    } else if (height > width) {
        const ratio = height / maxSize;
        newHeight = maxSize;
        newWidth = Math.ceil(width / ratio);
    } else {
        newWidth = maxSize;
        newHeight = maxSize;
    }

    return { width: newWidth, height: newHeight };
}
