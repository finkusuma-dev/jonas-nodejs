"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const mongoose_1 = require("mongoose");
// export type userDocType = Document<unknown, {}, IUser>;
// export type userResultDocType = userDocType &
//   IUser & {
//     _id: Types.ObjectId;
//   };
// export type userQueryType = Query<
//   userResultDocType[],
//   userResultDocType,
//   {},
//   IUser
// >;
// export type QueryUser = Query<
//   (DocumentUser & IUser & { _id: Types.ObjectId })[],
//   DocumentUser & IUser & { _id: Types.ObjectId }
//   // {},
//   // IUser
//   // 'find'
// >;
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'You must specify a name'],
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        validate: [validator_1.default.isEmail, 'Please provide a valid email'],
        required: [true, 'You must specify an email'],
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'guide', 'lead-guide'],
        default: 'user'
    },
    photo: {
        type: String,
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        min: 8,
        select: false
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpired: Date,
});
/// VALIDATION MIDDLEWARE
// tourSchema.pre('validate', function (next) {
//   if (this.priceDiscount && this.price <= this.priceDiscount) {
//     next(
//       new Error(
//         `priceDiscount (${this.priceDiscount}) must be < price (${this.price})`,
//       ),
//     );
//   }
//   next();
// });
/// Document Middleware
userSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        /// run only if password is modified
        if (!this.isModified('password'))
            return;
        this.password = yield bcryptjs_1.default.hash(this.password, 12);
        this.passwordChangedAt = new Date();
        console.log('password is changed:', this.password, this.passwordChangedAt);
        next(); /// if we only have 1 pre middleware like this, we can omit next().
    });
});
/// Create instance method. Can be accessed with user.verifyPassword
// userSchema.method('verifyPassword' , function(inputPassword: string, userPassword: string):Promise<boolean> {
//   return bcrypt.compare(inputPassword, userPassword);
// });
userSchema.methods.verifyPassword = function (inputPassword, userPassword) {
    /// We cannot use this.password because the default it's not selected
    return bcryptjs_1.default.compare(inputPassword, userPassword);
};
userSchema.methods.checkIfPasswordIsChangedAfterJWTWasIssued = function (JwtIatTimestamp) {
    if (this.passwordChangedAt) {
        return (this.passwordChangedAt.getTime() / 1000) > JwtIatTimestamp;
    }
    return false;
};
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto_1.default.randomBytes(32).toString('hex');
    const hash = crypto_1.default.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetToken = hash;
    this.passwordResetExpired = new Date(Date.now() + 10 * 60 * 1000);
    console.log('>Password Reset token:', resetToken, 'hash:', hash, 'expired:', this.passwordResetExpired);
    return resetToken;
};
// userSchema.post('save', function (doc, next) {
//   console.log('new doc created', doc);
//   next(); /// if we only have 1 pre middleware like this, we can omit next().
// });
///// Query Middleware
/// use regex to define find and findOne method
userSchema.pre(/^find/, function (next) {
    this.find({
        password: { $ne: true },
    });
    next();
});
userSchema.post(/^find/, function (docs, next) {
    // console.log('post find', docs);
    next();
});
////// Aggregation Middleware
// userSchema.pre('aggregate', function (next) {
//   // console.log('Pre aggregation middleware');
//   (this as Aggregate<IUser>).pipeline().unshift({
//     $match: {
//       secret: { $ne: true },
//     },
//   });
//   // console.log('Aggregate pipeline', this);
//   next();
// });
// const Tour = model<ITour, TourModelType>('Tour', tourSchema);
const User = (0, mongoose_1.model)('User', userSchema);
// module.exports = Tour;
exports.default = User;
