export type JobCategory =
  | "Construction"
  | "Factory"
  | "Hotel"
  | "Restaurant"
  | "Driver"
  | "Cleaner"
  | "Nurse"
  | "Caregiver"
  | "Engineer"
  | "Electrician"
  | "Welder"
  | "Mechanic"
  | "Security"
  | "Agriculture"
  | "Warehouse"
  | "Office Jobs"
  | "Domestic Work"
  | "IT"
  | "Sales"
  | "Other";

export interface Job {
  id: string;
  agencyId: string;
  agencyName: string;
  agencyLogo?: string;
  agencyLicense: string;
  isAgencyVerified: boolean;
  country: string;
  countryFlag?: string;
  city: string;
  category: JobCategory;
  title: string;
  titleAm?: string;
  employer: string;
  salary: string; // e.g. "4,500 AED/mo"
  salaryNum: number;
  contractDuration: string; // e.g. "2 Years"
  accommodation: "Included" | "Not Included" | "Allowance Provided";
  foodIncluded: boolean;
  medicalInsurance: boolean;
  transportationIncluded: boolean;
  workingHours: string; // e.g. "8 hrs/day"
  deadline: string;
  requirements: {
    ageLimit?: string;
    gender?: "Male" | "Female" | "Any";
    education?: string;
    experience?: string;
    language?: string;
  };
  benefits?: string[];
  description: string;
  descriptionAm?: string;
  photos?: string[];
  status: "ACTIVE" | "SUSPENDED" | "EXPIRED" | "DRAFT";
  createdAt: string;
}
