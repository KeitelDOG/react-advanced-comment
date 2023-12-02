// In CSS Module, classes are converted into hash string like:
// textCounter: "qzVsRgNWnUxHenj9rjbn"
// textProgress: "OpP6MkW7uJLx8aYZdkyZ"
export type ClassNameProps = {
  [className: string] : string
};

export function combineClasses (classes: ClassNameProps, customClasses?: ClassNameProps): ClassNameProps {
  const combined : ClassNameProps = {};
  // keep the track only on the default classes, as it is the one who is used in code.
  Object.keys(classes).forEach(key => {
    if (customClasses && customClasses[key]) {
      combined[key] = customClasses[key];
    } else {
      combined[key] = classes[key];
    }
  });
  return combined;
};
