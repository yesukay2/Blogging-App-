import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

const forbiddenWords = ['nigger', 'nigga', 'shit', 'pussy', 'ass'];
export function profaneValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const checkForbiddenWords = forbiddenWords.some((word) =>
      control.value.toLowerCase().includes(word)
    );
    return checkForbiddenWords ? { profanity: { value: control.value } } : null;
  };
}

const specialChars = [
  '!',
  '@',
  '#',
  '$',
  '%',
  '^',
  '&',
  '*',
  '(',
  ')',
  '+',
  '=',
  '{',
  '}',
  '[',
  ']',
  '\\',
  '|',
  ';',
  ':',
  "'",
  '"',
  '<',
  '>',
  ',',
  '.',
  '?',
  '/',
  '~',
  '`',
  '_',
  '-',
];
export function specialCharValidator() {
  return (control: AbstractControl): ValidationErrors | null => {
    const checkForbiddenChars = specialChars.some((char) =>
      control.value.toLowerCase().includes(char)
    );
    return checkForbiddenChars
      ? { specialChar: { value: control.value } }
      : null;
  };
}
