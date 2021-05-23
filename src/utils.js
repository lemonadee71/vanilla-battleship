const uuid = (length = 10) => Math.random().toString(36).substr(2, length);

const $ = (query) => {
  const [idFlag, allFlag, dataAttrFlag] = ['#', '--a', '@'];

  const isId = query.includes(idFlag);
  const isAll = query.includes(allFlag);
  const isDataAttr = query.includes(dataAttrFlag);
  const isDescendantSelector = query.includes(' ');

  if (isId && !isDescendantSelector) {
    return document.getElementById(query.replace(idFlag, ''));
  }
  if (isAll) {
    return document.querySelectorAll(query.replace(allFlag, ''));
  }
  if (isDataAttr && !isDescendantSelector) {
    return document.querySelector(`[data-${query.replace(dataAttrFlag, '')}]`);
  }

  return document.querySelector(query);
};

export default $;
export { uuid };
