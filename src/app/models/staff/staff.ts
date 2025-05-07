export interface Staff {
    id: number;
    user: number;
    business: number;
    name: string;
    phone_number: string;
    bio: string;
    expertise: number[];
    working_hours: {
      [day: string]: string[]; 
    };
    holidays: string[];
    created_at: string;
  }
  