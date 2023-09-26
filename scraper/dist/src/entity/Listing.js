"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Listing = void 0;
const typeorm_1 = require("typeorm");
const JobBoard_1 = require("./JobBoard");
let Listing = class Listing {
    constructor() {
        this.remoteFlag = false;
    }
};
exports.Listing = Listing;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Listing.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Listing.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Listing.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "date_posted" }),
    __metadata("design:type", Number)
], Listing.prototype, "datePosted", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: "employment_type",
        nullable: true,
        type: "text",
        array: true,
    }),
    __metadata("design:type", Array)
], Listing.prototype, "employmentType", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: "text" }),
    __metadata("design:type", String)
], Listing.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "min_salary", nullable: true, type: "int" }),
    __metadata("design:type", Number)
], Listing.prototype, "minSalary", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "max_salary", nullable: true, type: "int" }),
    __metadata("design:type", Number)
], Listing.prototype, "maxSalary", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: "text" }),
    __metadata("design:type", String)
], Listing.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: "text" }),
    __metadata("design:type", String)
], Listing.prototype, "region1", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: "text" }),
    __metadata("design:type", String)
], Listing.prototype, "region2", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true, type: "text" }),
    __metadata("design:type", String)
], Listing.prototype, "locality", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "remote_flag", default: false }),
    __metadata("design:type", Boolean)
], Listing.prototype, "remoteFlag", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)((type) => JobBoard_1.JobBoard),
    (0, typeorm_1.JoinColumn)({ name: "job_board_id" }),
    __metadata("design:type", Number)
], Listing.prototype, "jobBoardId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "job_listing_id" }),
    __metadata("design:type", String)
], Listing.prototype, "jobListingId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "requirements_object", nullable: true, type: "json" }),
    __metadata("design:type", String)
], Listing.prototype, "requirementsObject", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "salary_object", nullable: true, type: "json" }),
    __metadata("design:type", String)
], Listing.prototype, "salaryObject", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "oragnization_object", nullable: true, type: "json" }),
    __metadata("design:type", String)
], Listing.prototype, "oragnizationObject", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: "location_object", nullable: true, type: "json" }),
    __metadata("design:type", String)
], Listing.prototype, "locationObject", void 0);
exports.Listing = Listing = __decorate([
    (0, typeorm_1.Entity)()
], Listing);
//# sourceMappingURL=Listing.js.map