import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { JobService } from '../../../../services/job.service';
import { MatDialogRef } from '@angular/material/dialog';
import { TitleService } from '../../../../services/title.service';
import { MatRadioModule } from '@angular/material/radio';
import { GenderService } from '../../../../services/gender.service';
import { NationalityService } from '../../../../services/nationality.service';
import { BeneficiaryTypeService } from '../../../../services/beneficiary-type.service';
import { CourtRoomService } from '../../../../services/court-room.service';
import { CourtTypeService } from '../../../../services/court-type.service';
import { CaseTypeService } from '../../../../services/case-type.service';
import { EmployerTypeService } from '../../../../services/employer-type.service';
import { EmploymentStatusService } from '../../../../services/employment-status.service';
import { MaritalStatusService } from '../../../../services/marital-status.service';
import { LanguageService } from '../../../../services/language.service';
import { PartyService } from '../../../../services/party.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { LanguageModel } from '../../../../models/language-model';
import { TitleModel } from '../../../../models/title-model';
import { GenderModel } from '../../../../models/gender-model';
import { MartialStatusModel } from '../../../../models/martial-status-model';
import { JobModel } from '../../../../models/job-model';
import { EmployerTypeModel } from '../../../../models/employer-type-model';
import { CaseTypeModel } from '../../../../models/case-type-model';
import { CourtTypeModel } from '../../../../models/court-type-model';
import { CourtRoomModel } from '../../../../models/court-room-model';
import { PartyModel } from '../../../../models/party-model';
import { BeneficiaryTypeModel } from '../../../../models/beneficiary-type-model';
import { NationalityModel } from '../../../../models/nationality-model';
import { IdTypeService } from '../../../../services/id-type.service';
import { ApplicantModel } from '../../../../models/applicant-model';
import { CaseModel } from '../../../../models/case-model';
import { WorkModel } from '../../../../models/work-model';
import { SpouseModel } from '../../../../models/spouse-model';
import { RepresentativeModel } from '../../../../models/representative-model';
import { EmploymentStatusModel } from '../../../../models/employment-status-model';
import { ApplicationService } from '../../../../services/application.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { IdTypeModel } from '../../../../models/id-type-model';
import { OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-application-form',
  standalone: true,
  imports: [
    CommonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatNativeDateModule,
    MatExpansionModule,
    MatSelectModule,
    MatRadioModule,
    MatDatepickerModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
  ],
  templateUrl: './application-form.component.html',
  styleUrl: './application-form.component.scss',
  providers: [provideNativeDateAdapter()],
  // providers: [
  //   { provide: DateAdapter, useClass: NativeDateAdapter },
  //   { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  //   { provide: MAT_DATE_LOCALE, useValue: "en-GB" }, // or 'en-US', etc.
  //   MatNativeDateModule,
  // ],
})
export class ApplicationFormComponent implements OnInit, OnDestroy {
  [x: string]: any;
  constructor(private dialogRef: MatDialogRef<ApplicationFormComponent>) {}
  private titleService = inject(TitleService);
  private jobService = inject(JobService);
  private idtypeService = inject(IdTypeService);
  private nationalityService = inject(NationalityService);
  private beneficiarytypeService = inject(BeneficiaryTypeService);
  private courtroomService = inject(CourtRoomService);
  private courttypeService = inject(CourtTypeService);
  private casetypeService = inject(CaseTypeService);
  private genderService = inject(GenderService);
  private employertypeService = inject(EmployerTypeService);
  private employmentstatusService = inject(EmploymentStatusService);
  private maritalstatusService = inject(MaritalStatusService);
  private languageService = inject(LanguageService);
  private partyService = inject(PartyService);
  private appService = inject(ApplicationService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private destroy$ = new Subject<void>();
  isLinear = true;
  loading = false;
  maxDate?: Date;
  ageInYears: number | null = null;
  formatDate(date: Date): string {
    return new Date(date).toISOString().split('T')[0]; // "YYYY-MM-DD"
  }

  onAgeInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = Number(input.value);

    if (value > 17) {
      input.value = '17';
      this['repAgeCtrl']?.setValue(17);
    } else if (value < 0) {
      input.value = '0';
      this['repAgeCtrl']?.setValue(0);
    }
  }

