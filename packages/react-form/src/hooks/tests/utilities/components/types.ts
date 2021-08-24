export interface Variant {
  id: string;
  optionName: string;
  optionValue: string;
  price: string;
}

export interface SimpleProduct {
  title: string;
  description: string;
  defaultVariant: Omit<Variant, 'id'>;
  variants: Variant[];
}
