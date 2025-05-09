export interface WorkingHours {
  [day: string]: string[]; 
}

export interface BlockTime {
  from: string; 
  to: string;   
  date: string; 
}

export interface AllocatedService {
  service: any;
  duration: any;
  id: number;
  service_id: number;
  service_name: string;
  service_description: string;
  price: string;
  duration_minutes: number;
}

export interface Staff {
  email: any;
  workingHours: any;
  language: any;
  phoneNumber: any;
  expertise: any;
  id: number;
  user: number;
  business: number;
  business_name: string;
  name: string;
  bio: string;
  working_hours: WorkingHours;
  holidays: string[]; 
  block_times: BlockTime[];
  max_appointments_per_day: number;
  allocated_services: AllocatedService[];
}
