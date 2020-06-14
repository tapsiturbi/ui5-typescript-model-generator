const through = require("through2");
const ts = require("typescript");
const path = require("path");

const SPACER = "    ";
const ANCHOR_START = "//-- AUTO GENERATED (DO NOT EDIT BELOW) ---------------";
const ANCHOR_END = "//-- END AUTO GENERATED (DO NOT EDIT ABOVE) -----------";


/**
 * Parses the file and returns the generated code content and other info.
 *
 * @param {*} file
 * @param {*} options
 */
const processFile = function(file, options) {
    const filePath = file.path;
    let program = ts.createProgram([filePath], { allowJs: true });
    const sourceFile = program.getSourceFile(filePath);
    const typeChecker = program.getTypeChecker()

    const returnObject = {
        content: "",
        pos: 0,
        end: 0,
        className: "",
        classGenerics: []
    };
    let interfaces = [];

    ts.forEachChild(sourceFile, node => {

        // on class declaration:
        // - get parent class and interface used (ignore if none)
        // - get position of the last closing bracket (kind == CloseBraceToken) so the caller will know where
        //   to insert the code to
        if ( ts.isClassDeclaration(node) ) {
            let classInfo = getParentClassInfo(node, typeChecker);

            // if not expected, then log and skip
            if ( options.parentClassName && options.parentClassName != classInfo.className ) {
                console.log(`Skipping class ${node.name.text} because it is extending ${classInfo.className} instead of expected class ${options.parentClassName}`)

            } else if ( !classInfo.classGenerics.length ) {
                console.log(`Skipping class ${node.name.text} (${classInfo.className}) because it does not have any typeArguments `)

            } else {

                returnObject.className = classInfo.className;
                returnObject.classGenerics = classInfo.classGenerics;

                let lastToken = node.getLastToken();
                returnObject.pos = lastToken.pos;
                returnObject.end = lastToken.end;
            }


        }

    });


    if ( returnObject.classGenerics.length ) {
        ts.forEachChild(sourceFile, node => {
            if (ts.isInterfaceDeclaration(node) && returnObject.classGenerics.indexOf(node.name.text) > -1 ) {
                interfaces.push(node);
            }
        });

        let fullContent = "";

        interfaces.forEach(interface => {
            let arrTypes = [];
            interface.members.forEach(member => {
                parseMember(member, null, typeChecker, arrTypes);
            });

            fullContent += `//-----------------------------------------------------------------------------------\n`;
            fullContent += `// Auto generated functions based from ${interface.name.text} for use in OpenUI5 \n`;
            fullContent += `// views and controllers. \n`;
            fullContent += `//\n`;
            fullContent += `// Generated using {@link https://www.npmjs.com/package/ui5-typescript-model-generator} \n`;
            fullContent += `// on ${new Date().toISOString()} \n`;
            fullContent += `//-----------------------------------------------------------------------------------\n\n`;

            // Getters and setters for each property

            fullContent += generateGettersAndSetters(interface, arrTypes);

            // Functions for paths

            fullContent += generatePathFunctions(interface, arrTypes);


            fullContent = `//#region Auto generated code\n${fullContent}\n//#endregion`;
        });

        returnObject.content = fullContent;
    }

    return returnObject;
};


/**
 * Returns the pretty kind/type name based from the SyntaxKind enum from
 * Typescript.
 *
 * @param {*} kind
 */
const getSyntaxKind = (kind) => {
    for(let p in ts.SyntaxKind) {
        if ( kind == ts.SyntaxKind[p]) {
            return p;
        }
    }
};

/**
 * Returns the parent class name based on the given class node.
 * @param {*} node
 */
const getParentClassInfo = (classNode, typeChecker) => {

    if ( classNode.heritageClauses && classNode.heritageClauses.length ) {
        for (let clause of classNode.heritageClauses) {
            if ( clause.token == ts.SyntaxKind.ExtendsKeyword ) {

                if (clause.types.length != 1) {
                    console.warn(`error parsing extends expression "${clause.getText()}"`);
                } else {
                    let classType = clause.types[0];
                    let symbol = typeChecker.getSymbolAtLocation(classType.expression);

                    if (!symbol) {
                        console.warn(`error retrieving symbol for extends expression "${clause.getText()}"`);
                    } else {

                        let typeGenerics = [];
                        if ( classType.typeArguments && classType.typeArguments.length ) {
                            typeGenerics = classType.typeArguments.map(t => t.typeName.text);
                        }

                        return {
                            className: typeChecker.getFullyQualifiedName(symbol),
                            classGenerics: typeGenerics
                        };
                    }
                }
            }
        }
    }

    return null;
};

/**
 * Traverses the node hierarchy and builds the type information into the returned array
 * @param {*} member
 * @param {*} parents
 * @param {*} returnArray
 */
