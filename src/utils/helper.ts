export const makeHitSlop = (val: number) => ({
  top: val,
  bottom: val,
  left: val,
  right: val,
});

export const delay = (value: number) => {
  return new Promise<void>(resolve => {
    const t = setTimeout(() => {
      clearTimeout(t);
      resolve();
    }, value);
  });
};

export const isEmptyObj = (object: any) => {
  return Object.keys(object).length === 0 && object.constructor === Object;
};
