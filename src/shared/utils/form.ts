import { type SelectOption } from '../components/form/select-field';

export const toSelectOptions = <T, L extends keyof T, V extends keyof T>(
  items: T[],
  labelKey: L,
  valueKey: V
): SelectOption[] => {
  return items.map((item) => ({
    label: String(item[labelKey]),
    value: String(item[valueKey]),
  }));
};
