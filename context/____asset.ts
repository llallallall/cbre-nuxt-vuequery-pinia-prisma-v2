export type CbreAsset = {
        addrDetailBlock: string
        addrDetailCity: string
        addrDetailDistrict: string
        addrDetailProvince: string
        addrDetailStreet: string
        addrDetailTown: string
        addrDetailVillage: string
        addrFull: string
        addrFullJibun: string
        addrFullKor: string
        basementLevels: number
        cps: number
        effRatio: string
        elevators: number
        elevatorsPassenger: number
        elevatorsService: number
        elevatorsShuttle: number
        gfaPy: number
        gfaSqm: number
        gfpaPy: number
        gfpaSqm: number
        grade: string
        images: ImageFile[]
        latitude: number
        lease_info: Leases
        longitude: number
        nfaPy: number
        nfaSqm: number
        nfpaPy: number
        nfpaSqm: number
        noOfBuildings: number
        propertyId: number
        propertyImgId: string
        propertyName: string
        sector: string
        sectorType: string
        siteAreaPy: number
        siteAreaSqm: number
        transaction_info: Sales
        upperFloors: number
        yearBuilt: number
        yearRenovated: number
}

export type ImageFile = {
        date: string
        fileId: number
        fileName: string
        fileSize: number
        fileUuid: string
        groupUuid: string
        image: string
        thumb: string
        type: string
}

export type Leases = {
        actualCnt: number
        askingCnt: number
        leases: LeaseObj[]
        leasesActual: LeaseActualObj[]
        leasesAsking: LeaseAskingObj[]
        total: number
}

export type LeaseObj = {
        actualAllInEffectiveRentMthPy: number
        actualAllInNoc: number
        actualCamfMthPy: number
        actualDeposit: number
        actualDepositPy: number
        actualEffRatio: number
        actualEffectiveNoc: number
        actualFitOut: number
        actualFloor: string
        actualGdm: number
        actualGfaPy: number
        actualGfaSqm: number
        actualIod: number
        actualLeaseStartDate: string
        actualLeaseTermYear: number
        actualMonthlyCAMF: number
        actualMonthlyCashSupportGfa: number
        actualMonthlyRent: number
        actualNfaPy: number
        actualNfaSqm: number
        actualNoc: number
        actualRentFreeMth: number
        actualRentFreeType: string
        actualRentMthPy: number
        actualTIAmountKrw: number
        actualTIAmountNfaPy: number
        actualTotalFreeRentOccupyingYear: number
        actualTotalFreeRentPeriodMth: number
        actualTotalOccupyingPeriodYear: number
        actualUnit: string
        askingAllInEffectiveRentMthPy: number
        askingAllInNoc: number
        askingCamfMthPy: number
        askingDeposit: number
        askingDepositPy: number
        askingEffRatio: number
        askingFitOut: number
        askingFloor: string
        askingGdm: number
        askingGfaPy: number
        askingGfaSqm: number
        askingIod: number
        askingLeaseTermYear: number
        askingMonthlyCAMF: number
        askingMonthlyCashSupportGfa: number
        askingMonthlyRent: number
        askingMoveInDate: string
        askingNfaPy: number
        askingNfaSqm: number
        askingNoc: number
        askingRentFreeMth: number
        askingRentFreeType: string
        askingRentMthPy: number
        askingTIAmountKrw: number
        askingTIAmountNfaPy: number
        askingTotalFreeRentOccupyingYear: number
        askingTotalFreeRentPeriodMth: number
        askingTotalOccupyingPeriodYear: number
        askingUnit: string
        leaseIdx: number
}

export type LeaseAskingObj = {
        askingAllInEffectiveRentMthPy: number
        askingAllInNoc: number
        askingCamfMthPy: number
        askingDeposit: number
        askingDepositPy: number
        askingEffRatio: number
        askingFitOut: number
        askingFloor: string
        askingGdm: number
        askingGfaPy: number
        askingGfaSqm: number
        askingIod: number
        askingLeaseTermYear: number
        askingMonthlyCAMF: number
        askingMonthlyCashSupportGfa: number
        askingMonthlyRent: number
        askingMoveInDate: string
        askingNfaPy: number
        askingNfaSqm: number
        askingNoc: number
        askingRentFreeMth: number
        askingRentFreeType: string
        askingRentMthPy: number
        askingTIAmountKrw: number
        askingTIAmountNfaPy: number
        askingTotalFreeRentOccupyingYear: number
        askingTotalFreeRentPeriodMth: number
        askingTotalOccupyingPeriodYear: number
        askingUnit: string
        leaseIdx: number
}

export type LeaseActualObj = {
        actualAllInEffectiveRentMthPy: number
        actualAllInNoc: number
        actualCamfMthPy: number
        actualDeposit: number
        actualDepositPy: number
        actualEffRatio: number
        actualEffectiveNoc: number
        actualFitOut: number
        actualFloor: string
        actualGdm: number
        actualGfaPy: number
        actualGfaSqm: number
        actualIod: number
        actualLeaseStartDate: string
        actualLeaseTermYear: number
        actualMonthlyCAMF: number
        actualMonthlyCashSupportGfa: number
        actualMonthlyRent: number
        actualNfaPy: number
        actualNfaSqm: number
        actualNoc: number
        actualRentFreeMth: number
        actualRentFreeType: string
        actualRentMthPy: number
        actualTIAmountKrw: number
        actualTIAmountNfaPy: number
        actualTotalFreeRentOccupyingYear: number
        actualTotalFreeRentPeriodMth: number
        actualTotalOccupyingPeriodYear: number
        actualUnit: string
        leaseIdx: number
}

export type Sales = {
        total: number
        transactions: SaleObj[]
}

export type SaleObj = {
        buyer: string
        estCapRate: number
        estDiscountRate: number
        gfaSqm: number
        nfaSqm: number
        priceKrw: number
        pricePerGfa: number
        pricePerNfa: number
        remarks: any
        seller: string
        transactionIdx: number
        transactionQuarter: string
        transactionType: string
        transactionYear: string
}
