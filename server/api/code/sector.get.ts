// server/api/code/sector.get.ts

import { defineEventHandler, createError } from 'h3';
import prisma from '@/prisma/cbredb';
import type { SectorType } from '~/types/property.type';

export default defineEventHandler(async (event): Promise<SectorType[]> => {
        try {
                const result = await prisma.sector.findMany({
                        select: {
                                id: true,
                                name: true,
                        },
                        orderBy: {
                                name: 'asc', // 이름순 정렬 추가
                        }
                });

                // 필드명이 같으므로 별도의 매핑 없이 반환 가능
                return result;

        } catch (error: any) {
                console.error('Get Sector Error:', error);
                throw createError({
                        statusCode: 500,
                        statusMessage: 'Failed to fetch sectors.',
                        data: error.message
                });
        }
});