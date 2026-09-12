export const formatScore = (value: number) => `${Math.round(value)}/100`;
export const formatPercent = (value: number) => `${Math.round(value * 100)}%`;
export const titleCase = (value: string) => value.replaceAll('-', ' ').replace(/\b\w/g, (character) => character.toUpperCase());
