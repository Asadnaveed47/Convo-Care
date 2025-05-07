import { Staff } from "./staff";

export interface Staffapiresponse {
    status: number;
    message: string;
    data: Staff[];
}
