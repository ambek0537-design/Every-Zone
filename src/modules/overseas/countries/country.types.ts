export interface DestinationCountry {
  id: string;
  name: string;
  flag: string;
  region: "Gulf" | "Europe" | "Asia" | "Other";
  activeJobsCount: number;
}