  // Reactive form group
  detailsFormGroup = this.fb.group({
    firstnameCtrl: ['', Validators.required],
    lastnameCtrl: ['', Validators.required],
    middlenameCtrl: [''],
    titleCtrl: [null as TitleModel | null, Validators.required],
    genderCtrl: [null as GenderModel | null, Validators.required],
    nationalityCtrl: [null as NationalityModel | null, Validators.required],
    idTypeCtrl: [null as IdTypeModel | null, Validators.required],
    idCtrl: ['', Validators.required],
    // dobCtrl: ['', Validators.required],
    dobCtrl: [null as Date | null, Validators.required],
    languageCtrl: [null as LanguageModel | null, Validators.required],
    // optional
    hasChildrenCtrl: ['', Validators.required],
    childCtrl: [{ value: '', disabled: true }],
    //
    addressCtrl: ['', Validators.required],
    periodofstayCtrl: ['', Validators.required],
    phonenumberCtrl: [
      '',
      [Validators.required, Validators.pattern(/^\d{10}$/)],
    ],
    emailCtrl: ['', [Validators.required, Validators.email]],
    // optional
    maritalstatusCtrl: [null as MartialStatusModel | null, Validators.required],
    spouseGenderCtrl: [{ value: null as GenderModel | null, disabled: true }],
    spouseFirstNameCtrl: [{ value: '', disabled: true }],
    spouseLastNameCtrl: [{ value: '', disabled: true }],
    spouseAddressCtrl: [{ value: '', disabled: true }],
    // spousePhoneNumberCtrl: [{ value: '', disabled: true }],
    spousePhoneNumberCtrl: [
      { value: '', disabled: true },
      [Validators.required, Validators.pattern(/^\d{10}$/)],
    ],
    spouseJobCtrl: [{ value: null as JobModel | null, disabled: true }],
    spouseIncomeCtrl: [{ value: '', disabled: true }],
    //
    // optional
    hasRepCtrl: ['', Validators.required],
    repFirstNameCtrl: [{ value: '', disabled: true }],
    repLastNameCtrl: [{ value: '', disabled: true }],
    repAgeCtrl: [
      { value: '', disabled: true },
      [Validators.min(0), Validators.max(17)],
    ],
    repGenderCtrl: [{ value: null as GenderModel | null, disabled: true }],
    reasonCtrl: [{ value: '', disabled: true }],
    //
  });

  workFormGroup = this.fb.group({
    // optional
    // isEmployedCtrl: ['', Validators.required],
    employmentstatusCtrl: [
      null as EmploymentStatusModel | null,
      Validators.required,
    ],
    jobCtrl: [{ value: null as JobModel | null, disabled: true }],
    qualificationCtrl: [{ value: '', disabled: true }],
    workingperiodCtrl: [{ value: '', disabled: true }],
    incomeCtrl: [{ value: '', disabled: true }],
    employertypeCtrl: [
      { value: null as EmployerTypeModel | null, disabled: true },
    ],
    employernameCtrl: [{ value: '', disabled: true }],
    employeraddressCtrl: [{ value: '', disabled: true }],
    //
    // optional
    anyAssetCtrl: ['', Validators.required],
    assetCtrl: [{ value: '', disabled: true }],
    //
  });

  caseFormGroup = this.fb.group({
    caseTypeCtrl: [null as CaseTypeModel | null, Validators.required],
    mainChargeCtrl: ['', Validators.required],
    // optional
    inCourtCtrl: ['', Validators.required],
    courtTypeCtrl: [{ value: null as CourtTypeModel | null, disabled: true }],
    courtRoomCtrl: [{ value: null as CourtRoomModel | null, disabled: true }],
    suitNoCtrl: [{ value: '', disabled: true }],
    caseDurationCtrl: [{ value: '', disabled: true }],
    //
    caseRelationCtrl: [null as PartyModel | null, Validators.required],
    // optional
    beneficiaryCtrl: ['', Validators.required],
    beneficiaryTypeCtrl: [
      { value: null as BeneficiaryTypeModel | null, disabled: true },
    ],
    numOfTimesCtrl: [{ value: '', disabled: true }],
    prevCaseNumCtrl: [{ value: '', disabled: true }],
    //
    oppPartyCtrl: [null as PartyModel | null, Validators.required],
    oppGenderCtrl: [null as GenderModel | null, Validators.required],
    oppFirstNameCtrl: ['', Validators.required],
    oppLastNameCtrl: ['', Validators.required],
    oppAddyCtrl: ['', Validators.required],
    oppContactCtrl: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    caseSummCtrl: ['', Validators.required],
  });

