import { PHONE_REGEX } from '@/constants/regex';
import { TFunction } from 'i18next';
import { z } from 'zod';

export const createCheckoutSchema = (t: TFunction) => {
  return z.object({
    name: z.string().nonempty(t('error.required_field')),
    phone: z
      .string()
      .nonempty(t('error.required_field'))
      .regex(PHONE_REGEX, t('error.invalid_phone')),
    email: z.email(t('error.invalid_email')),
    // emailConfirm: z.email(t('error.invalid_email')).nonempty(t('error.required_field')),
    deviceCompatibility: z.boolean(),
    saveInfo: z.boolean(),
    receipt: z.boolean(),
    paymentMethod: z.enum(['wallet', 'mobile', 'atm', 'qr'], {
      message: t('error.required_field'),
    }),
    discountCode: z.string().optional(),
    termAndCondition: z.boolean(),
    shareInfoAgreement: z.boolean(),
  });
  // .refine((value) => value.email === value.emailConfirm, {
  //   message: t('error.email_mismatch'),
  //   path: ['emailConfirm'],
  // });
};

export type CheckoutForm = z.infer<ReturnType<typeof createCheckoutSchema>>;
