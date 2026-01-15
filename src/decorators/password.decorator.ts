import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from 'class-validator';

export function IsPasswordMatch(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPasswordMatch',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value === relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          // Format: "fieldName: Clean message" for filter extraction
          return `${args.property}: Passwords do not match`;
        },
      },
    });
  };
}

export function IsPasswordValid(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isPasswordValid',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (typeof value !== 'string') return false;

          const minLength = value.length >= 8;
          const hasUppercase = /[A-Z]/.test(value);
          const hasNumber = /[0-9]/.test(value);
          const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
            value,
          );

          // Store failed conditions for the error message
          const errors: string[] = [];

          if (!minLength) errors.push('At least 8 characters');
          if (!hasUppercase) errors.push('At least 1 uppercase letter');
          if (!hasNumber) errors.push('At least 1 number');
          if (!hasSpecialChar) errors.push('At least 1 special character');

          (args.object as any).__passwordErrors = errors;

          return errors.length === 0;
        },
        defaultMessage(args: ValidationArguments) {
          const errors = (args.object as any).__passwordErrors || [];
          delete (args.object as any).__passwordErrors;

          // Format: "fieldName: Clean message" for filter extraction
          if (errors.length === 1) {
            return `${args.property}: Must contain ${errors[0].toLowerCase()}`;
          }

          return `${args.property}: Must contain ${errors.join(', ').toLowerCase()}`;
        },
      },
    });
  };
}