const parseMember = (member, parents, typeChecker, returnArray) => {
    const prettyTypeName = typeChecker.typeToString(typeChecker.getTypeAtLocation(member.type));
    const jsDocComments = getJSDocComments(member, typeChecker);
    const parentPath = parents ? "/" + parents.map(p => p.name.text).join("/") : "";

    if ( !parents ) {
        parents = [];
    }

    if ( !returnArray ) {
        returnArray = [];
    }

    let returnResult = {
        name: member.name.text,
        parentPath: parentPath,
        kindName: getSyntaxKind(member.type.kind),
        type: prettyTypeName,
        comments: jsDocComments,

        contextMembers: [] // objects under array
    };
    returnArray.push(returnResult);

    if ( member.type.members ) {
        member.type.members.forEach(submember => {
            parseMember(submember, parents.concat(member), typeChecker, returnArray);
        });

    } else if ( member.type.kind == ts.SyntaxKind.ArrayType && member.type.elementType.members ) {
        // if array of complex objects,

        // member.type.elementType.members
        let subReturnArray = [];
        member.type.elementType.members.forEach(arrMember => {
            parseMember(arrMember, null, typeChecker, subReturnArray);
        });

        returnResult.contextMembers = subReturnArray;

    }
    return returnArray;
};

/**
 * Returns the JSDoc comments (if any)
 * @param {*} node
 */
const getJSDocComments = (node, typeChecker) => {
    if ( node && node.name ) {
        const symbol = typeChecker.getSymbolAtLocation(node.name);
        if ( symbol ) {
            let comments = symbol.getDocumentationComment(typeChecker);
            if ( comments && comments.length ) {
                return comments.map(c => c.text).join("\n");
            }
        }
    }

    return "";
}

/**
 * Returns the generated code for the path() and fullPath functions.
 *
 * @param {*} arrTypes
 */
