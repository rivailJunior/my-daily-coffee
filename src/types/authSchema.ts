import { object, string } from 'zod';

export const loginSchema = object({
  email: string({ required_error: 'E-mail obrigatorio' })
    .min(1, 'E-mail obrigatorio')
    .email('E-mail invalido'),
  password: string({ required_error: 'Senha obrigatoria' })
    .min(1, 'Senha obrigatoria')
    .min(8, 'Senha deve conter pelo menos 8 caracteres')
    .max(32, 'Senha deve conter menos de 32 caracteres'),
});


export const signupSchema = object({
  name: string({ required_error: 'Nome obrigatorio' })
    .min(1, 'Nome obrigatorio')
    .max(32, 'Nome deve conter menos de 32 caracteres'),
  email: string({ required_error: 'E-mail obrigatorio' })
    .min(1, 'E-mail obrigatorio')
    .email('E-mail invalido'),
  password: string({ required_error: 'Password is required' })
    .min(1, 'Senha obrigatoria')
    .min(8, 'Senha deve ter pelo menos 8 caracteres')
    .max(32, 'Senha deve conter menos de 32 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\W]{8,}$/,
      'Senha deve conter um número, uma letra maiúscula, uma letra minúscula e um caractere especial'
    ),
  confirmPassword: string({
    required_error: 'Confirm password is required',
  }).min(1, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Senhas nao correspondem',
  path: ['confirmPassword'],
});

export const confirmSignupSchema = object({
  email: string({ required_error: 'E-mail obrigatorio' })
    .min(1, 'E-mail obrigatorio')
    .email('E-mail invalido'),
  code: string({ required_error: 'Codigo de confirmacao obrigatorio' })
    .min(1, 'Codigo de confirmacao obrigatorio')
    .max(6, 'Codigo de confirmacao deve conter 6 digitos'),
});