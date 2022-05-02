import {defaultTypeFormater} from './utilities/formatters';
import {
  formatValidator,
  lengthValidator,
  presenceValidator,
} from './utilities/validators';
import {FormContext} from './types';

export const frameworkValidators: FormContext['validators'] = {
  Presence: presenceValidator,
  Format: formatValidator,
  Length: lengthValidator,
};

export const frameworkFormatters: FormContext['formatters'] = {
  remote: defaultTypeFormater,
  local: defaultTypeFormater,
};
