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
    export interface HomeViewJSONModelData {
        /** boolean flag that will be true if this view is waiting for data to load */
        loading: boolean,

        numDigits: Number,
        maxNumbers: Number,

        result: Number[],

        date?: Date,
        multiLevelData?: {
            key: string,
            obj: { num: number, str: string },
            valueList: {
                id: string,
                value: string
            }[]
        }
    }

    /**
    * Base class to use as JSONModel.
    *
    * @name spinifex.webdemo.models.HomeViewJSONModel
    */
    export default class HomeViewJSONModel extends ViewJSONModel<HomeViewJSONModelData> {}
```


This code generator will add the following methods inside HomeViewJSONModel:
```
    //-- AUTO GENERATED (DO NOT EDIT BELOW) ---------------
    //#region Auto generated code
    //-----------------------------------------------------------------------------------
    // Auto generated functions based from HomeViewJSONModelData for use in OpenUI5
    // views and controllers.
    // Generated on: 2020-06-14T05:44:05.162Z
    //-----------------------------------------------------------------------------------

    /**
     * Data of model property /loading;
     * boolean flag that will be true if this view is waiting for data to load
     * @see HomeViewJSONModelData
     */
    public getDataLoading() : boolean {
        return this.getProperty("/loading");
    }

    /**
     * Data of model property /loading;
     * boolean flag that will be true if this view is waiting for data to load
     * @see HomeViewJSONModelData
     */
    public setDataLoading(vValue:boolean) {
        this.setProperty("/loading", vValue);
    }

    /**
     * Data of model property /numDigits;
     *
     * @see HomeViewJSONModelData
     */
    public getDataNumDigits() : Number {
        return this.getProperty("/numDigits");
    }

    /**
     * Data of model property /numDigits;
     *
     * @see HomeViewJSONModelData
     */
    public setDataNumDigits(vValue:Number) {
        this.setProperty("/numDigits", vValue);
    }

    /**
     * Data of model property /maxNumbers;
     *
     * @see HomeViewJSONModelData
     */
    public getDataMaxNumbers() : Number {
        return this.getProperty("/maxNumbers");
    }

    /**
     * Data of model property /maxNumbers;
     *
     * @see HomeViewJSONModelData
     */
    public setDataMaxNumbers(vValue:Number) {
        this.setProperty("/maxNumbers", vValue);
    }

    /**
     * Data of model property /result;
     *
     * @see HomeViewJSONModelData
     */
    public getDataResult() : Number[] {
        return this.getProperty("/result");
    }

    /**
     * Data of model property /result;
     *
     * @see HomeViewJSONModelData
     */
    public setDataResult(vValue:Number[]) {
        this.setProperty("/result", vValue);
    }

    /**
     * Data of model property /date;
     *
     * @see HomeViewJSONModelData
     */
    public getDataDate() : Date {
        return this.getProperty("/date");
    }

    /**
     * Data of model property /date;
     *
     * @see HomeViewJSONModelData
     */
    public setDataDate(vValue:Date) {
        this.setProperty("/date", vValue);
    }

    /**
     * Data of model property /multiLevelData;
     *
     * @see HomeViewJSONModelData
     */
    public getDataMultiLevelData() : { key: string; obj: { num: number; str: string; }; valueList: { id: string; value: string; }[]; } {
        return this.getProperty("/multiLevelData");
    }

    /**
     * Data of model property /multiLevelData;
     *
     * @see HomeViewJSONModelData
     */
    public setDataMultiLevelData(vValue:{ key: string; obj: { num: number; str: string; }; valueList: { id: string; value: string; }[]; }) {
        this.setProperty("/multiLevelData", vValue);
    }

    /**
     * Data of model property /multiLevelData/key;
     *
     * @see HomeViewJSONModelData
     */
    public getDataMultiLevelDataKey() : string {
        return this.getProperty("/multiLevelData/key");
    }

    /**
     * Data of model property /multiLevelData/key;
     *
     * @see HomeViewJSONModelData
     */
    public setDataMultiLevelDataKey(vValue:string) {
        this.setProperty("/multiLevelData/key", vValue);
    }

    /**
     * Data of model property /multiLevelData/obj;
     *
     * @see HomeViewJSONModelData
     */
    public getDataMultiLevelDataObj() : { num: number; str: string; } {
        return this.getProperty("/multiLevelData/obj");
    }

    /**
     * Data of model property /multiLevelData/obj;
     *
     * @see HomeViewJSONModelData
     */
    public setDataMultiLevelDataObj(vValue:{ num: number; str: string; }) {
        this.setProperty("/multiLevelData/obj", vValue);
    }

    /**
     * Data of model property /multiLevelData/obj/num;
     *
     * @see HomeViewJSONModelData
     */
    public getDataMultiLevelDataObjNum() : number {
        return this.getProperty("/multiLevelData/obj/num");
    }

    /**
     * Data of model property /multiLevelData/obj/num;
     *
     * @see HomeViewJSONModelData
     */
    public setDataMultiLevelDataObjNum(vValue:number) {
        this.setProperty("/multiLevelData/obj/num", vValue);
    }

    /**
     * Data of model property /multiLevelData/obj/str;
     *
     * @see HomeViewJSONModelData
     */
    public getDataMultiLevelDataObjStr() : string {
        return this.getProperty("/multiLevelData/obj/str");
    }

    /**
     * Data of model property /multiLevelData/obj/str;
     *
     * @see HomeViewJSONModelData
     */
    public setDataMultiLevelDataObjStr(vValue:string) {
        this.setProperty("/multiLevelData/obj/str", vValue);
    }

    /**
     * Data of model property /multiLevelData/valueList;
     *
     * @see HomeViewJSONModelData
     */
    public getDataMultiLevelDataValueList() : { id: string; value: string; }[] {
        return this.getProperty("/multiLevelData/valueList");
    }

    /**
     * Data of model property /multiLevelData/valueList;
     *
     * @see HomeViewJSONModelData
     */
    public setDataMultiLevelDataValueList(vValue:{ id: string; value: string; }[]) {
        this.setProperty("/multiLevelData/valueList", vValue);
    }

    /**
     * Paths to each data entry to this model, each defined in HomeViewJSONModelData
     */
    public static path() {
        return {
            /** @type {boolean} path to /loading; boolean flag that will be true if this view is waiting for data to load */
            loading: "/loading",
            /** @type {Number} path to /numDigits;  */
            numDigits: "/numDigits",
            /** @type {Number} path to /maxNumbers;  */
            maxNumbers: "/maxNumbers",
            /** @type {Number[]} path to /result;  */
            result: "/result",
            /** @type {Date} path to /date;  */
            date: "/date",
            /** @type {{ key: string; obj: { num: number; str: string; }; valueList: { id: string; value: string; }[]; }} path to /multiLevelData;  */
            multiLevelData: "/multiLevelData",
            /** @type {string} path to /multiLevelData/key;  */
            multiLevelData_key: "/multiLevelData/key",
            /** @type {{ num: number; str: string; }} path to /multiLevelData/obj;  */
            multiLevelData_obj: "/multiLevelData/obj",
            /** @type {number} path to /multiLevelData/obj/num;  */
            multiLevelData_obj_num: "/multiLevelData/obj/num",
            /** @type {string} path to /multiLevelData/obj/str;  */
            multiLevelData_obj_str: "/multiLevelData/obj/str",
            /** @type {{ id: string; value: string; }[]} path to /multiLevelData/valueList;  */
            multiLevelData_valueList: "/multiLevelData/valueList"
        };
    }
    /**
     * Full paths to each data entry to this model, each defined in HomeViewJSONModelData
     */
    public static fullpath() {
        return {
            /** @type {boolean} path to /loading; boolean flag that will be true if this view is waiting for data to load */
            loading: "{/loading}",
            /** @type {Number} path to /numDigits;  */
            numDigits: "{/numDigits}",
            /** @type {Number} path to /maxNumbers;  */
            maxNumbers: "{/maxNumbers}",
            /** @type {Number[]} path to /result;  */
            result: "{/result}",
            /** @type {Date} path to /date;  */
            date: "{/date}",
            /** @type {{ key: string; obj: { num: number; str: string; }; valueList: { id: string; value: string; }[]; }} path to /multiLevelData;  */
            multiLevelData: "{/multiLevelData}",
            /** @type {string} path to /multiLevelData/key;  */
            multiLevelData_key: "{/multiLevelData/key}",
            /** @type {{ num: number; str: string; }} path to /multiLevelData/obj;  */
            multiLevelData_obj: "{/multiLevelData/obj}",
            /** @type {number} path to /multiLevelData/obj/num;  */
            multiLevelData_obj_num: "{/multiLevelData/obj/num}",
            /** @type {string} path to /multiLevelData/obj/str;  */
            multiLevelData_obj_str: "{/multiLevelData/obj/str}",
            /** @type {{ id: string; value: string; }[]} path to /multiLevelData/valueList;  */
            multiLevelData_valueList: "{/multiLevelData/valueList}"
        };
    }

    //#endregion

    //-- END AUTO GENERATED (DO NOT EDIT ABOVE) -----------
```

