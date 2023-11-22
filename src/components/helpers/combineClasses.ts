export type ClassNameProps = {
  [className: string] : string
};

export function combineClasses (classes: ClassNameProps, customClasses?: ClassNameProps): ClassNameProps {
  const combined : ClassNameProps = {};
  Object.keys(classes).forEach(key => {
    if (customClasses) {
      combined[key] = customClasses[key];
    } else {
      combined[key] = classes[key];
    }
  });
  return combined;
};
