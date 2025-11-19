// server/api/asset/all.get.ts (List Data Fetch API)

import { defineEventHandler } from 'h3'
import prisma from '@/prisma/cbredb'
import { AdminListType } from '~/types/asset.type'

export default defineEventHandler(async (event) => {
    try {
        const assetsList = await prisma.property.findMany({
            // 필터링 및 정렬 조건은 필요에 따라 추가
            // where: {}, 
            // orderBy: {}, 
            
            // 💡 핵심: select를 사용하여 필요한 최소 필드만 명시
            select: {
                // 1. Asset 자체 필드
                id: true, // Unique ID
                name: true, // 자산 이름
                //grade: true, // 등급 (schema.prisma 확인 필요)

                // 2. 관계된 테이블에서 필요한 필드 (Location, General)
                // Location Table에서 주소, 위도, 경도 가져오기
                location: {
                    select: {
                        address_full: true, // 주소
                        address_province: true, // 주소
                        address_city: true, // 주소
                        latitude: true, // 위도
                        longitude: true, // 경도
                    }
                },
                
                // General Table에서 섹터/서브섹터 가져오기
                sector: {
                    select: { 
                                name: true 
                            } 
                }, // 섹터 이름

                subsector: { 
                        select: { 
                                name: true 
                        } 
                }, // 서브섹터 이름
                 
                profitability: { 
                        select: { 
                                grade: true 
                        } 
                }, // 서브섹터 이름
                 
                propertyImageFile : {
                        select : {
                                file_url : true
                        },
                        // 1. main 필드가 true인 것을 최우선으로 정렬 ('desc'는 true가 false보다 앞에 옴)
                        // 2. 그 다음 updated_at이 최신인 것을 우선 정렬
                        orderBy: [
                                { main: 'desc' }, 
                                { updated_at: 'desc' }
                        ],
                        // 3. 정렬된 결과 중 맨 위 1개만 가져옴
                        take: 1
                },
                // 기타 목록에서 필요한 필드 추가
              
                updated_at: true, 
            },
             orderBy:  [ { updated_at: 'desc'},{name : 'asc'} ]
            ,
        })

        // Prisma 결과는 중첩된 객체이므로, 프론트엔드에서 사용하기 쉽도록 가볍게 가공하는 것이 좋습니다.
        

        const listData :  AdminListType[] = assetsList.map((asset, index) => {

            // 배열의 0번째 요소에 접근하여 file_url을 가져오고, 없으면 '기본 이미지' 처리합니다.    
            const mainImage = asset.propertyImageFile.length > 0 
                ? asset.propertyImageFile[0].file_url 
                : null ;
            return {
                        no: assetsList.length - index, // 💡 자산 번호 (역순 부여)
                        propertyId: asset.id,
                        propertyName: asset.name,
                        // mainImageUrl 추출 로직 반영
                        mainImageUrl : mainImage,
                        grade: asset.profitability?.grade || '',

                        // Location 정보 매핑
                        addressFull: asset.location?.address_full || '',
                        addressProvince: asset.location?.address_province || '',
                        addressCity: asset.location?.address_city || '',
                        latitude: asset.location?.latitude || null,
                        longitude: asset.location?.longitude || null,

                        //Sector 정보 매핑
                        sector: asset.sector?.name || '',
                        subSector: asset.subsector?.name || '',
                        // ... (기타 필드)
                }
        });


        return { status: 'success', data: listData }

    } catch (error) {
        console.error('Error fetching minimal asset list:', error)
        throw createError({ statusCode: 500, statusMessage: 'Failed to retrieve asset list' })
    }
})