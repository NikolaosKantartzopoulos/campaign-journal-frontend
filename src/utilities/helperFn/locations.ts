import { locationAndPartOfLocationIncluded } from "@/clients/Locations/locationsClient";

export interface locationFilterState extends locationAndPartOfLocationIncluded {
  isVisible: boolean;
  isSelected: boolean;
}

export interface availableOptions {
  availableContinents: locationFilterState[];
  availableKingdoms: locationFilterState[];
  availableProvinces: locationFilterState[];
  availableAreas: locationFilterState[];
  availablePlaces: locationFilterState[];
}

export function separateLocationScales(
  locationsArray: locationAndPartOfLocationIncluded[]
): availableOptions {
  const toRet: availableOptions = {
    availableContinents: [],
    availableKingdoms: [],
    availableProvinces: [],
    availableAreas: [],
    availablePlaces: [],
  };
  for (const el of locationsArray) {
    const newEl = { ...el, isSelected: true, isVisible: true };

    switch (el.location_scale) {
      case "Continent":
        toRet.availableContinents.push(newEl);
        break;
      case "Kingdom":
        toRet.availableKingdoms.push(newEl);
        break;
      case "Province":
        toRet.availableProvinces.push(newEl);
        break;
      case "Area":
        toRet.availableAreas.push(newEl);
        break;
      case "Place":
        toRet.availablePlaces.push(newEl);
        break;
      default:
        throw new Error("[helperFn]: separateLocationScales");
    }
  }
  return toRet;
}

export function getInitialOptions(availableOptions: availableOptions) {
  const initialContinentOptions = {
    viewAll: true,
    selected: availableOptions?.availableContinents,
  } || {
    viewAll: true,
    selected: [],
  };
  const initialKingdomOptions = {
    viewAll: true,
    selected: availableOptions?.availableKingdoms,
  } || {
    viewAll: true,
    selected: [],
  };
  const initialProvinceOptions = {
    viewAll: true,
    selected: availableOptions?.availableProvinces,
  } || {
    viewAll: true,
    selected: [],
  };
  const initialAreaOptions = {
    viewAll: true,
    selected: availableOptions?.availableAreas,
  } || {
    viewAll: true,
    selected: [],
  };
  const initialPlaceOptions = {
    viewAll: true,
    selected: availableOptions?.availablePlaces,
  } || {
    viewAll: true,
    selected: [],
  };

  return {
    initialContinentOptions,
    initialKingdomOptions,
    initialProvinceOptions,
    initialAreaOptions,
    initialPlaceOptions,
  };
}

export function getSelectedLocations(arr: locationFilterState[]) {
  return arr.filter((el) => el.isSelected);
}

export function getVisibleLocations(arr: locationFilterState[]) {
  return arr.filter((el) => el.isVisible);
}

export function createNewLocationState(
  parentLocation: locationFilterState[],
  oldState: locationFilterState[]
) {
  const parentLocationIds = parentLocation.map((el) => el.location_id);
  console.log(parentLocation);
  const newState = oldState.map((k) =>
    parentLocationIds.includes(k.part_of as number)
      ? { ...k, isSelected: false, isVisible: true }
      : { ...k, isSelected: false, isVisible: false }
  );
  console.log(newState);
  return newState;
}

export function separateLocationsBySize<
  T extends { location_scale: string | null }
>(locationsArray: T[]) {
  const toRet: {
    availableContinents: T[];
    availableKingdoms: T[];
    availableProvinces: T[];
    availableAreas: T[];
    availablePlaces: T[];
  } = {
    availableContinents: [],
    availableKingdoms: [],
    availableProvinces: [],
    availableAreas: [],
    availablePlaces: [],
  };
  for (const el of locationsArray) {
    switch (el.location_scale) {
      case "Continent":
        toRet.availableContinents.push(el);
        break;
      case "Kingdom":
        toRet.availableKingdoms.push(el);
        break;
      case "Province":
        toRet.availableProvinces.push(el);
        break;
      case "Area":
        toRet.availableAreas.push(el);
        break;
      case "Place":
        toRet.availablePlaces.push(el);
        break;
      default:
        throw new Error("[helperFn]: separateLocationScales");
    }
  }
  return toRet;
}