const generatePathFunctions = (interface, arrTypes) => {
    let propList = [];

    let contextContent = "";

    // prepare paths into an array so that we can join them all later
    arrTypes.forEach(parsedType => {
        let fullName = parsedType.parentPath + "/" + parsedType.name;
        let prop = fullName.replace(/\//g, "_").replace(/^_/, "");

        propList.push({
            jsdoc: `/** @type {${parsedType.type}} path to ${fullName}; ${parsedType.comments} */`,
            prop: prop,
            fullName: fullName
        });

        if ( parsedType.contextMembers.length ) {
            // console.log(parsedType.contextMembers);

            contextContent += generateContextPathFunctions(interface, parsedType);
        }
    });

    let fullContent = "";

    fullContent += `/**\n`;
    fullContent += ` * Paths to each data entry to this model, each defined in ${interface.name.text} \n`;
    fullContent += ` */\n`;
    fullContent += `public static path() {\n`;
    fullContent += `${SPACER}return {\n${SPACER+SPACER}${propList.map(p => `${p.jsdoc}\n${SPACER+SPACER}${p.prop}: "${p.fullName}"` ).join(",\n"+SPACER+SPACER)} \n${SPACER}};`;
    fullContent += `\n}\n`; // closing of get path()

    fullContent += `/**\n`;
    fullContent += ` * Full paths to each data entry to this model, each defined in ${interface.name.text} \n`;
    fullContent += ` */\n`;
    fullContent += `public static fullpath() {\n`;
    fullContent += `${SPACER}return {\n${SPACER+SPACER}${propList.map(p => `${p.jsdoc}\n${SPACER+SPACER}${p.prop}: "{${p.fullName}}"` ).join(",\n"+SPACER+SPACER)} \n${SPACER}};`;
    fullContent += `\n}\n`; // closing of get fullpath()

    fullContent += contextContent;

    return fullContent;
};

/**
 * Returns the generated code for the contextPath<propertyName>() and
 * fullContextPath<propertyName>() functions.
 *
 * @param {*} interface
 * @param {*} arrTypes
 */
const generateContextPathFunctions = (interface, typeWithContextMembers, parents) => {

    parents = parents || [];

    let fullContent = "";

    let fullPath = parents.map(type => type.parentPath + "/" + type.name).join("/") + typeWithContextMembers.parentPath + "/" + typeWithContextMembers.name;
    const functionName = fullPath.split("/").map(s => toCamelCase(s)).join("");

    // prepare paths into an array so that we can join them all later
    let propList = [];
    let subContextContent = "";
    typeWithContextMembers.contextMembers.forEach(parsedType => {
        propList.push(parsedType.name);

        // if the contextMember also have another contextMember under it, then traverse
        if ( parsedType.contextMembers.length ) {
            subContextContent += generateContextPathFunctions(interface, parsedType, parents.concat(typeWithContextMembers));
        }
    });

    // contextPath()
    fullContent += `/**\n`;
    fullContent += ` * Paths to each data entry to this model (${interface.name.text}) under the context of ${fullPath.replace(/\/([^\/]+)/g, "/$1[]")} \n`;
    fullContent += ` */\n`;
    fullContent += `public static contextPath${functionName}() {\n`;
    fullContent += `${SPACER}return {\n${SPACER}${propList.map(p => `${SPACER}${p}: "${p}"` ).join(",\n"+SPACER)} \n${SPACER}};`;
    fullContent += `\n}\n`;

    // contextFullPath()
    fullContent += `/**\n`;
    fullContent += ` * Paths to each data entry to this model (${interface.name.text}) under the context of ${fullPath.replace(/\/([^\/]+)/g, "/$1[]")} \n`;
    fullContent += ` */\n`;
    fullContent += `public static fullContextPath${functionName}() {\n`;
    fullContent += `${SPACER}return {\n${SPACER}${propList.map(p => `${SPACER}${p}: "{${p}}"` ).join(",\n"+SPACER)} \n${SPACER}};`;
    fullContent += `\n}\n`;

    fullContent += subContextContent;

    return fullContent;


};

/**
 * Returns the generated code for the getters and setters of each property
 * in the data of this model.
 *
 * @param {*} interface
 * @param {*} arrTypes
 */
const generateGettersAndSetters = (interface, arrTypes) => {
    let fullContent = "";

    arrTypes.forEach(parsedType => {
        let fullPath = parsedType.parentPath + "/" + parsedType.name;
        let fullName = fullPath.split("/").map(s => toCamelCase(s)).join("");

        fullContent += `/**\n`;
        fullContent += ` * Data of model property ${fullPath}; \n`;
        fullContent += ` * ${parsedType.comments} \n`;
        fullContent += ` * @see ${interface.name.text} \n`;
        fullContent += ` */\n`;
        fullContent += `public getData${fullName}() : ${parsedType.type} {\n`;
        fullContent += `${SPACER}return this.getProperty("${fullPath}"); \n`
        fullContent += `}\n\n`

        fullContent += `/**\n`;
        fullContent += ` * Data of model property ${fullPath}; \n`;
        fullContent += ` * ${parsedType.comments} \n`;
        fullContent += ` * @see ${interface.name.text} \n`;
        fullContent += ` */\n`;
        fullContent += `public setData${fullName}(vValue:${parsedType.type}) {\n`;
        fullContent += `${SPACER}this.setProperty("${fullPath}", vValue); \n`
        fullContent += `}\n\n`

    });


    return fullContent;
};

/**
 * Converts string to camel case ("hello" => "Hello"; "helloWorld" => "HelloWorld")
 * @param {*} str
 */
const toCamelCase = (str) => {
    return str.charAt(0).toUpperCase() + str.substr(1);
};

/**
 * Adds or Replaces the generated code in the content.
 *
 * @param {*} origContent
 * @param {*} pos
 * @param {*} generatedCode
 */
const addOrReplaceGeneratedCode = (origContent, pos, generatedCode) => {

    const startIndex = origContent.indexOf(ANCHOR_START);
    const endIndex = origContent.indexOf(ANCHOR_END);

    // add spacer at every newline
    generatedCode = generatedCode.replace(/\n/g,`\n${SPACER}`);

    generatedCode = `\n\n${SPACER}${ANCHOR_START}\n${SPACER}${generatedCode}\n\n${SPACER}${ANCHOR_END}\n`;

    if ( startIndex > -1 ) {
        if ( endIndex == -1 ) {
            throw new Error("Not able to find end anchor in file");
        }

        if ( pos < startIndex ) {
            throw new Error("Auto generated anchor start is after the closing of class");
        }

        return origContent.substr(0, startIndex).trimEnd() + generatedCode + origContent.substr(endIndex + ANCHOR_END.length).trimStart();
    }



    return origContent.substr(0, pos) + generatedCode + origContent.substr(pos);
};

/**
 * Gulp stream that parses Typescript classes and inserts generated functions intended
 * for OpenUI5 models.
 *
 * @param {*} options
 */
module.exports = function(options) {
    options = options || {};

    return through.obj(function(file, encoding, callback) {
        if (file.isNull()) {
            // nothing to do
            return callback(null, file);
        }

        if (file.isStream()) {
            callback(new Error("Streaming not supported"));
        }

        let processResult = processFile(file, options);
        if ( processResult.content ) {
            let content = String(file.contents);

            file.contents = Buffer.from(addOrReplaceGeneratedCode(content, processResult.pos, processResult.content));
        }

        callback(null, file);
    });
};