export enum OccurrenceTypeEnum {
  CRASH = 0,
  FIRE = 1,
  CAVE_IN = 2,
  COOP = 3,
}

export const occurrenceTypeTranslate: Record<OccurrenceTypeEnum, string> = {
  [OccurrenceTypeEnum.CRASH]: 'Batida',
  [OccurrenceTypeEnum.FIRE]: 'Incendio',
  [OccurrenceTypeEnum.CAVE_IN]: 'Desmoronamento',
  [OccurrenceTypeEnum.COOP]: 'Policia',
};
