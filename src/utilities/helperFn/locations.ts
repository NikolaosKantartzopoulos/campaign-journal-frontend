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
}

export function separateLocationScales(
  locationsArray: locationAndPartOfLocationIncluded[]
): availableOptions {
  const toRet: availableOptions = {
    availableContinents: [],
    availableKingdoms: [],
    availableProvinces: [],
    availableAreas: [],
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
      default:
        throw new Error("asdf");
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

  return {
    initialContinentOptions,
    initialKingdomOptions,
    initialProvinceOptions,
    initialAreaOptions,
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
