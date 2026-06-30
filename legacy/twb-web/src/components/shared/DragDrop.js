
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

export default function DragDrop(props) {
    // attachLogo() {
    //     this.brandData.logo = this.$refs.logo.files[0];
    //     let reader = new FileReader();
    //     reader.addEventListener('load', function () {
    //         this.$refs.logoDispaly.src = reader.result;
    //     }.bind(this), false);

    //     reader.readAsDataURL(this.brandData.logo);
    // }



    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.forEach((file) => {
            const reader = new FileReader()

            reader.onabort = () => console.log('file reading was aborted')
            reader.onerror = () => alert('Something wrong with the uploaded file!')
            reader.onload = () => {
                // Do whatever you want with the file contents
                // const binaryStr = reader.result;
                props.fileUploaded(file);
                // console.log(binaryStr)


            }
            reader.readAsArrayBuffer(file)
        })
    }, [])

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
    } = useDropzone({
        accept: props.accept,
        onDrop
    });
    // const { getRootProps, getInputProps } = useDropzone({ onDrop })

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            {props.content}
            {isDragAccept && (<p>All files will be accepted</p>)}
            {isDragReject && (<p>Some files will be rejected</p>)}
        </div>
    )
}