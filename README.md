# ui5-typescript-model-generator
Gulp task that generates typescript code for SAPUI5/OpenUI5 model classes.

# Why generate code?
UI5 models has helper functions like setProperty/getProperty to set and get data. However, you would need to know the full data structure of each of your models before you even use it. To make it easier to maintain, this code generator would automatically create the getters and setters for each data on your model.

# Requirements
This script expects the following:
- you are using typescript on your project
- you are using gulp
- you have a base class that you use on all your models and this base class has a generic type argument defined. Example:
```
/**
 * Interface representing the data used on the model.
 */
export interface ViewJSONModelData {
}

/**
 * Base class to use as JSONModel.
 *
 * @name spinifex.webdemo.models.ViewJSONModel
 */
export default abstract class ViewJSONModel<T extends ViewJSONModelData> extends JSONModel {
    constructor(oInitData: T ) {
        super(oInitData);
    }

    /**
     * Returns the entire data.
     */
    public getData() : T {
        // @ts-ignore
        return <T>super.getData();
    }
}
```


# How to use
```
    const ui5tsgen = require("ui5-typescript-model-generator");
    // ...
    gulp.task("generator", function() {
        return gulp.src([
            `src/models/**/*.ts`,
        ])
        .pipe(ui5tsgen({ parentClassName: `ViewJSONModel` }))
        .pipe(gulp.dest(file => file.base));
    });
```

This will get all `.ts` files on your src/models directory and get those that have `ViewJSONModel` as the parent class. So for example, if you have the following model class:

```
    export interface EmployeeListViewJSONModelData {

        /** json object containing the loading flags on different instances */
        loading: {

            /** flag that becomes true if changing pages */
            pagination: boolean,

            /**
            * flag that becomes whenever any ajax call is made
            */
            all: boolean
        },

        employees: {
            /** first name of employee */
            firstName: string,

            /**
            * last name
            */
            lastName: string,

            /** unique User ID */
            userId: string,

            lastLoginDate: Date,

            emailAddresses: {
                email: string,
                type: "personal"|"work",
                isPrimary: boolean
            }[]
        }[]
    }

    /**
    * JSONModel used on EmployeeList view.
    *
    * @name spinifex.webdemo.models.EmployeeListViewJSONModel
    */
    export default class EmployeeListViewJSONModel extends ViewJSONModel<EmployeeListViewJSONModelData> {}
```


