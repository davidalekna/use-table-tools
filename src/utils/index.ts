export const getObjectPropertyByString = (obj: object, path: string): any => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export const arrayHasArrays = (array: string[]) => {
  return array.map(item => Array.isArray(item)).includes(true);
};
