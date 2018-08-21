export const getObjectPropertyByString = (obj, path) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};
