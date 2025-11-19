import Excel from 'exceljs'
//var { saveAs } = require('file-saver');
//import { saveAs } from 'file-saver'
import pkg from 'file-saver'
const { saveAs } = pkg
// 버튼 클릭한 경우

// showLoader()

export const makeExcelFile = (
        transactions,
        leases,
        caseTransactions,
        caseLeasesAsking,
        caseLeasesActual,
        data
) => {
        try {
                // console.log(transactions)
                // console.log(caseLeasesAsking)
                // console.log(caseLeasesActual)
                // console.log(data)
                // 로우, 컬럼 개수 설정

                let maxRowsLength = 1000
                let maxColumnsLength = 200

                let totalColumnsLength = 106
                let transactionColumnsLength = 21
                let leaseColumnsLength = 68
                let leaseAskingColumnsLength = 38

                // 엑셀 생성
                const workbook = new Excel.Workbook()

                let objectDate = new Date()
                let day = String(objectDate.getDate()).padStart(2, '0')
                let month = String(objectDate.getMonth() + 1).padStart(2, '0')
                let year = objectDate.getFullYear()
                let shortDate = day + '/' + month + '/' + year

                // 엑셀 속성
                workbook.creator = 'CBRE' // 작성자
                workbook.lastModifiedBy = 'CBRE' // 수정자
                workbook.created = objectDate // 생성일(현재 일자로 처리)
                workbook.modified = objectDate // 수정일(현재 일자로 처리)

                /**                               */
                /**                               */
                /**            전체 시트            */
                /**                               */
                /**                               */

                // Total 시트 컬럼 지정
                let assetColumn = [
                        // 기본정보 (1~32)
                        {
                                name: 'No. ',
                                totalsRowLabel: 'Totals:',
                                filterButton: true,
                        },
                        {
                                name: 'Property ID',
                                id: 'propertyId',
                                totalsRowFunction: 'count',
                                filterButton: true,
                        },
                        {
                                name: 'Property Idx',
                                id: 'propertyIdx',
                                filterButton: true,
                        },
                        {
                                name: 'Property Name',
                                id: 'propertyName',
                                filterButton: true,
                        },
                        { name: 'Grade', id: 'grade', filterButton: true },

                        { name: 'Sector', id: 'sector', filterButton: true },
                        { name: 'Type', id: 'sectorType', filterButton: true },

                        {
                                name: 'Year Built',
                                id: 'yearBuilt',
                                filterButton: true,
                        },
                        {
                                name: 'Year Reno.',
                                id: 'yearRenovated',
                                filterButton: true,
                        },

                        {
                                name: 'No. of Buildings',
                                id: 'noOfBuildings',
                                filterButton: true,
                        },
                        {
                                name: 'Upper Floors',
                                id: 'upperFloors',
                                filterButton: true,
                        },
                        {
                                name: 'Basement Levels',
                                id: 'basementLevels',
                                filterButton: true,
                        },

                        {
                                name: 'Elevators',
                                id: 'elevators',
                                filterButton: true,
                        },
                        {
                                name: 'Passenger',
                                id: 'elevatorsPassenger',
                                filterButton: true,
                        },
                        {
                                name: 'Service',
                                id: 'elevatorsService',
                                filterButton: true,
                        },
                        {
                                name: 'Shuttle',
                                id: 'elevatorsShuttle',
                                filterButton: true,
                        },
                        { name: 'CPS', id: 'cps', filterButton: true },
                        {
                                name: 'Eff. Ratio',
                                id: 'effRatio',
                                filterButton: true,
                        },

                        {
                                name: 'Province',
                                id: 'addrDetailProvince',
                                filterButton: true,
                        },
                        { name: 'Address', id: 'addrFull', filterButton: true },
                        {
                                name: 'Addr(jibun)',
                                id: 'addrFullJibun',
                                filterButton: true,
                        },
                        {
                                name: 'Addr(kor)',
                                id: 'addrFullKor',
                                filterButton: true,
                        },

                        { name: 'GFA(sqm)', id: 'gfaSqm', filterButton: true },
                        { name: 'GFA(py)', id: 'gfaPy', filterButton: true },

                        { name: 'NFA(sqm)', id: 'nfaSqm', filterButton: true },
                        { name: 'NFA(py)', id: 'nfaPy', filterButton: true },

                        {
                                name: 'Site Area(sqm)',
                                id: 'siteAreaSqm',
                                filterButton: true,
                        },
                        {
                                name: 'Site Area(py)',
                                id: 'siteAreaPy',
                                filterButton: true,
                        },

                        {
                                name: 'GFPA(sqm)',
                                id: 'gfpaSqm',
                                filterButton: true,
                        },
                        { name: 'GFPA(py)', id: 'gfpaPy', filterButton: true },

                        {
                                name: 'NFPA(sqm)',
                                id: 'nfpaSqm',
                                filterButton: true,
                        },
                        { name: 'NFPA(py)', id: 'nfpaPy', filterButton: true },

                        // 매매 정보 (33~45)
                        {
                                name: 'Trans.Idx',
                                id: 'transaction_transactionIdx',
                                filterButton: true,
                        },
                        {
                                name: 'Trans.Year',
                                id: 'transaction_transactionYear',
                                filterButton: true,
                        },
                        {
                                name: 'Trans.Quarter',
                                id: 'transaction_transactionQuarter',
                                filterButton: true,
                        },
                        {
                                name: 'Trans.Type',
                                id: 'transaction_transactionType',
                                filterButton: true,
                        },
                        {
                                name: 'Seller',
                                id: 'transaction_seller',
                                filterButton: true,
                        },
                        {
                                name: 'Buyer',
                                id: 'transaction_buyer',
                                filterButton: true,
                        },
                        {
                                name: 'Price(krw)',
                                id: 'transaction_priceKrw',
                                filterButton: true,
                        },
                        {
                                name: 'Price per GFA',
                                id: 'transaction_pricePerGfa',
                                filterButton: true,
                        },
                        {
                                name: 'Price per NFA',
                                id: 'transaction_pricePerNfa',
                                filterButton: true,
                        },
                        {
                                name: 'Trans.GFA(sqm)',
                                id: 'transaction_gfaSqm',
                                filterButton: true,
                        },
                        {
                                name: 'Trans.NFA(sqm)',
                                id: 'transaction_nfaSqm',
                                filterButton: true,
                        },
                        {
                                name: 'Est.CapRate',
                                id: 'transaction_estCapRate',
                                filterButton: true,
                        },
                        {
                                name: 'Est.DiscountRate',
                                id: 'transaction_estDiscountRate',
                                filterButton: true,
                        },

                        // 리스정보 (46~)
                        {
                                name: 'Lease.Idx',
                                id: 'leaseIdx',
                                filterButton: true,
                        },

                        {
                                name: 'askingUnit',
                                id: 'askingUnit',
                                filterButton: true,
                        },
                        {
                                name: 'askingTotalOccupyingPeriodYear',
                                id: 'askingTotalOccupyingPeriodYear',
                                filterButton: true,
                        },
                        {
                                name: '1askingTotalFreeRentPeriodMth',
                                id: 'askingTotalFreeRentPeriodMth',
                                filterButton: true,
                        },
                        {
                                name: 'askingTotalFreeRentOccupyingYear',
                                id: 'askingTotalFreeRentOccupyingYear',
                                filterButton: true,
                        },
                        {
                                name: 'askingTIAmountNfaPy',
                                id: 'askingTIAmountNfaPy',
                                filterButton: true,
                        },
                        {
                                name: 'askingTIAmountKrw',
                                id: 'askingTIAmountKrw',
                                filterButton: true,
                        },
                        {
                                name: 'askingRentMthPy',
                                id: 'askingRentMthPy',
                                filterButton: true,
                        },
                        {
                                name: 'askingRentFreeType',
                                id: 'askingRentFreeType',
                                filterButton: true,
                        },
                        {
                                name: 'askingRentFreeMth',
                                id: 'askingRentFreeMth',
                                filterButton: true,
                        },
                        {
                                name: 'askingNoc',
                                id: 'askingNoc',
                                filterButton: true,
                        },

                        {
                                name: 'askingNfaSqm',
                                id: 'askingNfaSqm',
                                filterButton: true,
                        },
                        {
                                name: 'askingNfaPy',
                                id: 'askingNfaPy',
                                filterButton: true,
                        },
                        {
                                name: 'askingMoveInDate',
                                id: 'askingMoveInDate',
                                filterButton: true,
                        },
                        {
                                name: 'askingMonthlyRent',
                                id: 'askingMonthlyRent',
                                filterButton: true,
                        },
                        {
                                name: 'askingMonthlyCashSupportGfa',
                                id: 'askingMonthlyCashSupportGfa',
                                filterButton: true,
                        },
                        {
                                name: 'askingMonthlyCAMF',
                                id: 'askingMonthlyCAMF',
                                filterButton: true,
                        },
                        {
                                name: 'askingLeaseTermYear',
                                id: 'askingLeaseTermYear',
                                filterButton: true,
                        },
                        {
                                name: 'askingIod',
                                id: 'askingIod',
                                filterButton: true,
                        },
                        {
                                name: 'askingGfaSqm',
                                id: 'askingGfaSqm',
                                filterButton: true,
                        },
                        {
                                name: 'askingGfaPy',
                                id: 'askingGfaPy',
                                filterButton: true,
                        },

                        {
                                name: 'askingGdm',
                                id: 'askingGdm',
                                filterButton: true,
                        },
                        {
                                name: 'askingFloor',
                                id: 'askingFloor',
                                filterButton: true,
                        },
                        {
                                name: 'askingFitOut',
                                id: 'askingFitOut',
                                filterButton: true,
                        },
                        {
                                name: 'askingEffRatio',
                                id: 'askingEffRatio',
                                filterButton: true,
                        },
                        {
                                name: 'askingDepositPy',
                                id: 'askingDepositPy',
                                filterButton: true,
                        },
                        {
                                name: 'askingDeposit',
                                id: 'askingDeposit',
                                filterButton: true,
                        },
                        {
                                name: 'askingCamfMthPy',
                                id: 'askingCamfMthPy',
                                filterButton: true,
                        },
                        {
                                name: 'askingAllInNoc',
                                id: 'askingAllInNoc',
                                filterButton: true,
                        },
                        {
                                name: 'askingAllInEffectiveRentMthPy',
                                id: 'askingAllInEffectiveRentMthPy',
                                filterButton: true,
                        },

                        {
                                name: 'actualUnit',
                                id: 'actualUnit',
                                filterButton: true,
                        },
                        {
                                name: 'actualTotalOccupyingPeriodYear',
                                id: 'actualTotalOccupyingPeriodYear',
                                filterButton: true,
                        },
                        {
                                name: 'actualTotalFreeRentPeriodMth',
                                id: 'actualTotalFreeRentPeriodMth',
                                filterButton: true,
                        },
                        {
                                name: 'actualTotalFreeRentOccupyingYear',
                                id: 'actualTotalFreeRentOccupyingYear',
                                filterButton: true,
                        },
                        {
                                name: 'actualTIAmountNfaPy',
                                id: 'actualTIAmountNfaPy',
                                filterButton: true,
                        },
                        {
                                name: 'actualTIAmountKrw',
                                id: 'actualTIAmountKrw',
                                filterButton: true,
                        },
                        {
                                name: 'actualRentMthPy',
                                id: 'actualRentMthPy',
                                filterButton: true,
                        },
                        {
                                name: 'actualRentFreeType',
                                id: 'actualRentFreeType',
                                filterButton: true,
                        },
                        {
                                name: 'actualRentFreeMth',
                                id: 'actualRentFreeMth',
                                filterButton: true,
                        },
                        {
                                name: 'actualNoc',
                                id: 'actualNoc',
                                filterButton: true,
                        },

                        {
                                name: 'actualNfaSqm',
                                id: 'actualNfaSqm',
                                filterButton: true,
                        },
                        {
                                name: 'actualNfaPy',
                                id: 'actualNfaPy',
                                filterButton: true,
                        },
                        {
                                name: 'actualMonthlyRent',
                                id: 'actualMonthlyRent',
                                filterButton: true,
                        },
                        {
                                name: 'actualMonthlyCashSupportGfa',
                                id: 'actualMonthlyCashSupportGfa',
                                filterButton: true,
                        },
                        {
                                name: 'actualMonthlyCAMF',
                                id: 'actualMonthlyCAMF',
                                filterButton: true,
                        },

                        {
                                name: 'actualLeaseTermYear',
                                id: 'actualLeaseTermYear',
                                filterButton: true,
                        },
                        {
                                name: 'actualLeaseStartDate',
                                id: 'actualLeaseStartDate',
                                filterButton: true,
                        },
                        {
                                name: 'actualIod',
                                id: 'actualIod',
                                filterButton: true,
                        },
                        {
                                name: 'actualGfaSqm',
                                id: 'actualGfaSqm',
                                filterButton: true,
                        },
                        {
                                name: 'actualGfaPy',
                                id: 'actualGfaPy',
                                filterButton: true,
                        },

                        {
                                name: 'actualGdm',
                                id: 'actualGdm',
                                filterButton: true,
                        },
                        {
                                name: 'actualFloor',
                                id: 'actualFloor',
                                filterButton: true,
                        },
                        {
                                name: 'actualFitOut',
                                id: 'actualFitOut',
                                filterButton: true,
                        },
                        {
                                name: 'actualEffectiveNoc',
                                id: 'actualEffectiveNoc',
                                filterButton: true,
                        },
                        {
                                name: 'actualEffRatio',
                                id: 'actualEffRatio',
                                filterButton: true,
                        },

                        {
                                name: 'actualDepositPy',
                                id: 'actualDepositPy',
                                filterButton: true,
                        },
                        {
                                name: 'actualDeposit',
                                id: 'actualDeposit',
                                filterButton: true,
                        },
                        {
                                name: 'actualCamfMthPy',
                                id: 'actualCamfMthPy',
                                filterButton: true,
                        },
                        {
                                name: 'actualAllInNoc',
                                id: 'actualAllInNoc',
                                filterButton: true,
                        },
                        {
                                name: 'actualAllInEffectiveRentMthPy',
                                id: 'actualAllInEffectiveRentMthPy',
                                filterButton: true,
                        },
                ]

                // 데이터 생성
                let dataRow = []
                let dataCount = 0
                //console.log('caseTransactions ')
                //console.log(caseTransactions)
                //console.log(typeof caseTransactions)

                let caseTransactionsPropertyId = []
                let transactionsList = []

                caseTransactions.forEach((el) => {
                        //console.log(el)
                        let propertyId = el.toString().split('-')[1] * 1
                        let transactionIdx = el.toString().split('-')[2] * 1
                        if (!caseTransactionsPropertyId.includes(propertyId)) {
                                caseTransactionsPropertyId.push(propertyId)
                        }

                        let transactionsObj = new Object()
                        transactionsObj.transactions = new Array()
                        transactionsObj.propertyId = propertyId

                        let transaction = transactionsList.filter(
                                (el) => el.propertyId == propertyId
                        )[0]

                        if (!transaction) {
                                transactionsList.push(transactionsObj)
                                transaction = transactionsList.filter(
                                        (el) => el.propertyId == propertyId
                                )[0]
                        }
                        transaction.transactions.push(transactionIdx)
                })
                //console.log(transactionsList)

                let caseLeasesActualPropertyId = []
                let leasesActualList = []

                caseLeasesActual.forEach((el) => {
                        let propertyId = el.toString().split('-')[1] * 1
                        let leaseIdx = el.toString().split('-')[2] * 1
                        if (!caseLeasesActualPropertyId.includes(propertyId)) {
                                caseLeasesActualPropertyId.push(propertyId)
                        }

                        let leasesActualObj = new Object()
                        leasesActualObj.leasesActual = new Array()
                        leasesActualObj.propertyId = propertyId

                        let leaseActual = leasesActualList.filter(
                                (el) => el.propertyId == propertyId
                        )[0]

                        if (!leaseActual) {
                                leasesActualList.push(leasesActualObj)
                                leaseActual = leasesActualList.filter(
                                        (el) => el.propertyId == propertyId
                                )[0]
                        }

                        leaseActual.leasesActual.push(leaseIdx)
                })
                //console.log(leasesActualList)

                let caseLeasesAskingPropertyId = []
                let leasesAskingList = []

                caseLeasesAsking.forEach((el) => {
                        let propertyId = el.toString().split('-')[1] * 1
                        let leaseIdx = el.toString().split('-')[2] * 1
                        if (!caseLeasesAskingPropertyId.includes(propertyId)) {
                                caseLeasesAskingPropertyId.push(propertyId)
                        }

                        let leasesAskingObj = new Object()
                        leasesAskingObj.leasesAsking = new Array()
                        leasesAskingObj.propertyId = propertyId

                        let leaseAsking = leasesAskingList.filter(
                                (el) => el.propertyId == propertyId
                        )[0]

                        if (!leaseAsking) {
                                leasesAskingList.push(leasesAskingObj)
                                leaseAsking = leasesAskingList.filter(
                                        (el) => el.propertyId == propertyId
                                )[0]
                        }

                        leaseAsking.leasesAsking.push(leaseIdx)
                })
                //console.log(leasesAskingList)

                // Total 시트 데이터
                data.forEach((itemOrg, itemIndex) => {
                        let item = itemOrg
                        let propertyId = item['propertyId']

                        let transaction_cnt = 0
                        let transaction_info = item['transaction_info']
                        let transactionsArray = transaction_info['transactions']
                        transactionsArray = transactionsArray.sort(function (
                                a,
                                b
                        ) {
                                return a.transactionIdx - b.transactionIdx
                        })
                        //console.log(transactionsArray)

                        let lease_cnt = 0
                        let lease_asking_cnt = 0
                        let lease_actual_cnt = 0
                        let lease_info = item['lease_info']
                        let leasesIdxArray = []
                        let leasesActualArray = lease_info['leasesActual']
                        leasesActualArray = leasesActualArray.sort(function (
                                a,
                                b
                        ) {
                                return a.leaseIdx - b.leaseIdx
                        })
                        let leasesAskingArray = lease_info['leasesAsking']
                        leasesAskingArray = leasesAskingArray.sort(function (
                                a,
                                b
                        ) {
                                return a.leaseIdx - b.leaseIdx
                        })
                        leasesAskingArray.forEach((el) =>
                                leasesIdxArray.includes(el.leaseIdx)
                                        ? null
                                        : leasesIdxArray.push(el.leaseIdx)
                        )
                        leasesActualArray.forEach((el) =>
                                leasesIdxArray.includes(el.leaseIdx)
                                        ? null
                                        : leasesIdxArray.push(el.leaseIdx)
                        )

                        leasesIdxArray = leasesIdxArray.sort(function (a, b) {
                                return a - b
                        })
                        //console.log(leasesIdxArray)

                        if (
                                transactions == null ||
                                (transactions &&
                                        transactions.includes(propertyId))
                        ) {
                                transaction_cnt = transaction_info.total
                        }

                        if (
                                leases == null ||
                                (leases && leases.includes(propertyId))
                        ) {
                                lease_cnt = lease_info.total
                                lease_asking_cnt = lease_info.askingCnt
                                lease_actual_cnt = lease_info.actualCnt
                        }

                        // leases && transactions 필터

                        if (leasesAskingList && leasesAskingList.length > 0) {
                                // 자산 번호가 같으면 , leaseIdx를 pop 제거
                                leasesAskingList.forEach((le) => {
                                        if (le.propertyId == item.propertyId) {
                                                //console.log('찾았다. 리스 ')

                                                // 체크된 리스 idx 를 돌면서
                                                let newLeasesAskingArray = []
                                                let filteredLeaseAskingItem
                                                le.leasesAsking.forEach(
                                                        (leIdx) => {
                                                                // item에 들어있는 leaseIdx 필터
                                                                //console.log(item.lease_info.leases)
                                                                //console.log(leIdx)
                                                                filteredLeaseAskingItem =
                                                                        leasesAskingArray.filter(
                                                                                (
                                                                                        leaseItem
                                                                                ) =>
                                                                                        leaseItem.leaseIdx ==
                                                                                        leIdx
                                                                        )
                                                                //console.log(filteredLeaseItem[0])
                                                                newLeasesAskingArray.push(
                                                                        filteredLeaseAskingItem[0]
                                                                )
                                                                //console.log(item)
                                                        }
                                                )
                                                //console.log(newLeasesArray)
                                                //console.log(item)
                                                leasesAskingArray = []

                                                newLeasesAskingArray.forEach(
                                                        (newLease) => {
                                                                leasesAskingArray.push(
                                                                        newLease
                                                                )
                                                        }
                                                )

                                                // 리스 개수 재설정
                                                lease_asking_cnt =
                                                        newLeasesAskingArray.length
                                        }
                                })
                        } else {
                                lease_cnt = 0
                        }

                        //console.log('leases && transactions 필터')
                        //console.log(leasesActualList)
                        if (leasesActualList && leasesActualList.length > 0) {
                                // 자산 번호가 같으면 , leaseIdx를 pop 제거
                                leasesActualList.forEach((le) => {
                                        if (le.propertyId == item.propertyId) {
                                                //console.log('찾았다. 리스 ')

                                                // 체크된 리스 idx 를 돌면서
                                                let newLeasesActualArray = []
                                                let filteredLeaseItem
                                                le.leasesActual.forEach(
                                                        (leIdx) => {
                                                                // item에 들어있는 leaseIdx 필터
                                                                //console.log(item.lease_info.leases)
                                                                //console.log(leIdx)
                                                                filteredLeaseItem =
                                                                        leasesActualArray.filter(
                                                                                (
                                                                                        leaseItem
                                                                                ) =>
                                                                                        leaseItem.leaseIdx ==
                                                                                        leIdx
                                                                        )
                                                                //console.log(filteredLeaseItem[0])
                                                                newLeasesActualArray.push(
                                                                        filteredLeaseItem[0]
                                                                )
                                                                //console.log(item)
                                                        }
                                                )
                                                //console.log(newLeasesArray)
                                                //console.log(item)
                                                leasesActualArray = []

                                                newLeasesActualArray.forEach(
                                                        (newLease) => {
                                                                leasesActualArray.push(
                                                                        newLease
                                                                )
                                                        }
                                                )

                                                // 리스 개수 재설정
                                                lease_actual_cnt =
                                                        newLeasesActualArray.length
                                        }
                                })
                        } else {
                                lease_cnt = 0
                        }

                        if (transactionsList && transactionsList.length > 0) {
                                // 자산 번호가 같으면 , transactionIdx를 pop 제거
                                transactionsList.forEach((tr) => {
                                        if (tr.propertyId == item.propertyId) {
                                                //console.log('찾았다. 매매 ')
                                                //console.log(tr)
                                                // 체크된 리스 idx 를 돌면서
                                                let newTransactionsArray = []
                                                let filteredTransactionItem
                                                tr.transactions.forEach(
                                                        (trIdx) => {
                                                                // item에 들어있는 leaseIdx 필터
                                                                filteredTransactionItem =
                                                                        item.transaction_info.transactions.filter(
                                                                                (
                                                                                        transactionItem
                                                                                ) =>
                                                                                        transactionItem.transactionIdx ==
                                                                                        trIdx
                                                                        )
                                                                //console.log(filteredTransactionItem[0])
                                                                newTransactionsArray.push(
                                                                        filteredTransactionItem[0]
                                                                )
                                                        }
                                                )
                                                //console.log(newTransactionsArray)
                                                transactionsArray = []
                                                newTransactionsArray.forEach(
                                                        (newTransaction) => {
                                                                transactionsArray.push(
                                                                        newTransaction
                                                                )
                                                        }
                                                )

                                                // 매매 수량 재설정
                                                transaction_cnt =
                                                        newTransactionsArray.length
                                        }
                                })
                        } else {
                                transaction_cnt = 0
                        }

                        // console.log(transaction_cnt)
                        // console.log(lease_cnt)

                        // 총 생성 로우 수 == 매매내역이나 리스내역 중 최대 값
                        let maxRowCnt = Math.max(1, transaction_cnt, lease_cnt)

                        for (
                                let rowIndex = 1;
                                rowIndex <= maxRowCnt;
                                rowIndex++
                        ) {
                                //console.log(rowIndex)

                                let rowVals = []
                                rowVals.push(dataCount + 1) //no

                                let leaseAsking = leasesAskingArray.filter(
                                        (el) =>
                                                el.leaseIdx ==
                                                leasesIdxArray[rowIndex - 1]
                                )[0]
                                let leaseActual = leasesActualArray.filter(
                                        (el) =>
                                                el.leaseIdx ==
                                                leasesIdxArray[rowIndex - 1]
                                )[0]

                                // 1개씩 row 생성 (가로 우측으로 셀마다 이동하며 생성)
                                assetColumn.forEach((el, cellIndex) => {
                                        if (cellIndex > 0) {
                                                let cellVal = item[el.id] // key == assetColumn.id

                                                if (cellIndex == 2) {
                                                        // propertyIdx
                                                        cellVal = rowIndex
                                                }

                                                if (cellIndex == 17) {
                                                        // effRatio
                                                        cellVal = cellVal / 100
                                                }

                                                // 2번째 이상 행에서 기본정보 반복 내용 안보이게
                                                if (
                                                        rowIndex > 1 &&
                                                        cellIndex < 32
                                                ) {
                                                        // 셀내용 삭제
                                                        //cellVal = null
                                                }

                                                // 매매정보
                                                if (
                                                        cellIndex >= 32 &&
                                                        cellIndex <= 44
                                                ) {
                                                        // 매매정보가 있고,  경우만 생성
                                                        if (
                                                                transaction_cnt >
                                                                        0 &&
                                                                transaction_cnt >=
                                                                        rowIndex
                                                        ) {
                                                                cellVal =
                                                                        transactionsArray[
                                                                                rowIndex -
                                                                                        1
                                                                        ][
                                                                                el.id.replace(
                                                                                        'transaction_',
                                                                                        ''
                                                                                )
                                                                        ]

                                                                if (
                                                                        cellIndex ==
                                                                        43
                                                                ) {
                                                                        // Est.CapRate
                                                                        cellVal =
                                                                                cellVal /
                                                                                100
                                                                }

                                                                if (
                                                                        cellIndex ==
                                                                        44
                                                                ) {
                                                                        // Est.DiscountRate
                                                                        cellVal =
                                                                                cellVal /
                                                                                100
                                                                }
                                                        }
                                                }

                                                // 리스정보 index
                                                if (cellIndex == 45) {
                                                        console.log(
                                                                '리스정보 asking '
                                                        )
                                                        // console.log(leasesAskingArray)
                                                        // console.log(leasesActualArray)
                                                        if (
                                                                lease_cnt > 0 &&
                                                                lease_cnt >=
                                                                        rowIndex
                                                        ) {
                                                                cellVal =
                                                                        leasesIdxArray[
                                                                                rowIndex -
                                                                                        1
                                                                        ]
                                                        }
                                                }

                                                // 리스정보 asking
                                                if (
                                                        cellIndex >= 46 &&
                                                        cellIndex <= 74
                                                ) {
                                                        //console.log(el.id.replace('lease_',''))

                                                        leaseAsking
                                                                ? (cellVal =
                                                                          leaseAsking[
                                                                                  el.id.replace(
                                                                                          'lease_',
                                                                                          ''
                                                                                  )
                                                                          ])
                                                                : null
                                                        //console.log(cellVal)
                                                }

                                                // 리스정보 actual
                                                if (cellIndex > 75) {
                                                        leaseActual
                                                                ? (cellVal =
                                                                          leaseActual[
                                                                                  el.id.replace(
                                                                                          'lease_',
                                                                                          ''
                                                                                  )
                                                                          ])
                                                                : null
                                                }

                                                rowVals.push(
                                                        cellVal == 0
                                                                ? null
                                                                : cellVal
                                                )
                                        }
                                })
                                dataRow.push(rowVals)
                                dataCount++
                                //console.log(dataRow)
                        }
                })

                // addWorksheet() 함수를 사용하여 엑셀 시트를 추가한다.
                // 엑셀 시트는 순차적으로 생성된다.
                workbook.addWorksheet('Total')

                // 엑셀 시트를 접근하는 방법은 세 가지 방법이 존재한다.
                // 1. getWorksheet() 함수에서 시트 명칭 전달
                const sheetOne = workbook.getWorksheet('Total')

                // 시트 속성
                let defaultColumnWidth = 20
                sheetOne.properties.defaultColWidth = defaultColumnWidth

                //column count는 1부터 시작
                sheetOne.getColumn(18).numFmt = '0.00%'

                sheetOne.getColumn(23).numFmt = '#,##0.00'
                sheetOne.getColumn(24).numFmt = '#,##0.00'
                sheetOne.getColumn(25).numFmt = '#,##0.00'
                sheetOne.getColumn(26).numFmt = '#,##0.00'
                sheetOne.getColumn(27).numFmt = '#,##0.00'
                sheetOne.getColumn(28).numFmt = '#,##0.00'
                sheetOne.getColumn(29).numFmt = '#,##0.00'
                sheetOne.getColumn(30).numFmt = '#,##0.00'
                sheetOne.getColumn(31).numFmt = '#,##0.00'
                sheetOne.getColumn(32).numFmt = '#,##0.00'

                sheetOne.getColumn(39).numFmt = '"₩"#,##0;[Red]-"₩"#,##0'
                sheetOne.getColumn(40).numFmt = '"₩"#,##0;[Red]-"₩"#,##0'
                sheetOne.getColumn(41).numFmt = '"₩"#,##0;[Red]-"₩"#,##0'

                sheetOne.getColumn(42).numFmt = '#,##0.00'
                sheetOne.getColumn(43).numFmt = '#,##0.00'

                sheetOne.getColumn(44).numFmt = '0.00%'
                sheetOne.getColumn(45).numFmt = '0.00%'

                //workbook.getWorksheet(0);
                //workbook.worksheets[0];

                // removeWorksheet() 함수를 사용하여 엑셀 시트를 제거한다.
                //workbook.removeWorksheet(sheetOne.id);

                // 시트 배경색상, 테두리 설정
                for (let i = 1; i < maxRowsLength; i += 1) {
                        for (let j = 1; j < totalColumnsLength; j += 1) {
                                sheetOne.getRow(i).getCell(j).font = {
                                        name: 'Times New Roman',
                                        size: 11,
                                        bold: false,
                                }

                                sheetOne.getRow(i).getCell(j).border = {
                                        top: {
                                                style: 'thin',
                                                color: { argb: 'FFFFFFFF' },
                                        },
                                        left: {
                                                style: 'thin',
                                                color: { argb: 'FFFFFFFF' },
                                        },
                                        bottom: {
                                                style: 'thin',
                                                color: { argb: 'FFFFFFFF' },
                                        },
                                        right: {
                                                style: 'thin',
                                                color: { argb: 'FFFFFFFF' },
                                        },
                                }
                        }
                }
                //로고 셀
                sheetOne.mergeCells('A2:A3')
                sheetOne.getCell('A2').value = 'CBRE'
                sheetOne.getCell('A2').font = {
                        size: 22,
                        bold: true,
                        color: { argb: 'ff042453' },
                }
                sheetOne.getCell('A2').alignment = {
                        vertical: 'middle',
                        horizontal: 'right',
                }

                sheetOne.mergeCells('B2:C3')
                sheetOne.getCell('B2').value = 'Real Estate Assets'
                sheetOne.getCell('B2').font = {
                        size: 22,
                        bold: false,
                        color: { argb: 'ff042453' },
                }
                sheetOne.getCell('B2').alignment = {
                        vertical: 'middle',
                        horizontal: 'left',
                }

                //시트 제목
                sheetOne.getCell('D2').value = 'Transactions & Leases Report'
                sheetOne.getCell('D2').font = {
                        size: 12,
                        bold: true,
                        color: { argb: 'ff042453' },
                }
                sheetOne.getCell('D2').alignment = {
                        vertical: 'bottom',
                        horizontal: 'left',
                        indent: 1,
                }
                sheetOne.getCell('D2').border = {
                        left: { style: 'medium', color: { argb: 'ff042453' } },
                        bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } },
                }

                //생성 일자
                sheetOne.getCell('D3').value = 'Created on ' + shortDate
                sheetOne.getCell('D3').font = {
                        size: 10,
                        bold: false,
                        color: { argb: 'ff042453' },
                }
                sheetOne.getCell('D3').alignment = {
                        vertical: 'top',
                        horizontal: 'left',
                        indent: 1,
                }
                sheetOne.getCell('D3').border = {
                        left: { style: 'medium', color: { argb: 'ff042453' } },
                }

                // 제목 그룹  - 기본정보
                sheetOne.mergeCells('A5:AF5')
                sheetOne.getCell('A5').alignment = {
                        vertical: 'bottom',
                        horizontal: 'center',
                }
                sheetOne.getCell('A5').value = 'General Infomation'
                sheetOne.getCell('A5').font = {
                        size: 10,
                        bold: true,
                        color: { argb: 'FFFFFFFF' },
                }
                sheetOne.getCell('A5').fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'ff1a4f9d' },
                }
                sheetOne.getCell('A5').border = {
                        top: { style: 'thin', color: { argb: 'ff1a4f9d' } },
                        left: { style: 'thin', color: { argb: 'ff1a4f9d' } },
                        bottom: { style: 'thin', color: { argb: 'ff1a4f9d' } },
                        right: { style: 'thin', color: { argb: 'ff1a4f9d' } },
                }

                // 제목 그룹  - 매매 정보
                sheetOne.mergeCells('AG5:AS5')
                sheetOne.getCell('AG5').alignment = {
                        vertical: 'bottom',
                        horizontal: 'center',
                }
                sheetOne.getCell('AG5').value = 'Transaction Infomation'
                sheetOne.getCell('AG5').font = {
                        size: 10,
                        bold: true,
                        color: { argb: 'FFFFFFFF' },
                }
                sheetOne.getCell('AG5').fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'ff0b4c5f' },
                }
                sheetOne.getCell('AG5').border = {
                        top: { style: 'thin', color: { argb: 'ff0b4c5f' } },
                        left: { style: 'thin', color: { argb: 'ff0b4c5f' } },
                        bottom: { style: 'thin', color: { argb: 'ff0b4c5f' } },
                        right: { style: 'thin', color: { argb: 'ff0b4c5f' } },
                }

                // 제목 그룹  - 리스 정보
                sheetOne.mergeCells('AT5:DA5')
                sheetOne.getCell('AT5').alignment = {
                        vertical: 'bottom',
                        horizontal: 'center',
                }
                sheetOne.getCell('AT5').value = 'Lease Infomation'
                sheetOne.getCell('AT5').font = {
                        size: 10,
                        bold: true,
                        color: { argb: 'FFFFFFFF' },
                }
                sheetOne.getCell('AT5').fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'ffdba901' },
                }
                sheetOne.getCell('AT5').border = {
                        top: { style: 'thin', color: { argb: 'ffdba901' } },
                        left: { style: 'thin', color: { argb: 'ffdba901' } },
                        bottom: { style: 'thin', color: { argb: 'ffdba901' } },
                        right: { style: 'thin', color: { argb: 'ffdba901' } },
                }

                sheetOne.getRow(5).height = 12
                // sheetOne.getCell('A5').fill = {
                //         type: 'pattern',
                //         pattern: 'solid',
                //         fgColor: { argb: 'ff042453' },
                // };

                //테이블 데이터
                sheetOne.getRow(6).height = 28
                sheetOne.addTable({
                        name: 'TotalTable',
                        ref: 'A6',
                        headerRow: true,
                        totalsRow: false,
                        // style: {
                        //         theme: 'TableStyleLight2',
                        //         showRowStripes: false,
                        // },
                        columns: assetColumn,
                        rows: dataRow,
                })

                // 제목 행 스타일 설정
                for (let j = 1; j < totalColumnsLength; j += 1) {
                        sheetOne.getRow(6).getCell(j).fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: 'ff1a4f9d' },
                        }
                        sheetOne.getRow(6).getCell(j).border = {
                                top: {
                                        style: 'thin',
                                        color: { argb: 'ff1a4f9d' },
                                },
                                left: {
                                        style: 'thin',
                                        color: { argb: 'ff1a4f9d' },
                                },
                                bottom: {
                                        style: 'thin',
                                        color: { argb: 'ff1a4f9d' },
                                },
                                right: {
                                        style: 'thin',
                                        color: { argb: 'ff1a4f9d' },
                                },
                        }
                        sheetOne.getRow(6).getCell(j).alignment = {
                                vertical: 'middle',
                                horizontal: 'center',
                        }
                        sheetOne.getRow(6).getCell(j).font = {
                                size: 14,
                                bold: true,
                                color: { argb: 'FFFFFFFF' },
                        }
                }

                // 제목 행 - 매매정보 스타일 설정
                for (let j = 33; j < 46; j += 1) {
                        sheetOne.getRow(6).getCell(j).fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: 'ff0b4c5f' },
                        }

                        sheetOne.getRow(6).getCell(j).border = {
                                top: {
                                        style: 'thin',
                                        color: { argb: 'ff0b4c5f' },
                                },
                                left: {
                                        style: 'thin',
                                        color: { argb: 'ff0b4c5f' },
                                },
                                bottom: {
                                        style: 'thin',
                                        color: { argb: 'ff0b4c5f' },
                                },
                                right: {
                                        style: 'thin',
                                        color: { argb: 'ff0b4c5f' },
                                },
                        }
                }

                // 제목 행 - 리스정보 스타일 설정
                for (let j = 46; j < 106; j += 1) {
                        sheetOne.getRow(6).getCell(j).fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: 'ffdba901' },
                        }

                        sheetOne.getRow(6).getCell(j).border = {
                                top: {
                                        style: 'thin',
                                        color: { argb: 'ffdba901' },
                                },
                                left: {
                                        style: 'thin',
                                        color: { argb: 'ffdba901' },
                                },
                                bottom: {
                                        style: 'thin',
                                        color: { argb: 'ffdba901' },
                                },
                                right: {
                                        style: 'thin',
                                        color: { argb: 'ffdba901' },
                                },
                        }
                }

                // 데이터셀 홀수 행 배경색상
                for (let i = 1; i < totalColumnsLength; i++) {
                        for (let j = 1; j <= dataCount; j++) {
                                if (j % 2 == 0) {
                                        // 짝수 행
                                        //console.log(j)
                                        sheetOne.getRow(6 + j).getCell(i).fill =
                                                {
                                                        type: 'pattern',
                                                        pattern: 'solid',
                                                        fgColor: {
                                                                argb: 'ffeff3f6',
                                                        },
                                                }
                                }
                        }
                }

                // 데이터셀 기본정보 반복행 배경색과 글씨색 동일하게 변경
                for (let i = 4; i < 33; i++) {
                        // 컬럼

                        for (let j = 1; j <= dataCount; j++) {
                                // 로우
                                let pre = sheetOne
                                        .getRow(6 + j - 1)
                                        .getCell(2).value
                                let now = sheetOne
                                        .getRow(6 + j)
                                        .getCell(2).value

                                // 윗 행과 현재 행의 property Id 가 같으면 색상 변경
                                if (pre == now) {
                                        if (j % 2 == 0) {
                                                // 짝수 행
                                                sheetOne
                                                        .getRow(6 + j)
                                                        .getCell(i).font = {
                                                        size: 14,
                                                        bold: true,
                                                        color: {
                                                                argb: 'ffeff3f6',
                                                        },
                                                }
                                        } else {
                                                // 홀수 행
                                                sheetOne
                                                        .getRow(6 + j)
                                                        .getCell(i).font = {
                                                        size: 14,
                                                        bold: true,
                                                        color: {
                                                                argb: 'ffffffff',
                                                        },
                                                }
                                        }
                                }
                        }
                }

                //  TotalCount 행
                sheetOne.getRow(8 + dataCount).getCell(1).value =
                        'Total : ' + data.length
                //  카피라이트 행
                sheetOne.getRow(9 + dataCount).getCell(1).value =
                        'Copyright 2023 CBRE.  All rights reserved.'

                // 데이터 열 너비 재설정
                for (let j = 1; j < totalColumnsLength; j += 1) {
                        let dataCell = sheetOne.getRow(7).getCell(j)
                        var columnLength = dataCell.value
                                ? dataCell.value.toString().length
                                : defaultColumnWidth
                        sheetOne.getColumn(j).width =
                                columnLength < defaultColumnWidth
                                        ? defaultColumnWidth
                                        : columnLength
                }

                /**                               */
                /**                               */
                /**            매매 시트            */
                /**                               */
                /**                               */

                // Transaction 시트 컬럼 지정
                let transactionColumn = [
                        // 기본정보 (1~7)
                        {
                                name: 'No. ',
                                totalsRowLabel: 'Totals:',
                                filterButton: true,
                        }, // 1
                        {
                                name: 'Property ID',
                                id: 'propertyId',
                                totalsRowFunction: 'count',
                                filterButton: true,
                        }, // 2
                        {
                                name: 'Property Idx',
                                id: 'propertyIdx',
                                filterButton: true,
                        }, // 3
                        {
                                name: 'Property Name',
                                id: 'propertyName',
                                filterButton: true,
                        }, // 4
                        { name: 'Grade', id: 'grade', filterButton: true }, // 5

                        { name: 'Sector', id: 'sector', filterButton: true }, // 6
                        { name: 'Type', id: 'sectorType', filterButton: true }, // 7

                        // 매매 정보 (8~)
                        {
                                name: 'Trans.Idx',
                                id: 'transaction_transactionIdx',
                                filterButton: true,
                        }, // 8.
                        {
                                name: 'Trans.Year',
                                id: 'transaction_transactionYear',
                                filterButton: true,
                        }, // 9.
                        {
                                name: 'Trans.Quarter',
                                id: 'transaction_transactionQuarter',
                                filterButton: true,
                        }, // 10.
                        {
                                name: 'Trans.Type',
                                id: 'transaction_transactionType',
                                filterButton: true,
                        }, // 11.
                        {
                                name: 'Seller',
                                id: 'transaction_seller',
                                filterButton: true,
                        }, // 12.
                        {
                                name: 'Buyer',
                                id: 'transaction_buyer',
                                filterButton: true,
                        }, // 13.
                        {
                                name: 'Price(krw)',
                                id: 'transaction_priceKrw',
                                filterButton: true,
                        }, // 14.
                        {
                                name: 'Price per GFA',
                                id: 'transaction_pricePerGfa',
                                filterButton: true,
                        }, // 15.
                        {
                                name: 'Price per NFA',
                                id: 'transaction_pricePerNfa',
                                filterButton: true,
                        }, // 16.
                        {
                                name: 'Trans.GFA(sqm)',
                                id: 'transaction_gfaSqm',
                                filterButton: true,
                        }, // 17.
                        {
                                name: 'Trans.NFA(sqm)',
                                id: 'transaction_nfaSqm',
                                filterButton: true,
                        }, // 18.
                        {
                                name: 'Est.CapRate',
                                id: 'transaction_estCapRate',
                                filterButton: true,
                        }, // 19.
                        {
                                name: 'Est.DiscountRate',
                                id: 'transaction_estDiscountRate',
                                filterButton: true,
                        }, // 20.
                ]

                // Transaction 시트 데이터
                let dataRowTransaction = []
                let dataCountTransaction = 0
                let transactionData = data.filter(
                        (item) => item.transaction_info.total > 0
                )

                transactionData.forEach((item, itemIndex) => {
                        let propertyId = item['propertyId']

                        let transaction_cnt = 0
                        let transaction_info = item['transaction_info']
                        let transactionsArray = transaction_info['transactions']
                        transactionsArray = transactionsArray.sort(function (
                                a,
                                b
                        ) {
                                return a.transactionIdx - b.transactionIdx
                        })

                        if (
                                transactions == null ||
                                (transactions &&
                                        transactions.includes(propertyId))
                        ) {
                                transaction_cnt = transaction_info.total
                        }

                        if (transactionsList && transactionsList.length > 0) {
                                // 자산 번호가 같으면 , transactionIdx를 pop 제거
                                transactionsList.forEach((tr) => {
                                        if (tr.propertyId == item.propertyId) {
                                                //console.log('찾았다. 매매 ')
                                                //console.log(tr)
                                                // 체크된 리스 idx 를 돌면서
                                                let newTransactionsArray = []
                                                let filteredTransactionItem
                                                tr.transactions.forEach(
                                                        (trIdx) => {
                                                                // item에 들어있는 leaseIdx 필터
                                                                filteredTransactionItem =
                                                                        item.transaction_info.transactions.filter(
                                                                                (
                                                                                        transactionItem
                                                                                ) =>
                                                                                        transactionItem.transactionIdx ==
                                                                                        trIdx
                                                                        )
                                                                // console.log(filteredTransactionItem[0])
                                                                newTransactionsArray.push(
                                                                        filteredTransactionItem[0]
                                                                )
                                                        }
                                                )
                                                //console.log(newTransactionsArray)
                                                transactionsArray = []
                                                newTransactionsArray.forEach(
                                                        (newTransaction) => {
                                                                transactionsArray.push(
                                                                        newTransaction
                                                                )
                                                        }
                                                )
                                                //console.log(newTransactionsArray)
                                                // 매매 수량 재설정
                                                transaction_cnt =
                                                        newTransactionsArray.length
                                        }
                                })
                        } else {
                                transaction_cnt = 0
                        }

                        // 총 생성 로우 수 == 매매내역이나 리스내역 중 최대 값
                        let maxRowCnt = Math.max(1, transaction_cnt)

                        for (
                                let rowIndex = 1;
                                rowIndex <= maxRowCnt;
                                rowIndex++
                        ) {
                                //console.log(rowIndex)

                                let rowVals = []
                                rowVals.push(dataCountTransaction + 1) //no

                                // 1개씩 row 생성 (가로 우측으로 셀마다 이동하며 생성)
                                transactionColumn.forEach((el, cellIndex) => {
                                        if (cellIndex > 0) {
                                                let cellVal = item[el.id] // key == assetColumn.id

                                                if (cellIndex == 2) {
                                                        // propertyIdx
                                                        cellVal = rowIndex
                                                }

                                                // 2번째 이상 행에서 기본정보 반복 내용 안보이게
                                                if (
                                                        rowIndex > 1 &&
                                                        cellIndex < 8
                                                ) {
                                                        // 셀내용 삭제
                                                        //cellVal = null
                                                }

                                                // 매매정보
                                                if (cellIndex >= 7) {
                                                        // 매매정보가 있고,  경우만 생성
                                                        if (
                                                                transaction_cnt >
                                                                        0 &&
                                                                transaction_cnt >=
                                                                        rowIndex
                                                        ) {
                                                                cellVal =
                                                                        transactionsArray[
                                                                                rowIndex -
                                                                                        1
                                                                        ][
                                                                                el.id.replace(
                                                                                        'transaction_',
                                                                                        ''
                                                                                )
                                                                        ]

                                                                // console.log(rowIndex-1)
                                                                // console.log(el.id.replace('transaction_',''))
                                                                // console.log(transactionsArray[rowIndex-1][el.id.replace('transaction_','')])
                                                                if (
                                                                        cellIndex ==
                                                                        19
                                                                ) {
                                                                        // Est.CapRate
                                                                        cellVal =
                                                                                cellVal /
                                                                                100
                                                                }

                                                                if (
                                                                        cellIndex ==
                                                                        20
                                                                ) {
                                                                        // Est.DiscountRate
                                                                        cellVal =
                                                                                cellVal /
                                                                                100
                                                                }
                                                        }
                                                }

                                                rowVals.push(
                                                        cellVal == 0
                                                                ? null
                                                                : cellVal
                                                )
                                        }
                                })
                                dataRowTransaction.push(rowVals)
                                dataCountTransaction++
                                //console.log(dataRow)
                        }
                })

                // addWorksheet() 함수를 사용하여 엑셀 시트를 추가한다.
                // 엑셀 시트는 순차적으로 생성된다.
                workbook.addWorksheet('Transactions')

                // 엑셀 시트를 접근하는 방법은 세 가지 방법이 존재한다.
                // 1. getWorksheet() 함수에서 시트 명칭 전달
                const sheetTwo = workbook.getWorksheet('Transactions')

                // 시트 속성
                sheetTwo.properties.defaultColWidth = defaultColumnWidth

                //column count는 1부터 시작
                sheetTwo.getColumn(14).numFmt = '"₩"#,##0;[Red]-"₩"#,##0'
                sheetTwo.getColumn(15).numFmt = '"₩"#,##0;[Red]-"₩"#,##0'
                sheetTwo.getColumn(16).numFmt = '"₩"#,##0;[Red]-"₩"#,##0'
                sheetTwo.getColumn(17).numFmt = '"₩"#,##0;[Red]-"₩"#,##0'
                sheetTwo.getColumn(18).numFmt = '"₩"#,##0;[Red]-"₩"#,##0'

                sheetTwo.getColumn(19).numFmt = '0.00%'
                sheetTwo.getColumn(20).numFmt = '0.00%'

                // 시트 배경색상, 테두리 설정
                for (let i = 1; i < maxRowsLength; i += 1) {
                        for (let j = 1; j < transactionColumnsLength; j += 1) {
                                sheetTwo.getRow(i).getCell(j).font = {
                                        name: 'Times New Roman',
                                        size: 11,
                                        bold: false,
                                }

                                sheetTwo.getRow(i).getCell(j).border = {
                                        top: {
                                                style: 'thin',
                                                color: { argb: 'FFFFFFFF' },
                                        },
                                        left: {
                                                style: 'thin',
                                                color: { argb: 'FFFFFFFF' },
                                        },
                                        bottom: {
                                                style: 'thin',
                                                color: { argb: 'FFFFFFFF' },
                                        },
                                        right: {
                                                style: 'thin',
                                                color: { argb: 'FFFFFFFF' },
                                        },
                                }
                        }
                }
                //로고 셀
                sheetTwo.mergeCells('A2:A3')
                sheetTwo.getCell('A2').value = 'CBRE'
                sheetTwo.getCell('A2').font = {
                        size: 22,
                        bold: true,
                        color: { argb: 'ff042453' },
                }
                sheetTwo.getCell('A2').alignment = {
                        vertical: 'middle',
                        horizontal: 'right',
                }

                sheetTwo.mergeCells('B2:C3')
                sheetTwo.getCell('B2').value = 'Real Estate Assets'
                sheetTwo.getCell('B2').font = {
                        size: 22,
                        bold: false,
                        color: { argb: 'ff042453' },
                }
                sheetTwo.getCell('B2').alignment = {
                        vertical: 'middle',
                        horizontal: 'left',
                }

                //시트 제목
                sheetTwo.getCell('D2').value = 'Transactions Report'
                sheetTwo.getCell('D2').font = {
                        size: 12,
                        bold: true,
                        color: { argb: 'ff042453' },
                }
                sheetTwo.getCell('D2').alignment = {
                        vertical: 'bottom',
                        horizontal: 'left',
                        indent: 1,
                }
                sheetTwo.getCell('D2').border = {
                        left: { style: 'medium', color: { argb: 'ff042453' } },
                        bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } },
                }

                //생성 일자
                sheetTwo.getCell('D3').value = 'Created on ' + shortDate
                sheetTwo.getCell('D3').font = {
                        size: 10,
                        bold: false,
                        color: { argb: 'ff042453' },
                }
                sheetTwo.getCell('D3').alignment = {
                        vertical: 'top',
                        horizontal: 'left',
                        indent: 1,
                }
                sheetTwo.getCell('D3').border = {
                        left: { style: 'medium', color: { argb: 'ff042453' } },
                }

                // 제목 그룹  - 기본정보
                sheetTwo.mergeCells('A5:G5')
                sheetTwo.getCell('A5').alignment = {
                        vertical: 'bottom',
                        horizontal: 'center',
                }
                sheetTwo.getCell('A5').value = 'General Infomation'
                sheetTwo.getCell('A5').font = {
                        size: 10,
                        bold: true,
                        color: { argb: 'FFFFFFFF' },
                }
                sheetTwo.getCell('A5').fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'ff1a4f9d' },
                }
                sheetTwo.getCell('A5').border = {
                        top: { style: 'thin', color: { argb: 'ff1a4f9d' } },
                        left: { style: 'thin', color: { argb: 'ff1a4f9d' } },
                        bottom: { style: 'thin', color: { argb: 'ff1a4f9d' } },
                        right: { style: 'thin', color: { argb: 'ff1a4f9d' } },
                }

                // 제목 그룹  - 매매 정보
                sheetTwo.mergeCells('H5:T5')
                sheetTwo.getCell('H5').alignment = {
                        vertical: 'bottom',
                        horizontal: 'center',
                }
                sheetTwo.getCell('H5').value = 'Transaction Infomation'
                sheetTwo.getCell('H5').font = {
                        size: 10,
                        bold: true,
                        color: { argb: 'FFFFFFFF' },
                }
                sheetTwo.getCell('H5').fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'ff0b4c5f' },
                }
                sheetTwo.getCell('H5').border = {
                        top: { style: 'thin', color: { argb: 'ff0b4c5f' } },
                        left: { style: 'thin', color: { argb: 'ff0b4c5f' } },
                        bottom: { style: 'thin', color: { argb: 'ff0b4c5f' } },
                        right: { style: 'thin', color: { argb: 'ff0b4c5f' } },
                }

                //테이블 데이터
                sheetTwo.getRow(6).height = 28
                sheetTwo.addTable({
                        name: 'TransactionTable',
                        ref: 'A6',
                        headerRow: true,
                        totalsRow: false,
                        // style: {
                        //         theme: 'TableStyleLight2',
                        //         showRowStripes: false,
                        // },
                        columns: transactionColumn,
                        rows: dataRowTransaction,
                })

                // 제목 행 스타일 설정
                for (let j = 1; j < transactionColumnsLength; j += 1) {
                        sheetTwo.getRow(6).getCell(j).fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: 'ff1a4f9d' },
                        }
                        sheetTwo.getRow(6).getCell(j).border = {
                                top: {
                                        style: 'thin',
                                        color: { argb: 'ff1a4f9d' },
                                },
                                left: {
                                        style: 'thin',
                                        color: { argb: 'ff1a4f9d' },
                                },
                                bottom: {
                                        style: 'thin',
                                        color: { argb: 'ff1a4f9d' },
                                },
                                right: {
                                        style: 'thin',
                                        color: { argb: 'ff1a4f9d' },
                                },
                        }
                        sheetTwo.getRow(6).getCell(j).alignment = {
                                vertical: 'middle',
                                horizontal: 'center',
                        }
                        sheetTwo.getRow(6).getCell(j).font = {
                                size: 14,
                                bold: true,
                                color: { argb: 'FFFFFFFF' },
                        }
                }

                // 제목 행 - 매매정보 스타일 설정
                for (let j = 8; j < transactionColumnsLength; j += 1) {
                        sheetTwo.getRow(6).getCell(j).fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: 'ff0b4c5f' },
                        }

                        sheetTwo.getRow(6).getCell(j).border = {
                                top: {
                                        style: 'thin',
                                        color: { argb: 'ff0b4c5f' },
                                },
                                left: {
                                        style: 'thin',
                                        color: { argb: 'ff0b4c5f' },
                                },
                                bottom: {
                                        style: 'thin',
                                        color: { argb: 'ff0b4c5f' },
                                },
                                right: {
                                        style: 'thin',
                                        color: { argb: 'ff0b4c5f' },
                                },
                        }
                }

                // 데이터셀 홀수 행 배경색상
                for (let i = 1; i < transactionColumnsLength; i++) {
                        for (let j = 1; j <= dataCountTransaction; j++) {
                                if (j % 2 == 0) {
                                        // 짝수 행
                                        //console.log(j)
                                        sheetTwo.getRow(6 + j).getCell(i).fill =
                                                {
                                                        type: 'pattern',
                                                        pattern: 'solid',
                                                        fgColor: {
                                                                argb: 'ffeff3f6',
                                                        },
                                                }
                                }
                        }
                }

                // 데이터셀 기본정보 반복행 배경색과 글씨색 동일하게 변경
                for (let i = 4; i < 8; i++) {
                        // 컬럼

                        for (let j = 1; j <= dataCountTransaction; j++) {
                                // 로우
                                let pre = sheetTwo
                                        .getRow(6 + j - 1)
                                        .getCell(2).value
                                let now = sheetTwo
                                        .getRow(6 + j)
                                        .getCell(2).value

                                // 윗 행과 현재 행의 property Id 가 같으면 색상 변경
                                if (pre == now) {
                                        if (j % 2 == 0) {
                                                // 짝수 행
                                                sheetTwo
                                                        .getRow(6 + j)
                                                        .getCell(i).font = {
                                                        size: 14,
                                                        bold: true,
                                                        color: {
                                                                argb: 'ffeff3f6',
                                                        },
                                                }
                                        } else {
                                                // 홀수 행
                                                sheetTwo
                                                        .getRow(6 + j)
                                                        .getCell(i).font = {
                                                        size: 14,
                                                        bold: true,
                                                        color: {
                                                                argb: 'ffffffff',
                                                        },
                                                }
                                        }
                                }
                        }
                }

                //  TotalCount 행
                sheetTwo.getRow(8 + dataCountTransaction).getCell(1).value =
                        'Total : ' + dataCountTransaction
                //  카피라이트 행
                sheetTwo.getRow(9 + dataCountTransaction).getCell(1).value =
                        'Copyright 2023 CBRE.  All rights reserved.'

                // 데이터 열 너비 재설정
                for (let j = 1; j < transactionColumnsLength; j += 1) {
                        let dataCell = sheetTwo.getRow(7).getCell(j)
                        var columnLength = dataCell.value
                                ? dataCell.value.toString().length
                                : defaultColumnWidth
                        sheetTwo.getColumn(j).width =
                                columnLength < defaultColumnWidth
                                        ? defaultColumnWidth
                                        : columnLength
                }

                /**                               */
                /**                               */
                /**            리스 시트            */
                /**                               */
                /**                               */

                // Lease 시트 컬럼 지정
                let leaseColumn = [
                        // 기본정보 (1~7)
                        {
                                name: 'No. ',
                                totalsRowLabel: 'Totals:',
                                filterButton: true,
                        }, // 1.
                        {
                                name: 'Property ID',
                                id: 'propertyId',
                                totalsRowFunction: 'count',
                                filterButton: true,
                        }, // 2.
                        {
                                name: 'Property Idx',
                                id: 'propertyIdx',
                                filterButton: true,
                        }, // 3.
                        {
                                name: 'Property Name',
                                id: 'propertyName',
                                filterButton: true,
                        }, // 4.
                        { name: 'Grade', id: 'grade', filterButton: true }, // 5.

                        { name: 'Sector', id: 'sector', filterButton: true }, // 6.
                        { name: 'Type', id: 'sectorType', filterButton: true }, // 7.

                        // 리스정보 (8~)
                        {
                                name: 'Lease.Idx',
                                id: 'leaseIdx',
                                filterButton: true,
                        }, // 8.

                        {
                                name: 'askingUnit',
                                id: 'askingUnit',
                                filterButton: true,
                        }, // 9.
                        {
                                name: 'askingTotalOccupyingPeriodYear',
                                id: 'askingTotalOccupyingPeriodYear',
                                filterButton: true,
                        }, // 10.
                        {
                                name: '1askingTotalFreeRentPeriodMth',
                                id: 'askingTotalFreeRentPeriodMth',
                                filterButton: true,
                        }, // 11.
                        {
                                name: 'askingTotalFreeRentOccupyingYear',
                                id: 'askingTotalFreeRentOccupyingYear',
                                filterButton: true,
                        }, // 12.
                        {
                                name: 'askingTIAmountNfaPy',
                                id: 'askingTIAmountNfaPy',
                                filterButton: true,
                        }, // 13.
                        {
                                name: 'askingTIAmountKrw',
                                id: 'askingTIAmountKrw',
                                filterButton: true,
                        }, // 14.
                        {
                                name: 'askingRentMthPy',
                                id: 'askingRentMthPy',
                                filterButton: true,
                        }, // 15.
                        {
                                name: 'askingRentFreeType',
                                id: 'askingRentFreeType',
                                filterButton: true,
                        }, // 16.
                        {
                                name: 'askingRentFreeMth',
                                id: 'askingRentFreeMth',
                                filterButton: true,
                        }, // 17.
                        {
                                name: 'askingNoc',
                                id: 'askingNoc',
                                filterButton: true,
                        }, // 18.

                        {
                                name: 'askingNfaSqm',
                                id: 'askingNfaSqm',
                                filterButton: true,
                        }, // 19.
                        {
                                name: 'askingNfaPy',
                                id: 'askingNfaPy',
                                filterButton: true,
                        }, // 20.
                        {
                                name: 'askingMoveInDate',
                                id: 'askingMoveInDate',
                                filterButton: true,
                        }, // 21.
                        {
                                name: 'askingMonthlyRent',
                                id: 'askingMonthlyRent',
                                filterButton: true,
                        }, // 22.
                        {
                                name: 'askingMonthlyCashSupportGfa',
                                id: 'askingMonthlyCashSupportGfa',
                                filterButton: true,
                        }, // 23.
                        {
                                name: 'askingMonthlyCAMF',
                                id: 'askingMonthlyCAMF',
                                filterButton: true,
                        }, // 24.
                        {
                                name: 'askingLeaseTermYear',
                                id: 'askingLeaseTermYear',
                                filterButton: true,
                        }, // 25.
                        {
                                name: 'askingIod',
                                id: 'askingIod',
                                filterButton: true,
                        }, // 26.
                        {
                                name: 'askingGfaSqm',
                                id: 'askingGfaSqm',
                                filterButton: true,
                        }, // 27.
                        {
                                name: 'askingGfaPy',
                                id: 'askingGfaPy',
                                filterButton: true,
                        }, // 28.

                        {
                                name: 'askingGdm',
                                id: 'askingGdm',
                                filterButton: true,
                        }, // 29.
                        {
                                name: 'askingFloor',
                                id: 'askingFloor',
                                filterButton: true,
                        }, // 30.
                        {
                                name: 'askingFitOut',
                                id: 'askingFitOut',
                                filterButton: true,
                        }, // 31.
                        {
                                name: 'askingEffRatio',
                                id: 'askingEffRatio',
                                filterButton: true,
                        }, // 32.
                        {
                                name: 'askingDepositPy',
                                id: 'askingDepositPy',
                                filterButton: true,
                        }, // 33.
                        {
                                name: 'askingDeposit',
                                id: 'askingDeposit',
                                filterButton: true,
                        }, // 34.
                        {
                                name: 'askingCamfMthPy',
                                id: 'askingCamfMthPy',
                                filterButton: true,
                        }, // 35.
                        {
                                name: 'askingAllInNoc',
                                id: 'askingAllInNoc',
                                filterButton: true,
                        }, // 36.
                        {
                                name: 'askingAllInEffectiveRentMthPy',
                                id: 'askingAllInEffectiveRentMthPy',
                                filterButton: true,
                        }, // 37.

                        {
                                name: 'actualUnit',
                                id: 'actualUnit',
                                filterButton: true,
                        }, // 38.
                        {
                                name: 'actualTotalOccupyingPeriodYear',
                                id: 'actualTotalOccupyingPeriodYear',
                                filterButton: true,
                        }, // 39.
                        {
                                name: 'actualTotalFreeRentPeriodMth',
                                id: 'actualTotalFreeRentPeriodMth',
                                filterButton: true,
                        }, // 40.
                        {
                                name: 'actualTotalFreeRentOccupyingYear',
                                id: 'actualTotalFreeRentOccupyingYear',
                                filterButton: true,
                        }, // 41.
                        {
                                name: 'actualTIAmountNfaPy',
                                id: 'actualTIAmountNfaPy',
                                filterButton: true,
                        }, // 42.
                        {
                                name: 'actualTIAmountKrw',
                                id: 'actualTIAmountKrw',
                                filterButton: true,
                        }, // 43.
                        {
                                name: 'actualRentMthPy',
                                id: 'actualRentMthPy',
                                filterButton: true,
                        }, // 44.
                        {
                                name: 'actualRentFreeType',
                                id: 'actualRentFreeType',
                                filterButton: true,
                        }, // 45.
                        {
                                name: 'actualRentFreeMth',
                                id: 'actualRentFreeMth',
                                filterButton: true,
                        }, // 46.
                        {
                                name: 'actualNoc',
                                id: 'actualNoc',
                                filterButton: true,
                        }, // 47.

                        {
                                name: 'actualNfaSqm',
                                id: 'actualNfaSqm',
                                filterButton: true,
                        }, // 48.
                        {
                                name: 'actualNfaPy',
                                id: 'actualNfaPy',
                                filterButton: true,
                        }, // 49.
                        {
                                name: 'actualMonthlyRent',
                                id: 'actualMonthlyRent',
                                filterButton: true,
                        }, // 50.
                        {
                                name: 'actualMonthlyCashSupportGfa',
                                id: 'actualMonthlyCashSupportGfa',
                                filterButton: true,
                        }, // 51.
                        {
                                name: 'actualMonthlyCAMF',
                                id: 'actualMonthlyCAMF',
                                filterButton: true,
                        }, // 52.

                        {
                                name: 'actualLeaseTermYear',
                                id: 'actualLeaseTermYear',
                                filterButton: true,
                        }, // 53.
                        {
                                name: 'actualLeaseStartDate',
                                id: 'actualLeaseStartDate',
                                filterButton: true,
                        }, // 54.
                        {
                                name: 'actualIod',
                                id: 'actualIod',
                                filterButton: true,
                        }, // 55.
                        {
                                name: 'actualGfaSqm',
                                id: 'actualGfaSqm',
                                filterButton: true,
                        }, // 56.
                        {
                                name: 'actualGfaPy',
                                id: 'actualGfaPy',
                                filterButton: true,
                        }, // 57.

                        {
                                name: 'actualGdm',
                                id: 'actualGdm',
                                filterButton: true,
                        }, // 58.
                        {
                                name: 'actualFloor',
                                id: 'actualFloor',
                                filterButton: true,
                        }, // 59.
                        {
                                name: 'actualFitOut',
                                id: 'actualFitOut',
                                filterButton: true,
                        }, // 60.
                        {
                                name: 'actualEffectiveNoc',
                                id: 'actualEffectiveNoc',
                                filterButton: true,
                        }, // 61.
                        {
                                name: 'actualEffRatio',
                                id: 'actualEffRatio',
                                filterButton: true,
                        }, // 62.

                        {
                                name: 'actualDepositPy',
                                id: 'actualDepositPy',
                                filterButton: true,
                        }, // 63.
                        {
                                name: 'actualDeposit',
                                id: 'actualDeposit',
                                filterButton: true,
                        }, // 64.
                        {
                                name: 'actualCamfMthPy',
                                id: 'actualCamfMthPy',
                                filterButton: true,
                        }, // 65.
                        {
                                name: 'actualAllInNoc',
                                id: 'actualAllInNoc',
                                filterButton: true,
                        }, // 66.
                        {
                                name: 'actualAllInEffectiveRentMthPy',
                                id: 'actualAllInEffectiveRentMthPy',
                                filterButton: true,
                        }, // 67.
                ]

                // Lease 시트 데이터
                let dataRowLease = []
                let dataCountLease = 0
                let leaseData = data.filter((item) => item.lease_info.total > 0)
                leaseData.forEach((item, itemIndex) => {
                        let propertyId = item['propertyId']

                        let lease_cnt = 0
                        let lease_asking_cnt = 0
                        let lease_actual_cnt = 0
                        let lease_info = item['lease_info']

                        let leasesIdxArray = []
                        let leasesActualArray = lease_info['leasesActual']
                        leasesActualArray = leasesActualArray.sort(function (
                                a,
                                b
                        ) {
                                return a.leaseIdx - b.leaseIdx
                        })
                        let leasesAskingArray = lease_info['leasesAsking']
                        leasesAskingArray = leasesAskingArray.sort(function (
                                a,
                                b
                        ) {
                                return a.leaseIdx - b.leaseIdx
                        })
                        leasesAskingArray.forEach((el) =>
                                leasesIdxArray.includes(el.leaseIdx)
                                        ? null
                                        : leasesIdxArray.push(el.leaseIdx)
                        )
                        leasesActualArray.forEach((el) =>
                                leasesIdxArray.includes(el.leaseIdx)
                                        ? null
                                        : leasesIdxArray.push(el.leaseIdx)
                        )

                        leasesIdxArray = leasesIdxArray.sort(function (a, b) {
                                return a - b
                        })

                        //console.log(leasesArray)

                        if (
                                leases == null ||
                                (leases && leases.includes(propertyId))
                        ) {
                                lease_cnt = lease_info.total
                                lease_asking_cnt = lease_info.askingCnt
                                lease_actual_cnt = lease_info.actualCnt
                        }

                        // leases && transactions 필터

                        if (leasesAskingList && leasesAskingList.length > 0) {
                                // 자산 번호가 같으면 , leaseIdx를 pop 제거
                                leasesAskingList.forEach((le) => {
                                        if (le.propertyId == item.propertyId) {
                                                //console.log('찾았다. 리스 ')

                                                // 체크된 리스 idx 를 돌면서
                                                let newLeasesAskingArray = []
                                                let filteredLeaseAskingItem
                                                le.leasesAsking.forEach(
                                                        (leIdx) => {
                                                                // item에 들어있는 leaseIdx 필터
                                                                //console.log(item.lease_info.leases)
                                                                //console.log(leIdx)
                                                                filteredLeaseAskingItem =
                                                                        leasesAskingArray.filter(
                                                                                (
                                                                                        leaseItem
                                                                                ) =>
                                                                                        leaseItem.leaseIdx ==
                                                                                        leIdx
                                                                        )
                                                                //console.log(filteredLeaseItem[0])
                                                                newLeasesAskingArray.push(
                                                                        filteredLeaseAskingItem[0]
                                                                )
                                                                //console.log(item)
                                                        }
                                                )
                                                //console.log(newLeasesArray)
                                                //console.log(item)
                                                leasesAskingArray = []

                                                newLeasesAskingArray.forEach(
                                                        (newLease) => {
                                                                leasesAskingArray.push(
                                                                        newLease
                                                                )
                                                        }
                                                )

                                                // 리스 개수 재설정
                                                lease_asking_cnt =
                                                        newLeasesAskingArray.length
                                        }
                                })
                        } else {
                                lease_cnt = 0
                        }

                        //console.log('leases && transactions 필터')
                        //console.log(leasesActualList)
                        if (leasesActualList && leasesActualList.length > 0) {
                                // 자산 번호가 같으면 , leaseIdx를 pop 제거
                                leasesActualList.forEach((le) => {
                                        if (le.propertyId == item.propertyId) {
                                                //console.log('찾았다. 리스 ')

                                                // 체크된 리스 idx 를 돌면서
                                                let newLeasesActualArray = []
                                                let filteredLeaseItem
                                                le.leasesActual.forEach(
                                                        (leIdx) => {
                                                                // item에 들어있는 leaseIdx 필터
                                                                //console.log(item.lease_info.leases)
                                                                //console.log(leIdx)
                                                                filteredLeaseItem =
                                                                        leasesActualArray.filter(
                                                                                (
                                                                                        leaseItem
                                                                                ) =>
                                                                                        leaseItem.leaseIdx ==
                                                                                        leIdx
                                                                        )
                                                                //console.log(filteredLeaseItem[0])
                                                                newLeasesActualArray.push(
                                                                        filteredLeaseItem[0]
                                                                )
                                                                //console.log(item)
                                                        }
                                                )
                                                //console.log(newLeasesArray)
                                                //console.log(item)
                                                leasesActualArray = []

                                                newLeasesActualArray.forEach(
                                                        (newLease) => {
                                                                leasesActualArray.push(
                                                                        newLease
                                                                )
                                                        }
                                                )

                                                // 리스 개수 재설정
                                                lease_actual_cnt =
                                                        newLeasesActualArray.length
                                        }
                                })
                        } else {
                                lease_cnt = 0
                        }

                        // 총 생성 로우 수 == 매매내역이나 리스내역 중 최대 값
                        let maxRowCnt = Math.max(1, lease_cnt)

                        for (
                                let rowIndex = 1;
                                rowIndex <= maxRowCnt;
                                rowIndex++
                        ) {
                                //console.log(rowIndex)

                                let rowVals = []
                                rowVals.push(dataCountLease + 1) //no

                                let leaseAsking = leasesAskingArray.filter(
                                        (el) =>
                                                el.leaseIdx ==
                                                leasesIdxArray[rowIndex - 1]
                                )[0]
                                let leaseActual = leasesActualArray.filter(
                                        (el) =>
                                                el.leaseIdx ==
                                                leasesIdxArray[rowIndex - 1]
                                )[0]

                                // 1개씩 row 생성 (가로 우측으로 셀마다 이동하며 생성)
                                leaseColumn.forEach((el, cellIndex) => {
                                        if (cellIndex > 0) {
                                                let cellVal = item[el.id] // key == assetColumn.id

                                                if (cellIndex == 2) {
                                                        // propertyIdx
                                                        cellVal = rowIndex
                                                }

                                                // 2번째 이상 행에서 기본정보 반복 내용 안보이게
                                                if (
                                                        rowIndex > 1 &&
                                                        cellIndex < 8
                                                ) {
                                                        // 셀내용 삭제
                                                        //cellVal = null
                                                }

                                                // 리스정보 index
                                                if (cellIndex == 7) {
                                                        //console.log('리스정보 asking ')
                                                        // console.log(leasesAskingArray)
                                                        // console.log(leasesActualArray)
                                                        if (
                                                                lease_cnt > 0 &&
                                                                lease_cnt >=
                                                                        rowIndex
                                                        ) {
                                                                cellVal =
                                                                        leasesIdxArray[
                                                                                rowIndex -
                                                                                        1
                                                                        ]
                                                        }
                                                }

                                                // 리스정보 asking
                                                if (
                                                        cellIndex >= 8 &&
                                                        cellIndex <= 36
                                                ) {
                                                        //leaseAsking ? leaseAsking : cellVal =  null
                                                        leaseAsking
                                                                ? (cellVal =
                                                                          leaseAsking[
                                                                                  el.id.replace(
                                                                                          'lease_',
                                                                                          ''
                                                                                  )
                                                                          ])
                                                                : null
                                                }

                                                // 리스정보 asking
                                                if (cellIndex > 37) {
                                                        //leaseActual ? leaseActual : cellVal =  null
                                                        leaseActual
                                                                ? (cellVal =
                                                                          leaseActual[
                                                                                  el.id.replace(
                                                                                          'lease_',
                                                                                          ''
                                                                                  )
                                                                          ])
                                                                : null
                                                }

                                                rowVals.push(
                                                        cellVal == 0
                                                                ? null
                                                                : cellVal
                                                )
                                        }
                                })
                                dataRowLease.push(rowVals)
                                dataCountLease++
                                //console.log(dataRow)
                        }
                })

                // addWorksheet() 함수를 사용하여 엑셀 시트를 추가한다.
                // 엑셀 시트는 순차적으로 생성된다.
                workbook.addWorksheet('Lease')

                // 엑셀 시트를 접근하는 방법은 세 가지 방법이 존재한다.
                // 1. getWorksheet() 함수에서 시트 명칭 전달
                const sheetThree = workbook.getWorksheet('Lease')

                // 시트 속성
                sheetThree.properties.defaultColWidth = defaultColumnWidth

                //column count는 1부터 시작
                sheetThree.getColumn(18).numFmt = '0.00%'

                sheetThree.getColumn(23).numFmt = '#,##0.00'

                sheetThree.getColumn(41).numFmt = '"₩"#,##0;[Red]-"₩"#,##0'

                // 시트 배경색상, 테두리 설정
                for (let i = 1; i < maxRowsLength; i += 1) {
                        for (let j = 1; j < leaseColumnsLength; j += 1) {
                                sheetThree.getRow(i).getCell(j).font = {
                                        name: 'Times New Roman',
                                        size: 11,
                                        bold: false,
                                }

                                sheetThree.getRow(i).getCell(j).border = {
                                        top: {
                                                style: 'thin',
                                                color: { argb: 'FFFFFFFF' },
                                        },
                                        left: {
                                                style: 'thin',
                                                color: { argb: 'FFFFFFFF' },
                                        },
                                        bottom: {
                                                style: 'thin',
                                                color: { argb: 'FFFFFFFF' },
                                        },
                                        right: {
                                                style: 'thin',
                                                color: { argb: 'FFFFFFFF' },
                                        },
                                }
                        }
                }
                //로고 셀
                sheetThree.mergeCells('A2:A3')
                sheetThree.getCell('A2').value = 'CBRE'
                sheetThree.getCell('A2').font = {
                        size: 22,
                        bold: true,
                        color: { argb: 'ff042453' },
                }
                sheetThree.getCell('A2').alignment = {
                        vertical: 'middle',
                        horizontal: 'right',
                }

                sheetThree.mergeCells('B2:C3')
                sheetThree.getCell('B2').value = 'Real Estate Assets'
                sheetThree.getCell('B2').font = {
                        size: 22,
                        bold: false,
                        color: { argb: 'ff042453' },
                }
                sheetThree.getCell('B2').alignment = {
                        vertical: 'middle',
                        horizontal: 'left',
                }

                //시트 제목
                sheetThree.getCell('D2').value = 'Leases Report'
                sheetThree.getCell('D2').font = {
                        size: 12,
                        bold: true,
                        color: { argb: 'ff042453' },
                }
                sheetThree.getCell('D2').alignment = {
                        vertical: 'bottom',
                        horizontal: 'left',
                        indent: 1,
                }
                sheetThree.getCell('D2').border = {
                        left: { style: 'medium', color: { argb: 'ff042453' } },
                        bottom: { style: 'thin', color: { argb: 'FFFFFFFF' } },
                }

                //생성 일자
                sheetThree.getCell('D3').value = 'Created on ' + shortDate
                sheetThree.getCell('D3').font = {
                        size: 10,
                        bold: false,
                        color: { argb: 'ff042453' },
                }
                sheetThree.getCell('D3').alignment = {
                        vertical: 'top',
                        horizontal: 'left',
                        indent: 1,
                }
                sheetThree.getCell('D3').border = {
                        left: { style: 'medium', color: { argb: 'ff042453' } },
                }

                // 제목 그룹  - 기본정보
                sheetThree.mergeCells('A5:G5')
                sheetThree.getCell('A5').alignment = {
                        vertical: 'bottom',
                        horizontal: 'center',
                }
                sheetThree.getCell('A5').value = 'General Infomation'
                sheetThree.getCell('A5').font = {
                        size: 10,
                        bold: true,
                        color: { argb: 'FFFFFFFF' },
                }
                sheetThree.getCell('A5').fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'ff1a4f9d' },
                }
                sheetThree.getCell('A5').border = {
                        top: { style: 'thin', color: { argb: 'ff1a4f9d' } },
                        left: { style: 'thin', color: { argb: 'ff1a4f9d' } },
                        bottom: { style: 'thin', color: { argb: 'ff1a4f9d' } },
                        right: { style: 'thin', color: { argb: 'ff1a4f9d' } },
                }

                // 제목 그룹  - 리스(asking) 정보
                sheetThree.mergeCells('H5:AK5')
                sheetThree.getCell('H5').alignment = {
                        vertical: 'bottom',
                        horizontal: 'center',
                }
                sheetThree.getCell('H5').value = 'Asking Lease Infomation'
                sheetThree.getCell('H5').font = {
                        size: 10,
                        bold: true,
                        color: { argb: 'FFFFFFFF' },
                }
                sheetThree.getCell('H5').fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'ffffde33' },
                }
                sheetThree.getCell('H5').border = {
                        top: { style: 'thin', color: { argb: 'ffffde33' } },
                        left: { style: 'thin', color: { argb: 'ffffde33' } },
                        bottom: { style: 'thin', color: { argb: 'ffffde33' } },
                        right: { style: 'thin', color: { argb: 'ffffde33' } },
                }
                // 제목 그룹  - 리스(actual) 정보
                sheetThree.mergeCells('AL5:BO5')
                sheetThree.getCell('AL5').alignment = {
                        vertical: 'bottom',
                        horizontal: 'center',
                }
                sheetThree.getCell('AL5').value = 'Actual Lease Infomation'
                sheetThree.getCell('AL5').font = {
                        size: 10,
                        bold: true,
                        color: { argb: 'FFFFFFFF' },
                }
                sheetThree.getCell('AL5').fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'ffdba901' },
                }
                sheetThree.getCell('AL5').border = {
                        top: { style: 'thin', color: { argb: 'ffdba901' } },
                        left: { style: 'thin', color: { argb: 'ffdba901' } },
                        bottom: { style: 'thin', color: { argb: 'ffdba901' } },
                        right: { style: 'thin', color: { argb: 'ffdba901' } },
                }

                sheetThree.getRow(5).height = 12
                // sheetOne.getCell('A5').fill = {
                //         type: 'pattern',
                //         pattern: 'solid',
                //         fgColor: { argb: 'ff042453' },
                // };

                //테이블 데이터
                sheetThree.getRow(6).height = 28
                sheetThree.addTable({
                        name: 'LeaseTable',
                        ref: 'A6',
                        headerRow: true,
                        totalsRow: false,
                        // style: {
                        //         theme: 'TableStyleLight2',
                        //         showRowStripes: false,
                        // },
                        columns: leaseColumn,
                        rows: dataRowLease,
                })

                // 제목 행 스타일 설정
                for (let j = 1; j < leaseColumnsLength; j += 1) {
                        sheetThree.getRow(6).getCell(j).fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: 'ff1a4f9d' },
                        }
                        sheetThree.getRow(6).getCell(j).border = {
                                top: {
                                        style: 'thin',
                                        color: { argb: 'ff1a4f9d' },
                                },
                                left: {
                                        style: 'thin',
                                        color: { argb: 'ff1a4f9d' },
                                },
                                bottom: {
                                        style: 'thin',
                                        color: { argb: 'ff1a4f9d' },
                                },
                                right: {
                                        style: 'thin',
                                        color: { argb: 'ff1a4f9d' },
                                },
                        }
                        sheetThree.getRow(6).getCell(j).alignment = {
                                vertical: 'middle',
                                horizontal: 'center',
                        }
                        sheetThree.getRow(6).getCell(j).font = {
                                size: 14,
                                bold: true,
                                color: { argb: 'FFFFFFFF' },
                        }
                }

                // 제목 행 - 리스정보(asking) 스타일 설정
                for (let j = 8; j < leaseAskingColumnsLength; j += 1) {
                        sheetThree.getRow(6).getCell(j).fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: 'ffffde33' },
                        }

                        sheetThree.getRow(6).getCell(j).border = {
                                top: {
                                        style: 'thin',
                                        color: { argb: 'ffffde33' },
                                },
                                left: {
                                        style: 'thin',
                                        color: { argb: 'ffffde33' },
                                },
                                bottom: {
                                        style: 'thin',
                                        color: { argb: 'ffffde33' },
                                },
                                right: {
                                        style: 'thin',
                                        color: { argb: 'ffffde33' },
                                },
                        }
                }

                // 제목 행 - 리스정보(actual) 스타일 설정
                for (
                        let j = leaseAskingColumnsLength;
                        j < leaseColumnsLength;
                        j += 1
                ) {
                        sheetThree.getRow(6).getCell(j).fill = {
                                type: 'pattern',
                                pattern: 'solid',
                                fgColor: { argb: 'ffdba901' },
                        }

                        sheetThree.getRow(6).getCell(j).border = {
                                top: {
                                        style: 'thin',
                                        color: { argb: 'ffdba901' },
                                },
                                left: {
                                        style: 'thin',
                                        color: { argb: 'ffdba901' },
                                },
                                bottom: {
                                        style: 'thin',
                                        color: { argb: 'ffdba901' },
                                },
                                right: {
                                        style: 'thin',
                                        color: { argb: 'ffdba901' },
                                },
                        }
                }

                // 데이터셀 홀수 행 배경색상
                for (let i = 1; i < leaseColumnsLength; i++) {
                        for (let j = 1; j <= dataCountLease; j++) {
                                if (j % 2 == 0) {
                                        // 짝수 행
                                        //console.log(j)
                                        sheetThree
                                                .getRow(6 + j)
                                                .getCell(i).fill = {
                                                type: 'pattern',
                                                pattern: 'solid',
                                                fgColor: {
                                                        argb: 'ffeff3f6',
                                                },
                                        }
                                }
                        }
                }

                // 데이터셀 기본정보 반복행 배경색과 글씨색 동일하게 변경
                for (let i = 4; i < 8; i++) {
                        // 컬럼

                        for (let j = 1; j <= dataCountLease; j++) {
                                // 로우
                                let pre = sheetThree
                                        .getRow(6 + j - 1)
                                        .getCell(2).value
                                let now = sheetThree
                                        .getRow(6 + j)
                                        .getCell(2).value

                                // 윗 행과 현재 행의 property Id 가 같으면 색상 변경
                                if (pre == now) {
                                        if (j % 2 == 0) {
                                                // 짝수 행
                                                sheetThree
                                                        .getRow(6 + j)
                                                        .getCell(i).font = {
                                                        size: 14,
                                                        bold: true,
                                                        color: {
                                                                argb: 'ffeff3f6',
                                                        },
                                                }
                                        } else {
                                                // 홀수 행
                                                sheetThree
                                                        .getRow(6 + j)
                                                        .getCell(i).font = {
                                                        size: 14,
                                                        bold: true,
                                                        color: {
                                                                argb: 'ffffffff',
                                                        },
                                                }
                                        }
                                }
                        }
                }

                //  TotalCount 행
                sheetThree.getRow(8 + dataCountLease).getCell(1).value =
                        'Total : ' + dataCountLease
                //  카피라이트 행
                sheetThree.getRow(9 + dataCountLease).getCell(1).value =
                        'Copyright 2023 CBRE.  All rights reserved.'

                // 데이터 열 너비 재설정
                for (let j = 1; j < leaseColumnsLength; j += 1) {
                        let dataCell = sheetThree.getRow(7).getCell(j)
                        var columnLength = dataCell.value
                                ? dataCell.value.toString().length
                                : defaultColumnWidth
                        sheetThree.getColumn(j).width =
                                columnLength < defaultColumnWidth
                                        ? defaultColumnWidth
                                        : columnLength
                }

                workbook.xlsx.writeBuffer().then((data) => {
                        // const blob = new Blob([data], {
                        // 	type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        // });
                        // const url = window.URL.createObjectURL(blob);
                        // const anchor = document.createElement('a');
                        // anchor.href = url;
                        // anchor.download = `테스트.xlsx`;
                        // anchor.click();
                        // window.URL.revokeObjectURL(url);
                        download(
                                year +
                                        month +
                                        day +
                                        '_CBRE_Transactions_Report.xlsx',
                                data,
                                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                        )
                })
        } catch (error) {
                console.error(error)
        }
}