This code generator will add the following methods inside EmployeeListViewJSONModel:
```
    //-- AUTO GENERATED (DO NOT EDIT BELOW) ---------------
    //#region Auto generated code
    //-----------------------------------------------------------------------------------
    // Auto generated functions based from EmployeeListViewJSONModelData for use in OpenUI5
    // views and controllers.
    //
    // Generated using {@link https://www.npmjs.com/package/ui5-typescript-model-generator}
    // on 2020-06-14T08:00:56.459Z
    //-----------------------------------------------------------------------------------

    /**
     * Data of model property /loading;
     * json object containing the loading flags on different instances
     * @see EmployeeListViewJSONModelData
     */
    public getDataLoading() : { pagination: boolean; all: boolean; } {
        return this.getProperty("/loading");
    }

    /**
     * Data of model property /loading;
     * json object containing the loading flags on different instances
     * @see EmployeeListViewJSONModelData
     */
    public setDataLoading(vValue:{ pagination: boolean; all: boolean; }) {
        this.setProperty("/loading", vValue);
    }

    /**
     * Data of model property /loading/pagination;
     * flag that becomes true if changing pages
     * @see EmployeeListViewJSONModelData
     */
    public getDataLoadingPagination() : boolean {
        return this.getProperty("/loading/pagination");
    }

    /**
     * Data of model property /loading/pagination;
     * flag that becomes true if changing pages
     * @see EmployeeListViewJSONModelData
     */
    public setDataLoadingPagination(vValue:boolean) {
        this.setProperty("/loading/pagination", vValue);
    }

    /**
     * Data of model property /loading/all;
     * flag that becomes whenever any ajax call is made
     * @see EmployeeListViewJSONModelData
     */
    public getDataLoadingAll() : boolean {
        return this.getProperty("/loading/all");
    }

    /**
     * Data of model property /loading/all;
     * flag that becomes whenever any ajax call is made
     * @see EmployeeListViewJSONModelData
     */
    public setDataLoadingAll(vValue:boolean) {
        this.setProperty("/loading/all", vValue);
    }

    /**
     * Data of model property /employees;
     *
     * @see EmployeeListViewJSONModelData
     */
    public getDataEmployees() : { firstName: string; lastName: string; userId: string; lastLoginDate: Date; emailAddresses: { email: string; type: "personal" | "work"; isPrimary: boolean; }[]; }[] {
        return this.getProperty("/employees");
    }

    /**
     * Data of model property /employees;
     *
     * @see EmployeeListViewJSONModelData
     */
    public setDataEmployees(vValue:{ firstName: string; lastName: string; userId: string; lastLoginDate: Date; emailAddresses: { email: string; type: "personal" | "work"; isPrimary: boolean; }[]; }[]) {
        this.setProperty("/employees", vValue);
    }

    /**
     * Paths to each data entry to this model, each defined in EmployeeListViewJSONModelData
     */
    public static path() {
        return {
            /** @type {{ pagination: boolean; all: boolean; }} path to /loading; json object containing the loading flags on different instances */
            loading: "/loading",
            /** @type {boolean} path to /loading/pagination; flag that becomes true if changing pages */
            loading_pagination: "/loading/pagination",
            /** @type {boolean} path to /loading/all; flag that becomes whenever any ajax call is made */
            loading_all: "/loading/all",
            /** @type {{ firstName: string; lastName: string; userId: string; lastLoginDate: Date; emailAddresses: { email: string; type: "personal" | "work"; isPrimary: boolean; }[]; }[]} path to /employees;  */
            employees: "/employees"
        };
    }
    /**
     * Full paths to each data entry to this model, each defined in EmployeeListViewJSONModelData
     */
    public static fullpath() {
        return {
            /** @type {{ pagination: boolean; all: boolean; }} path to /loading; json object containing the loading flags on different instances */
            loading: "{/loading}",
            /** @type {boolean} path to /loading/pagination; flag that becomes true if changing pages */
            loading_pagination: "{/loading/pagination}",
            /** @type {boolean} path to /loading/all; flag that becomes whenever any ajax call is made */
            loading_all: "{/loading/all}",
            /** @type {{ firstName: string; lastName: string; userId: string; lastLoginDate: Date; emailAddresses: { email: string; type: "personal" | "work"; isPrimary: boolean; }[]; }[]} path to /employees;  */
            employees: "{/employees}"
        };
    }
    /**
     * Paths to each data entry to this model (EmployeeListViewJSONModelData) under the context of /employees[]
     */
    public static contextPathEmployees() {
        return {
            firstName: "firstName",
            lastName: "lastName",
            userId: "userId",
            lastLoginDate: "lastLoginDate",
            emailAddresses: "emailAddresses"
        };
    }
    /**
     * Paths to each data entry to this model (EmployeeListViewJSONModelData) under the context of /employees[]
     */
    public static fullContextPathEmployees() {
        return {
            firstName: "{firstName}",
            lastName: "{lastName}",
            userId: "{userId}",
            lastLoginDate: "{lastLoginDate}",
            emailAddresses: "{emailAddresses}"
        };
    }
    /**
     * Paths to each data entry to this model (EmployeeListViewJSONModelData) under the context of /employees[]/emailAddresses[]
     */
    public static contextPathEmployeesEmailAddresses() {
        return {
            email: "email",
            type: "type",
            isPrimary: "isPrimary"
        };
    }
    /**
     * Paths to each data entry to this model (EmployeeListViewJSONModelData) under the context of /employees[]/emailAddresses[]
     */
    public static fullContextPathEmployeesEmailAddresses() {
        return {
            email: "{email}",
            type: "{type}",
            isPrimary: "{isPrimary}"
        };
    }

    //#endregion

    //-- END AUTO GENERATED (DO NOT EDIT ABOVE) -----------
```

