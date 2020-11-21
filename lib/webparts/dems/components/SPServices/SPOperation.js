var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { sp } from '@pnp/sp/presets/all';
var SPOperation = /** @class */ (function () {
    function SPOperation() {
        this.Skill = [];
        this.Sector = [];
    }
    SPOperation.prototype.onInit = function (context) {
        // other init code may be present      
        sp.setup({
            spfxContext: context
        });
    };
    SPOperation.prototype.getFilteredItem1 = function (ItemID) {
        var _this = this;
        // return new Promise < any > (async(resolve, reject) => {
        // 	sp.web.lists.getByTitle('EmpStage').items.getById(Number(ItemID)).select("ID", "AttachmentFiles").expand("AttachmentFiles").get().then((results: any) => {
        // 		resolve(results);
        // 	});
        // });
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // 	//sp.web.getFileByServerRelativePath("/sites/DEMSMicrositetest/Shared Documents/1024857.pdf").recycle();
                sp.web.lists.getByTitle('Profile Database').items.select("FileLeafRef").filter("FileLeafRef eq '" + ItemID + ".pdf'").get().then(function (result) {
                    var ArrayOfGID = result.map(function (item) { return item.FileLeafRef.split(".")[0]; });
                    resolve(result.length > 0 ? true : false);
                });
                return [2 /*return*/];
            });
        }); });
    };
    SPOperation.prototype.CreateSharedProfileItem = function (valuesS) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                sp.web.lists.getByTitle("Notification").items.add(valuesS).then(function (results) {
                    resolve("Value Inserted");
                });
                return [2 /*return*/];
            });
        }); });
    };
    SPOperation.prototype.NotFoundNotifySend = function (queryOfNotFound) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                sp.web.lists.getByTitle("scheduleQuery").items.add(queryOfNotFound).then(function (results) {
                    resolve("Value Inserted");
                });
                return [2 /*return*/];
            });
        }); });
    };
    SPOperation.prototype.getNotification = function (context, listNameForSector, listNameForSkill, listNameForEmailTemplate) {
        var _this = this;
        this.onInit(context);
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                this.getDataFromList(listNameForSector).then(function (Sector) {
                    _this.setterVariable(Sector, "Sector");
                });
                this.getDataFromList(listNameForSkill).then(function (Skill) {
                    _this.setterVariable(Skill, "Skill");
                    sp.web.lists.getByTitle(listNameForEmailTemplate).items.get().then(function (Notification) {
                        resolve([Notification, _this.Sector, _this.Skill]);
                    });
                });
                return [2 /*return*/];
            });
        }); });
    };
    SPOperation.prototype.setterVariable = function (AllObject, objectType) {
        var TempArray = [];
        if (objectType == "Sector") {
            AllObject.map(function (item) { return TempArray.push({ Id: item, text: item }); });
            this.Sector = TempArray;
        }
        else {
            TempArray = [];
            AllObject.map(function (item) { return TempArray.push({ Id: item, text: item }); });
            this.Skill = TempArray;
        }
    };
    SPOperation.prototype.getDataFromList = function (ListName) {
        var _this = this;
        var ListData = [];
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                sp.web.lists.getByTitle(ListName).items.top(1000).get().then(function (results) {
                    results.map(function (result) {
                        ListData.push(result.Title);
                    });
                    resolve(ListData);
                });
                return [2 /*return*/];
            });
        }); });
    };
    SPOperation.prototype.ResultCollection1 = function (ObjColl, skillarr, sector, listName) {
        var _this = this;
        var collectionOfItem = [];
        var AllId = [];
        var clusterOfSector = [];
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            var list, caml, items;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        list = sp.web.lists.getByTitle(listName);
                        caml = {
                            ViewXml: '<View>' + ObjColl + '</View>',
                        };
                        return [4 /*yield*/, list.getItemsByCAMLQuery(caml)];
                    case 1:
                        items = _a.sent();
                        if (skillarr.length == 1) { }
                        else if (skillarr.length == 2) {
                            items.map(function (all) {
                                return (all.Skills.toLowerCase().indexOf(skillarr[0].toLowerCase()) !== -1 && all.Skills.toLowerCase().indexOf(skillarr[1].toLowerCase()) !== -1) ? collectionOfItem.push(all) : null;
                            });
                        }
                        else if (skillarr.length == 3) {
                            items.map(function (all) {
                                return (all.Skills.toLowerCase().indexOf(skillarr[0].toLowerCase()) !== -1 && all.Skills.toLowerCase().indexOf(skillarr[1].toLowerCase()) !== -1 && all.Skills.toLowerCase().indexOf(skillarr[2].toLowerCase()) !== -1) ? collectionOfItem.push(all) : null;
                            });
                            items.map(function (all) {
                                return ((all.Skills.toLowerCase().indexOf(skillarr[0].toLowerCase()) !== -1 && all.Skills.toLowerCase().indexOf(skillarr[1].toLowerCase()) !== -1) || (all.Skills.toLowerCase().indexOf(skillarr[0].toLowerCase()) !== -1 && all.Skills.toLowerCase().indexOf(skillarr[2].toLowerCase()) !== -1) || (all.Skills.toLowerCase().indexOf(skillarr[1].toLowerCase()) !== -1 && all.Skills.toLowerCase().indexOf(skillarr[2].toLowerCase()) !== -1)) ? collectionOfItem.push(all) : null;
                            });
                        }
                        collectionOfItem.push.apply(collectionOfItem, items);
                        collectionOfItem.map(function (x) { return AllId.filter(function (a) { return a.Id == x.Id; }).length > 0 ? null : AllId.push(x); }); //remove duplicate value from array
                        resolve(AllId);
                        return [2 /*return*/];
                }
            });
        }); });
    };
    SPOperation.prototype.createNotification = function (data1) {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                sp.web.lists.getByTitle('Notification').items.add(data1).then(function (results) {
                    resolve("Data " + results.data.ID + "has been successfully feded");
                });
                return [2 /*return*/];
            });
        }); });
    };
    SPOperation.prototype.getCurrentUserInformation = function () {
        var _this = this;
        return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                sp.web.currentUser.get().then(function (r) {
                    resolve(r['Title'] + "/" + r['Email']);
                });
                return [2 /*return*/];
            });
        }); });
    };
    return SPOperation;
}());
export { SPOperation };
//# sourceMappingURL=SPOperation.js.map