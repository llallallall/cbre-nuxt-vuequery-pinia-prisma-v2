import fs from 'fs';

export default defineEventHandler(async (event) => {

        // 핸들러 이벤트에서 쿼리를 가져옴 
        let query = getQuery(event);
        let localFileName = query.key;
        let imagePath = 'public/assets/files/'+localFileName;
        
        if(fs.existsSync(imagePath)) {
                //console.log('start...delete')
                try {
                        fs.unlinkSync(imagePath);
                        // console.log("image deleted");
                        return {deleteUrl:imagePath, fileName:localFileName};
                      } catch (error) {
                        console.log(error);
                      }
        } else {
                console.log('file not exist')
        }
        
});