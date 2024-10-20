export enum OccurrenceTypeEnum {
  CRASH = 0,
  FIRE = 1,
  CAVE_IN = 2,
  WINDS = 3,
  SHOOTING = 4
}

export const occurrenceTypeTranslate: Record<OccurrenceTypeEnum, string> = {
  [OccurrenceTypeEnum.CRASH]: 'Batida',
  [OccurrenceTypeEnum.FIRE]: 'Incendio',
  [OccurrenceTypeEnum.CAVE_IN]: 'Desmoronamento',
  [OccurrenceTypeEnum.WINDS]: 'Vento forte',
  [OccurrenceTypeEnum.SHOOTING]: 'Tiroteio',
};
