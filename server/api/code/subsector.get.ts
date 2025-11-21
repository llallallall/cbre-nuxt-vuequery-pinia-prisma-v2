// server/api/code/subsector.get.ts

import { defineEventHandler } from 'h3';
import prisma from '@/prisma/cbredb';

export default defineEventHandler(async () => {
        const result = await prisma.subSector.findMany({
                select: {
                        id: true,
                        sector_id: true, // DB 컬럼 (snake_case)
                        name: true,
                },
                orderBy: {
                        name: 'asc'
                }
        });

        // 💡 snake_case -> camelCase 매핑
        return result.map(item => ({
                id: item.id,
                sectorId: item.sector_id, // 변환
                name: item.name,
        }));
});