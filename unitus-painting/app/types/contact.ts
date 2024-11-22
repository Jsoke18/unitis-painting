// app/types/contact.ts
export interface ContactContent {
  pageTitle: string;
  pageDescription: string;
  openingHours: string;
  contactInfo: {
    phone: {
      title: string;
      number: string;
    };
    headOffice: {
      title: string;
      companyName: string;
      poBox: string;
      line1: string;
      line2: string;
    };
    calgaryOffice: {
      title: string;
      companyName: string;
      poBox: string;
      line1: string;
      line2: string;
    };
  };
  formFields: Array<{
    name: string;
    label: string;
    type: string;
    placeholder: string;
    validation: {
      required: boolean;
      minLength?: number;
      pattern?: string;
      errorMessage: string;
    };
  }>;
}