  goToNextStep(formGroup: FormGroup, stepper: MatStepper): void {
    // Mark all fields as touched to show validation errors
    formGroup.markAllAsTouched();

    // Re-run validations
    formGroup.updateValueAndValidity({ onlySelf: false, emitEvent: true });

    // If form is valid, move to next step
    if (formGroup.valid) {
      stepper.next();
    }
  }

  buildCaseModel(): CaseModel {
    return {
      case_type_id: this.caseFormGroup.value.caseTypeCtrl?.id!,
      main_charge: this.caseFormGroup.value.mainChargeCtrl!,
      suit_no: this.caseFormGroup.value.suitNoCtrl!,
      court_room_id: this.caseFormGroup.value.courtRoomCtrl?.id!,
      case_pending_duration: this.caseFormGroup.value.caseDurationCtrl!,
      beneficiary_type_id: this.caseFormGroup.value.beneficiaryTypeCtrl?.id!,
      number_of_times: Number(this.caseFormGroup.value.numOfTimesCtrl!),
      previous_case_number: this.caseFormGroup.value.prevCaseNumCtrl!,
      case_relation_id: this.caseFormGroup.value.caseRelationCtrl?.id!,
      case_summary: this.caseFormGroup.value.caseSummCtrl!,
      opponent: {
        first_name: this.caseFormGroup.value.oppFirstNameCtrl!,
        last_name: this.caseFormGroup.value.oppLastNameCtrl!,
        gender: this.caseFormGroup.value.oppGenderCtrl?.id!,
        address: this.caseFormGroup.value.oppAddyCtrl!,
        contact: this.caseFormGroup.value.oppContactCtrl!,
        party: this.caseFormGroup.value.oppPartyCtrl?.id!,
      },
    };
  }

  buildWorkModel(): WorkModel {
    return {
      job: this.workFormGroup.value.jobCtrl?.id!,
      qualification: this.workFormGroup.value.qualificationCtrl!,
      working_period: this.workFormGroup.value.workingperiodCtrl!,
      employer: this.workFormGroup.value.employernameCtrl!,
      employer_type: this.workFormGroup.value.employertypeCtrl?.id!,
      employer_address: this.workFormGroup.value.employeraddressCtrl!,
      monthly_income: Number(this.workFormGroup.value.incomeCtrl!),
      asset: this.workFormGroup.value.assetCtrl!,
    };
  }

  buildSpouseModel(): SpouseModel {
    return {
      first_name: this.detailsFormGroup.value.spouseFirstNameCtrl!,
      last_name: this.detailsFormGroup.value.spouseLastNameCtrl!,
      gender: this.detailsFormGroup.value.spouseGenderCtrl?.id!,
      address: this.detailsFormGroup.value.spouseAddressCtrl!,
      contact: this.detailsFormGroup.value.spousePhoneNumberCtrl!,
      job: this.detailsFormGroup.value.spouseJobCtrl?.id!,
      income: Number(this.detailsFormGroup.value.spouseIncomeCtrl!),
    };
  }

  buildRepModel(): RepresentativeModel {
    return {
      first_name: this.detailsFormGroup.value.repFirstNameCtrl!,
      last_name: this.detailsFormGroup.value.repLastNameCtrl!,
      gender: this.detailsFormGroup.value.repGenderCtrl?.id!,
      age: Number(this.detailsFormGroup.value.repAgeCtrl!),
      reason: this.detailsFormGroup.value.reasonCtrl!,
    };
  }

  // Signal from service
  titles = this.titleService.titles;
  jobs = this.jobService.jobs;
  idtypes = this.idtypeService.idtypes;
  nationalities = this.nationalityService.nationalities;
  employertypes = this.employertypeService.employertypes;
  employmentstatus = this.employmentstatusService.employmentstatus;
  courttypes = this.courttypeService.courttypes;
  courtrooms = this.courtroomService.courtrooms;
  gendertypes = this.genderService.genders;
  languages = this.languageService.languages;
  parties = this.partyService.parties;
  maritalstatus = this.maritalstatusService.maritalstatus;
  beneficiarytypes = this.beneficiarytypeService.beneficiarytypes;
  casetypes = this.casetypeService.casetypes;

