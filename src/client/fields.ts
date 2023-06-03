import {
  createTextField,
  createUrlField,
  createNumberField,
  createAvatarField
} from 'tushan';

export const userFields = [
  createTextField('_id', { label: 'ID' }),
  createTextField('username', { label: 'Username', list: { sort: true } }),
  createTextField('password', { label: 'Password' }),
  createNumberField('balance', { label: 'Balance' }),
  createTextField('openaiKey', { label: 'OpenAI Key' }),
  createTextField('createTime', { label: 'Create Time' }),
  createNumberField('__v', { label: 'Version' }),
  createAvatarField('avatar', { label: 'Avatar' }),
];

