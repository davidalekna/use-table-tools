export const getObjectPropertyByString = (obj, path) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export const arrayHasArrays = array => {
  return array.map(item => Array.isArray(item)).includes(true);
};
