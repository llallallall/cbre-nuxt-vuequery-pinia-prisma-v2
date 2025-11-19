import multer from 'multer';
import { callNodeListener } from 'h3';

let originalFileName = '';
const storage = multer.diskStorage({
        destination: (req, file, cb) => {
                cb(null, 'public/assets/files');
        },
        filename: (req, file, cbd) => {
                originalFileName = file.originalname;
                cbd(null, originalFileName);
        },
});

const upload = multer({
        storage: storage,
        // fileFilter: (req, file, cb) => {
        //         if (file.mimetype == 'image/png' || file.mimetype == 'image/jpeg'|| file.mimetype == 'image/jpg') {
        //                 cb(null, true);
        //         } else {
        //                 cb(new Error('Invalid file type'));
        //         }
        // },
});

export default defineEventHandler(async (event) => {

        try {
                await callNodeListener(
                        // @ts-expect-error: Nuxt 3
                        upload.single('file'),
                        event.node.req,
                        event.node.res
                );
                // console.log('originalFileName');
                // console.log(originalFileName);
                const path = `/assets/files/${originalFileName}`;
                return path;
        } catch (error) {
                console.log(error);
                return createError({
                        statusCode: 500,
                        statusMessage: 'Something went wrong.',
                });
        }
});
