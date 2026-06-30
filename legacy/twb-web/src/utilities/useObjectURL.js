import { useState, useEffect } from 'react';

export const useObjectURL = (file) => {
    const [objectURL, setObjectURL] = useState(null);

    useEffect(() => {
        if (file && file instanceof File) {
            const url = URL.createObjectURL(file);
            setObjectURL(url);

            // Cleanup function
            return () => {
                URL.revokeObjectURL(url);
            };
        } else if (file && typeof file === 'string') {
            setObjectURL(file);
        } else {
            setObjectURL(null);
        }
    }, [file]);

    return objectURL;
}; 