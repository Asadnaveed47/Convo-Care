import { Component, OnInit, runInInjectionContext, inject, Injector } from '@angular/core';
import { BookingFormComponent } from "./booking-form/booking-form.component";
import { CommonModule } from '@angular/common';
import { ColumnRotatedComponent } from "../../shared/column-rotated/column-rotated.component";
import { PieChartComponent } from "../../shared/pie-chart/pie-chart.component";
import { ApiserviceService } from '../../services/apiservice/apiservice.service';
import { environment } from '../../../environments/environment';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Component({
    selector: 'app-dashboard',
    imports: [BookingFormComponent, CommonModule, ColumnRotatedComponent, PieChartComponent],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css',
    standalone: true,
})
export class DashboardComponent implements OnInit {

    showModal = false;
    cardDataMap: any = {};
    graphData: any[] = [];
    servicesBookedData: any[] = [];
    patientInsightsData: any;
    appointmentData: any[] = [];

    private injector = inject(Injector);

    constructor(
        private apiService: ApiserviceService,
        private fdb: AngularFireDatabase,
    ) { }

    ngOnInit() {
        this.getCards();
        this.getgraphs();
        this.getFirebaseData();
    }

    getCards() {
        const url = `${environment.baseUrl}/api/v1/analytics/cards?dashboard_id=MD&business_id=5`;
        this.apiService.get(url).subscribe(response => {
            if (response.status === 1000) {
                this.cardDataMap = response.data.reduce((acc: any, item: any) => {
                    acc[item.code] = item.data;
                    return acc;
                }, {});
            }
        });
    }

    getgraphs() {
        const url = `${environment.baseUrl}/api/v1/analytics/graphs?dashboard_id=MD&business_id=5`;
        this.apiService.get(url).subscribe(response => {
            if (response.status === 1000) {
                const servicesBooked = response.data.find((item: { code: string; data: any }) => item.code === 'SB');
                const patientInsights = response.data.find((item: { code: string; data: any }) => item.code === 'PI');

                this.servicesBookedData = servicesBooked?.data || [];
                this.patientInsightsData = patientInsights?.data || {};
                console.log("patientInsightsData", this.patientInsightsData);

            }
        });
    }


    addBooking() {
        this.showModal = true;
        console.log('Add Booking button clicked');

    }

    closeModal() {
        this.showModal = false;
    }

    handleBookingAdded(newStaff: any) {
        console.log('New Booking added:', newStaff);
    }

    getFirebaseData() {
        runInInjectionContext(this.injector, () => {
            this.fdb.object(`Upcoming-Appointments/5`).valueChanges().subscribe((item) => {
                this.appointmentData = item as any[] || [];
            });
        });
    }
}
