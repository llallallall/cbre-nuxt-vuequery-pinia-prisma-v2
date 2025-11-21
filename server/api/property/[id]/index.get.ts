// server/api/property/[id]/index.get.ts

import { defineEventHandler, getRouterParams, createError } from 'h3';
import prisma from '@/prisma/cbredb';

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event);

  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Property ID is required' });
  }

  try {
    // 1. DB에서 전체 데이터 조회 (Include All Relations)
    const data = await prisma.property.findUnique({
      where: { id },
      include: {
        sector: true,
        subsector: true,
        location: true,
        scale: true,
        facility: true,
        accessibility: true,
        profitability: true,
        warehouse: true,
        history: true,
        propertyImageFile: true,
        propertyBrochureFile: true,
        floor: {
          include: {
            floorPartial: true,
          },
          orderBy: { floor: 'desc' } // 지상층 -> 지하층 순서 등 정렬 고려
        },
        floorPlanFile: true,
        transaction: {
          include: {
            sale: true,
            lease: true
          },
          orderBy: { execution_date: 'desc' } // 최신 거래 순
        }
      },
    });

    if (!data) {
      throw createError({ statusCode: 404, statusMessage: 'Property not found' });
    }

    // 2. Data Mapping (DB snake_case -> Client camelCase)
    // 매퍼 유틸리티 없이 여기서 직접 변환하여 반환합니다.
    return {
      id: data.id,
      name: data.name,
      sectorId: data.sector_id,
      subsectorId: data.subsector_id,
      createdAt: data.created_at,
      updatedAt: data.updated_at,

      // 1:1 Relations (null 체크 필수)
      sector: data.sector ? { id: data.sector.id, name: data.sector.name } : null,
      subsector: data.subsector ? { id: data.subsector.id, sectorId: data.subsector.sector_id, name: data.subsector.name } : null,

      location: data.location ? {
        id: data.location.id,
        propertyId: data.location.property_id,
        addressFull: data.location.address_full,
        addressFullJibun: data.location.address_full_jibun,
        addressProvince: data.location.address_province,
        addressCity: data.location.address_city,
        latitude: data.location.latitude,
        longitude: data.location.longitude,
        createdAt: data.location.created_at,
        updatedAt: data.location.updated_at,
      } : null,

      scale: data.scale ? {
        id: data.scale.id,
        propertyId: data.scale.property_id,
        noOfBuildings: data.scale.no_of_buildings,
        upperLevels: data.scale.upper_levels,
        basementLevels: data.scale.basement_levels,
        gfaSqm: data.scale.gfa_sqm,
        gfaPy: data.scale.gfa_py,
        nfaSqm: data.scale.nfa_sqm,
        nfaPy: data.scale.nfa_py,
        siteAreaSqm: data.scale.site_area_sqm,
        siteAreaPy: data.scale.site_area_py,
        grossLeasableAreaSqm: data.scale.gross_leasable_area_sqm,
        grossLeasableAreaPy: data.scale.gross_leasable_area_py,
        netLeasableAreaSqm: data.scale.net_leasable_area_sqm,
        netLeasableAreaPy: data.scale.net_leasable_area_py,
        floorAreaRatioExisting: data.scale.floor_area_ratio_existing,
        floorAreaRatioPermitted: data.scale.floor_area_ratio_permitted,
        buildingCoverageRatioExisting: data.scale.building_coverage_ratio_existing,
        buildingCoverageRatioPermitted: data.scale.building_coverage_ratio_permitted,
        floorPlateSqm: data.scale.floor_plate_sqm,
        floorPlatePy: data.scale.floor_plate_py,
        createdAt: data.scale.created_at,
        updatedAt: data.scale.updated_at,
      } : null,

      facility: data.facility ? {
        id: data.facility.id,
        propertyId: data.facility.property_id,
        elevatorsTotal: data.facility.elevators_total,
        elevatorsPassenger: data.facility.elevators_passenger,
        elevatorsService: data.facility.elevators_service,
        elevatorsFreight: data.facility.elevators_freight,
        cpsExisting: data.facility.cps_existing,
        cpsRequired: data.facility.cps_required,
        freeCpsSqm: data.facility.free_cps_sqm,
        freeCpsPy: data.facility.free_cps_py,
        paidParkingFee: data.facility.paid_parking_fee,
        roofMaterial: data.facility.roof_material,
        facade: data.facility.facade,
        mechanicalElectrical: data.facility.mechanical_electrical,
        lighting: data.facility.lighting,
        fireFighting: data.facility.fire_fighting,
        createdAt: data.facility.created_at,
        updatedAt: data.facility.updated_at,
      } : null,

      accessibility: data.accessibility ? {
        id: data.accessibility.id,
        propertyId: data.accessibility.property_id,
        distanceToIc: data.accessibility.distance_to_ic,
        timeTakenToCityHall: data.accessibility.time_taken_to_city_hall,
        timeTakenToSubway: data.accessibility.time_taken_to_subway,
        nearbyFacilities: data.accessibility.nearby_facilities,
        nearbyAttractions: data.accessibility.nearby_attractions,
        nearbyPlaces: data.accessibility.nearby_places,
        createdAt: data.accessibility.created_at,
        updatedAt: data.accessibility.updated_at,
      } : null,

      profitability: data.profitability ? {
        id: data.profitability.id,
        propertyId: data.profitability.property_id,
        grade: data.profitability.grade,
        effectiveRatio: data.profitability.effective_ratio,
        createdAt: data.profitability.created_at,
        updatedAt: data.profitability.updated_at,
      } : null,

      // 1:N Relations (Arrays)
      warehouse: data.warehouse.map(w => ({
        id: w.id,
        propertyId: w.property_id,
        temperatureType: w.temperature_type,
        ratio: w.ratio,
        createdAt: w.created_at,
        updatedAt: w.updated_at
      })),

      history: data.history.map(h => ({
        id: h.id,
        propertyId: h.property_id,
        year: h.year,
        type: h.type,
        createdAt: h.created_at,
        updatedAt: h.updated_at
      })),

      propertyImageFile: data.propertyImageFile.map(f => ({
        id: f.id,
        propertyId: f.property_id,
        main: f.main,
        fileUuid: f.file_uuid,
        fileName: f.file_name,
        fileKey: f.file_key,
        fileUrl: f.file_url,
        fileContentType: f.file_content_type,
        createdAt: f.created_at,
        updatedAt: f.updated_at
      })),

      propertyBrochureFile: data.propertyBrochureFile.map(f => ({
        id: f.id,
        propertyId: f.property_id,
        fileUuid: f.file_uuid,
        fileName: f.file_name,
        fileKey: f.file_key,
        fileUrl: f.file_url,
        fileContentType: f.file_content_type,
        createdAt: f.created_at,
        updatedAt: f.updated_at
      })),

      floorPlanFile: data.floorPlanFile.map(f => ({
        id: f.id,
        propertyId: f.property_id,
        type: f.type,
        floor: f.floor,
        fileUuid: f.file_uuid,
        fileName: f.file_name,
        fileKey: f.file_key,
        fileUrl: f.file_url,
        fileContentType: f.file_content_type,
        createdAt: f.created_at,
        updatedAt: f.updated_at
      })),

      floor: data.floor.map(f => ({
        id: f.id,
        propertyId: f.property_id,
        type: f.type,
        floor: f.floor,
        ceilingHeight: f.ceiling_height,
        ceilingHeightUnit: f.ceiling_height_unit,
        floorLoad: f.floor_load,
        floorLoadUnit: f.floor_load_unit,
        truckBerths: f.truck_berths,
        use: f.use,
        totalAreaSqm: f.total_area_sqm,
        totalAreaPy: f.total_area_py,
        grossLeasableAreaSqm: f.gross_leasable_area_sqm,
        grossLeasableAreaPy: f.gross_leasable_area_py,
        netLeasableAreaSqm: f.net_leasable_area_sqm,
        netLeasableAreaPy: f.net_leasable_area_py,
        createdAt: f.created_at,
        updatedAt: f.updated_at,
        floorPartial: f.floorPartial.map(p => ({
          id: p.id,
          floorId: p.floor_id,
          unitNumber: p.unit_number,
          tenant: p.tenant,
          leaseAreaSqm: p.lease_area_sqm,
          leaseAreaPy: p.lease_area_py,
          tenantEquipment: p.tenant_equipment,
          tenantUse: p.tenant_use,
          leaseStartDate: p.lease_start_date,
          leaseEndDate: p.lease_end_date,
          depositKrw: p.deposit_krw,
          monthlyRentPerPy: p.monthly_rent_per_py,
          monthlyRent: p.monthly_rent,
          monthlyManagementPerPy: p.monthly_management_per_py,
          monthlyManagementFee: p.monthly_management_fee,
          increaseConditionsForDeposit: p.increase_conditions_for_deposit,
          increaseConditionsForRent: p.increase_conditions_for_rent,
          increaseConditionsForManagementFee: p.increase_conditions_for_management_fee,
          rentFree: p.rent_free,
          fitOut: p.fit_out,
          createdAt: p.created_at,
          updatedAt: p.updated_at
        }))
      })),

      transaction: data.transaction.map(t => ({
        id: t.id,
        propertyId: t.property_id,
        type: t.type,
        year: t.year,
        quarter: t.quarter,
        executionDate: t.execution_date,
        createdAt: t.created_at,
        updatedAt: t.updated_at,
        sale: t.sale ? {
          id: t.sale.id,
          transactionId: t.sale.transaction_id,
          saleType: t.sale.sale_type,
          gfaSqm: t.sale.gfa_sqm,
          nfaSqm: t.sale.nfa_sqm,
          priceKrw: t.sale.price_krw,
          pricePerGfa: t.sale.price_per_gfa,
          pricePerNfa: t.sale.price_per_nfa,
          estCapRate: t.sale.est_cap_rate,
          estDiscountRate: t.sale.est_discount_rate,
          buyer: t.sale.buyer,
          seller: t.sale.seller,
          remarks: t.sale.remarks,
          createdAt: t.sale.created_at,
          updatedAt: t.sale.updated_at,
        } : null,
        lease: t.lease ? {
          id: t.lease.id,
          transactionId: t.lease.transaction_id,
          leaseType: t.lease.lease_type,
          floor: t.lease.floor,
          unit: t.lease.unit,
          leaseStartDate: t.lease.lease_start_date,
          leaseEndDate: t.lease.lease_end_date,
          gfaSqm: t.lease.gfa_sqm,
          gfaPy: t.lease.gfa_py,
          nfaSqm: t.lease.nfa_sqm,
          nfaPy: t.lease.nfa_py,
          effRatio: t.lease.eff_ratio,
          monthlyRent: t.lease.monthly_rent,
          monthlyCamf: t.lease.monthly_camf,
          deposit: t.lease.deposit,
          rentMonthlyPy: t.lease.rent_monthly_py,
          camfMonthlyPy: t.lease.camf_monthly_py,
          depositPy: t.lease.deposit_py,
          iod: t.lease.iod,
          gdm: t.lease.gdm,
          noc: t.lease.noc,
          leaseTermYear: t.lease.lease_term_year,
          rentFreeType: t.lease.rent_free_type,
          rentFreeMonth: t.lease.rent_free_month,
          effectiveNoc: t.lease.effective_noc,
          fitOut: t.lease.fit_out,
          tiAmountKrw: t.lease.ti_amount_krw,
          tiAmountNfaPy: t.lease.ti_amount_nfa_py,
          totalFreeRentPeriodMonth: t.lease.total_free_rent_period_month,
          totalOccupyingPeriodYear: t.lease.total_occupying_period_year,
          totalFreeRentOccupyingYear: t.lease.total_free_rent_occupying_year,
          monthlyCashSupportGfa: t.lease.monthly_cash_support_gfa,
          allInEffectiveRentMonthlyPy: t.lease.all_in_effective_rent_monthly_py,
          allInNoc: t.lease.all_in_noc,
          createdAt: t.lease.created_at,
          updatedAt: t.lease.updated_at,
        } : null
      }))
    };

  } catch (error) {
    console.error('Failed to fetch property details:', error);
    throw createError({ statusCode: 500, statusMessage: 'Failed to fetch property details' });
  }
});