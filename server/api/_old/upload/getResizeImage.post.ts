import sharp from 'sharp'

export default defineEventHandler(async (event) => {

        const files = await readMultipartFormData(event);

        //console.log(files.length)

        let array = []
        for (let i=0; i < files.length; i++) {
                let result = new Object()

                let file = files[i]


                let arr = file.filename.split('.')
                let str = arr.splice(arr.length-2,arr.length-1)
                let originFileName = str.join('_')
               // console.log(originFileName)


                result.thumbFileName = originFileName+'_thumb.webp';
                result.compressedFileName = originFileName+'_compressed.webp';

                try {
                        
                        const metadata = await sharp(file.data as any).metadata()
                        
                        let originWidth =
                                metadata.width as number
                        let orightHeight =
                                metadata.height as number
                        let targetThumbWidth = 200
                        let targetThumbHeight =
                                (orightHeight *
                                        targetThumbWidth) /
                                originWidth
                                        ? Math.floor(
                                                  (orightHeight *
                                                          targetThumbWidth) /
                                                          originWidth
                                          )
                                        : 150

                        //console.log(typeof file.data)                
        
                        // thumbnail _ webp
                        
                        let thumbImage = await sharp(file.data as any)
                                .resize(
                                        {
                                                width: targetThumbWidth,
                                                height: targetThumbHeight,
                                        }
                                )
                                .toFormat(
                                        'webp',
                                        {
                                                lossless: true,
                                        }
                                ).toBuffer();


                        const thumbImageObj = new File(thumbImage, result.thumbFileName, {
                                type: "image/webp",
                                });        

                        //console.log(typeof thumbImageObj)
                        result.thumbImage = thumbImageObj;                
                        
                        //
                         
                        //compressed _ webp
                        

                        let targetCompressedWidth = 20
                        let targetCompressedHeight =
                                (orightHeight *
                                        targetCompressedWidth) /
                                originWidth
                                        ? Math.floor(
                                                  (orightHeight *
                                                          targetCompressedWidth) /
                                                          originWidth
                                          )
                                        : 15
        
                        let compressedImage = await sharp(file.data as any)
                                .resize(
                                        {
                                                width: targetCompressedWidth,
                                                height: targetCompressedHeight,
                                        }
                                )
                                .grayscale()
                                .blur(2)
                                .toFormat(
                                        'webp',
                                        {
                                                quality: 80,
                                                alphaQuality: 80,
                                                lossless: false,
                                                smartSubsample:
                                                        true,
                                        }
                                ).toBuffer();


                        const compressedImageObj = new File(compressedImage, result.compressedFileName, {
                                type: "image/webp",
                                });        
   
                        //console.log(typeof compressedImageObj)
                        result.compressedImage =compressedImageObj;    
                                  


                } catch (error) {
                        console.log(
                                `An error occurred during compressing: ${error}`
                        )
                }

                array.push(result)
        
        }
        console.log(array)
        return array
})