function download(filename, data, mimeType) {
        var blob = new Blob([data], {
                type: mimeType,
        })

        if (window.cordova && window.cordova.platformId !== 'browser') {
                document.addEventListener('deviceready', function () {
                        console.log('dd')
                        var storageLocation = ''
                        storageLocation =
                                window.cordova.file.externalDataDirectory
                        //storageLocation = window.cordova.file.externalRootDirectory + 'Download/';
                        console.log('window.cordova.file:')
                        console.log(window.cordova.file)

                        // switch (device.platform) {
                        // 	case 'Android':
                        // 		storageLocation = cordova.file.externalDataDirectory;
                        // 		break;

                        // 	case 'iOS':
                        // 		storageLocation = cordova.file.documentsDirectory;
                        // 		break;
                        // }

                        var folderPath = storageLocation

                        window.resolveLocalFileSystemURL(
                                folderPath,
                                function (dir) {
                                        dir.getFile(
                                                filename,
                                                {
                                                        create: true,
                                                },
                                                function (file) {
                                                        file.createWriter(
                                                                function (
                                                                        fileWriter
                                                                ) {
                                                                        fileWriter.write(
                                                                                blob
                                                                        )
                                                                        fileWriter.onwriteend =
                                                                                function () {
                                                                                        console.log(
                                                                                                'Successful file write...'
                                                                                        )
                                                                                        const isConfirm =
                                                                                                window.confirm(
                                                                                                        '파일을 여시겠습니까?'
                                                                                                )
                                                                                        if (
                                                                                                isConfirm
                                                                                        ) {
                                                                                                //var url = file.toURL();
                                                                                                var url =
                                                                                                        file.nativeURL
                                                                                                window.cordova.plugins.fileOpener2.open(
                                                                                                        url,
                                                                                                        mimeType,
                                                                                                        {
                                                                                                                error: function error(
                                                                                                                        err
                                                                                                                ) {
                                                                                                                        console.error(
                                                                                                                                err
                                                                                                                        )
                                                                                                                        alert(
                                                                                                                                'Unable to open'
                                                                                                                        )
                                                                                                                },
                                                                                                                success: function success() {
                                                                                                                        console.log(
                                                                                                                                'success with opening the file'
                                                                                                                        )
                                                                                                                },
                                                                                                        }
                                                                                                )
                                                                                        }
                                                                                }

                                                                        fileWriter.onerror =
                                                                                function (
                                                                                        err
                                                                                ) {
                                                                                        alert(
                                                                                                'Unable to download'
                                                                                        )
                                                                                        console.error(
                                                                                                err
                                                                                        )
                                                                                }
                                                                },
                                                                function (err) {
                                                                        // failed
                                                                        alert(
                                                                                'Unable to download'
                                                                        )
                                                                        console.error(
                                                                                err
                                                                        )
                                                                }
                                                        )
                                                },
                                                function (err) {
                                                        alert(
                                                                'Unable to download'
                                                        )
                                                        console.error(err)
                                                }
                                        )
                                },
                                function (err) {
                                        alert('Unable to download')
                                        console.error(err)
                                }
                        )
                })
        } else {
                saveAs(blob, filename)
        }

        closeLoader()
}

// function showLoader() {
//         console.log("show loader");

//         let el = document.getElementById("loaderToggler");
//         el.value = 'true';
//         el.dispatchEvent(new Event('input'));
//         // loader.style.zIndex = 1000;
//         // loader.style.width = '100vw'
//         // loader.style.height = '100vh'

// }
function closeLoader() {
        console.log('close loader')
        // var loader  = document.getElementById("loaderToggler")
        // loader.value = 'false'
        let el = document.getElementById('loaderToggler')
        el.value = 'close'
        el.dispatchEvent(new Event('input'))
        // var loader  = document.getElementById("loading")
        // loader.style.zIndex = -1000;
        // loader.style.width = '0'
        // loader.style.height = '0'
}