  ngOnInit() {
    this.titleService.loadTitles();
    this.jobService.loadJobs();
    this.idtypeService.loadIdTypes();
    this.nationalityService.loadNationalities();
    this.employertypeService.loadEmployerTypes();
    this.employmentstatusService.loadEmploymentStatus();
    this.courttypeService.loadCourtTypes();
    this.courtroomService.loadCourtRooms();
    this.genderService.loadGenders();
    this.languageService.loadLanguages();
    this.partyService.loadParties();
    this.maritalstatusService.loadmaritalStatus();
    this.beneficiarytypeService.loadBeneficiaryTypes();
    this.casetypeService.loadCaseTypes();

    const hasChildrenCtrl = this.detailsFormGroup.get('hasChildrenCtrl');
    const childCtrl = this.detailsFormGroup.get('childCtrl');
    hasChildrenCtrl?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value === '1') {
          childCtrl?.enable();
          childCtrl?.setValidators([Validators.required]);
        } else {
          childCtrl?.reset();
          childCtrl?.clearValidators();
          childCtrl?.disable();
        }
        childCtrl?.updateValueAndValidity();
      });

    const anyAssetCtrl = this.workFormGroup.get('anyAssetCtrl');
    const assetCtrl = this.workFormGroup.get('assetCtrl');
    anyAssetCtrl?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value === '1') {
          assetCtrl?.enable();
          assetCtrl?.setValidators([Validators.required]);
        } else {
          assetCtrl?.reset();
          assetCtrl?.clearValidators();
          assetCtrl?.disable();
        }
        assetCtrl?.updateValueAndValidity();
      });

    const employmentstatusCtrl = this.workFormGroup.get('employmentstatusCtrl');
    employmentstatusCtrl?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((selected: EmploymentStatusModel | null) => {
        const fieldsToToggle = [
          'jobCtrl',
          'qualificationCtrl',
          'workingperiodCtrl',
          'incomeCtrl',
          'employertypeCtrl',
          'employernameCtrl',
          'employeraddressCtrl',
        ];

        if (selected && selected.name.toLowerCase() === 'employed') {
          fieldsToToggle.forEach((field) => {
            const ctrl = this.workFormGroup.get(field);
            ctrl?.enable();
            ctrl?.setValidators([Validators.required]);
            ctrl?.updateValueAndValidity();
          });
        } else {
          fieldsToToggle.forEach((field) => {
            const ctrl = this.workFormGroup.get(field);
            ctrl?.reset();
            ctrl?.clearValidators();
            ctrl?.disable();
            ctrl?.updateValueAndValidity();
          });
        }
      });

    const hasRepCtrl = this.detailsFormGroup.get('hasRepCtrl');
    hasRepCtrl?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        const fieldsToToggle = [
          'repFirstNameCtrl',
          'repLastNameCtrl',
          'repAgeCtrl',
          'repGenderCtrl',
          'reasonCtrl',
        ];

        if (value === '1') {
          fieldsToToggle.forEach((field) => {
            const ctrl = this.detailsFormGroup.get(field);
            ctrl?.enable();
            ctrl?.setValidators([Validators.required]);
            ctrl?.updateValueAndValidity();
          });
        } else {
          fieldsToToggle.forEach((field) => {
            const ctrl = this.detailsFormGroup.get(field);
            ctrl?.reset();
            ctrl?.clearValidators();
            ctrl?.disable();
            ctrl?.updateValueAndValidity();
          });
        }
      });

    const maritalstatusCtrl = this.detailsFormGroup.get('maritalstatusCtrl');
    maritalstatusCtrl?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((selected: MartialStatusModel | null) => {
        const fieldsToToggle = [
          'spouseFirstNameCtrl',
          'spouseLastNameCtrl',
          'spouseGenderCtrl',
          'spouseAddressCtrl',
          'spousePhoneNumberCtrl',
          'spouseJobCtrl',
          'spouseIncomeCtrl',
        ];

        if (selected && selected.name.toLowerCase() === 'married') {
          fieldsToToggle.forEach((field) => {
            const ctrl = this.detailsFormGroup.get(field);
            ctrl?.enable();
            ctrl?.setValidators([Validators.required]);
            ctrl?.updateValueAndValidity();
          });
        } else {
          fieldsToToggle.forEach((field) => {
            const ctrl = this.detailsFormGroup.get(field);
            ctrl?.reset();
            ctrl?.clearValidators();
            ctrl?.disable();
            ctrl?.updateValueAndValidity();
          });
        }
      });

    const beneficiaryCtrl = this.caseFormGroup.get('beneficiaryCtrl');
    beneficiaryCtrl?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        const fieldsToToggle = [
          'beneficiaryTypeCtrl',
          'numOfTimesCtrl',
          'prevCaseNumCtrl',
        ];

        if (value === '1') {
          fieldsToToggle.forEach((field) => {
            const ctrl = this.caseFormGroup.get(field);
            ctrl?.enable();
            ctrl?.setValidators([Validators.required]);
            ctrl?.updateValueAndValidity();
          });
        } else {
          fieldsToToggle.forEach((field) => {
            const ctrl = this.caseFormGroup.get(field);
            ctrl?.reset();
            ctrl?.clearValidators();
            ctrl?.disable();
            ctrl?.updateValueAndValidity();
          });
        }
      });

    const inCourtCtrl = this.caseFormGroup.get('inCourtCtrl');
    inCourtCtrl?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        const fieldsToToggle = [
          'suitNoCtrl',
          'courtTypeCtrl',
          'courtRoomCtrl',
          'caseDurationCtrl',
        ];

        if (value === '1') {
          fieldsToToggle.forEach((field) => {
            const ctrl = this.caseFormGroup.get(field);
            ctrl?.enable();
            ctrl?.setValidators([Validators.required]);
            ctrl?.updateValueAndValidity();
          });
        } else {
          fieldsToToggle.forEach((field) => {
            const ctrl = this.caseFormGroup.get(field);
            ctrl?.reset();
            ctrl?.clearValidators();
            ctrl?.disable();
            ctrl?.updateValueAndValidity();
          });
        }
      });

    this.caseFormGroup
      .get('courtTypeCtrl')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((selected: any) => {
        const courtRoomCtrl = this.caseFormGroup.get('courtRoomCtrl');

        // Always clear courtroom selection
        courtRoomCtrl?.reset();
        this.courtroomService.courtrooms.set([]);

        if (selected && selected.id !== undefined) {
          this.courtroomService.loadCourtRoomsByCourtType(selected.id);
        }
      });

    const today = new Date();
    this.maxDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );

    this.detailsFormGroup
      .get('dobCtrl')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((dob: Date | null) => {
        if (dob) {
          const today = new Date();
          let age = today.getFullYear() - dob.getFullYear();

          const hasBirthdayPassedThisYear =
            today.getMonth() > dob.getMonth() ||
            (today.getMonth() === dob.getMonth() &&
              today.getDate() >= dob.getDate());

          if (!hasBirthdayPassedThisYear) {
            age--;
          }

          this.ageInYears = age;
          console.log('Age in years:', age);
        } else {
          this.ageInYears = null;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cancel(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if (
      this.detailsFormGroup.invalid ||
      this.workFormGroup.invalid ||
      this.caseFormGroup.invalid
    )
      return;

    const caseModel = this.buildCaseModel();
    const workModel = this.buildWorkModel();
    const spouseModel = this.buildSpouseModel();
    const repModel = this.buildRepModel();

    const appData: ApplicantModel = {
      first_name: this.detailsFormGroup.value.firstnameCtrl!,
      last_name: this.detailsFormGroup.value.lastnameCtrl!,
      title_id: this.detailsFormGroup.value.titleCtrl!.id!,
      middle_name: this.detailsFormGroup.value.middlenameCtrl!,
      gender_id: this.detailsFormGroup.value.genderCtrl!.id!,
      dob: this.formatDate(new Date(this.detailsFormGroup.value.dobCtrl!)),
      age: Number(this.ageInYears),
      email: this.detailsFormGroup.value.emailCtrl!,
      address: this.detailsFormGroup.value.addressCtrl!,
      period_of_stay: this.detailsFormGroup.value.periodofstayCtrl!,
      nationality_id: this.detailsFormGroup.value.nationalityCtrl!.id!,
      id_type_id: this.detailsFormGroup.value.idTypeCtrl!.id!,
      id_number: this.detailsFormGroup.value.idCtrl!,
      contact: this.detailsFormGroup.value.phonenumberCtrl!,
      language_id: this.detailsFormGroup.value.languageCtrl!.id!,
      children: Number(this.detailsFormGroup.value.childCtrl!),
      employment_status_id: this.workFormGroup.value.employmentstatusCtrl!.id!,
      marital_status_id: this.detailsFormGroup.value.maritalstatusCtrl!.id!,
      case: caseModel,
      work: workModel,
      spouse: spouseModel,
      representative: repModel,
    };
    console.log('Application Payload:', JSON.stringify(appData, null, 2));
    this.loading = true;
    this.appService.createApplication(appData).subscribe({
      next: () => {
        this.snackBar.open('application successful!', '', {
          duration: 3000, // 3 seconds
          panelClass: ['success-snackbar'], // Optional custom class
        });
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Error creating application', err);
        this.snackBar.open('application failed. Please try again.', '', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }
}
