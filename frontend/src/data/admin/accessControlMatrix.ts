/**
 * Portal capability matrix for school-side and sales roles (policy reference in admin UI).
 * "request" = must open a Panworld approval / ticket; "yes" = allowed in product scope.
 */
export type AccessMatrixCell = "yes" | "request" | "no";

export type AccessMatrixRoleColumn = "hod" | "schoolAdmin" | "sales" | "panworld";

export type AccessMatrixRow = {
  id: string;
  labelKey: string;
  hintKey?: string;
  hod: AccessMatrixCell;
  schoolAdmin: AccessMatrixCell;
  sales: AccessMatrixCell;
  panworld: AccessMatrixCell;
};

export const accessMatrixRows: AccessMatrixRow[] = [
  {
    id: "teachers",
    labelKey: "admin.accessMatrix.cap.teachers",
    hintKey: "admin.accessMatrix.cap.teachersHint",
    hod: "yes",
    schoolAdmin: "yes",
    sales: "no",
    panworld: "yes",
  },
  {
    id: "schoolStaffDirect",
    labelKey: "admin.accessMatrix.cap.schoolStaffDirect",
    hintKey: "admin.accessMatrix.cap.schoolStaffDirectHint",
    hod: "request",
    schoolAdmin: "yes",
    sales: "no",
    panworld: "yes",
  },
  {
    id: "userRequest",
    labelKey: "admin.accessMatrix.cap.userRequest",
    hintKey: "admin.accessMatrix.cap.userRequestHint",
    hod: "yes",
    schoolAdmin: "yes",
    sales: "no",
    panworld: "yes",
  },
  {
    id: "schoolsCreate",
    labelKey: "admin.accessMatrix.cap.schoolsCreate",
    hintKey: "admin.accessMatrix.cap.schoolsCreateHint",
    hod: "no",
    schoolAdmin: "no",
    sales: "yes",
    panworld: "yes",
  },
  {
    id: "assignResources",
    labelKey: "admin.accessMatrix.cap.assignResources",
    hintKey: "admin.accessMatrix.cap.assignResourcesHint",
    hod: "no",
    schoolAdmin: "no",
    sales: "yes",
    panworld: "yes",
  },
  {
    id: "amSchoolMap",
    labelKey: "admin.accessMatrix.cap.amSchoolMap",
    hintKey: "admin.accessMatrix.cap.amSchoolMapHint",
    hod: "no",
    schoolAdmin: "no",
    sales: "yes",
    panworld: "yes",
  },
  {
    id: "deactivateUsers",
    labelKey: "admin.accessMatrix.cap.deactivateUsers",
    hintKey: "admin.accessMatrix.cap.deactivateUsersHint",
    hod: "request",
    schoolAdmin: "yes",
    sales: "no",
    panworld: "yes",
  },
];

export const ACCESS_MATRIX_COLUMNS: AccessMatrixRoleColumn[] = ["hod", "schoolAdmin", "sales", "panworld"];
