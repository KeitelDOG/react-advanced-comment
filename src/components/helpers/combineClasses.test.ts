import { combineClasses, ClassNameProps } from './combineClasses';

describe('combineClasses', () => {
  const defaultClasses: ClassNameProps = {
    class1: 'class1',
    class2: 'class2',
    class3: 'class3',
    class4: 'class4',
  };

  const customClasses: ClassNameProps = {
    class2: 'customClass2',
    class3: 'customClass3',
  };

  test('should override classes 2 and 3', () => {
    const classes = combineClasses(defaultClasses, customClasses);
    expect(classes.class1).toBe('class1');
    expect(classes.class2).toBe('customClass2');
    expect(classes.class3).toBe('customClass3');
    expect(classes.class4).toBe('class4');
  });
});