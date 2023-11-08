import { query } from 'express';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

import {
  Schema,
  Model,
  model,
  // Document,
  // Types,
  // Query,
  // Aggregate,
} from 'mongoose';
import slugify from 'slugify';
import { QueryType } from '../types/mongooseTypes';

export type Role = 'user' | 'admin' | 'guide' | 'lead-guide';

export interface IUser {
  name: string;
  email: string;  
  role: Role,
  photo: string;
  password: string;
  // passwordConfirm: boolean;
  passwordChangedAt: Date,
  passwordResetToken: string,
  passwordResetExpired: Date,
  verifyPassword(inputPassword: string, userPassword: string): Promise<boolean>,
  checkIfPasswordIsChangedAfterJWTWasIssued(JwtIatTimestamp: number): boolean,
  createPasswordResetToken(): string
}

type UserModelType = Model<IUser>;

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

const userSchema = new Schema<IUser, Model<IUser>>(
  {
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
      validate: [validator.isEmail, 'Please provide a valid email'],
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
  },  
);

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
userSchema.pre('save', async function (next) {

  /// run only if password is modified
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordChangedAt = new Date();

  console.log('password is changed:', this.password, this.passwordChangedAt);

  next(); /// if we only have 1 pre middleware like this, we can omit next().
});

/// Create instance method. Can be accessed with user.verifyPassword

// userSchema.method('verifyPassword' , function(inputPassword: string, userPassword: string):Promise<boolean> {
//   return bcrypt.compare(inputPassword, userPassword);
// });
userSchema.methods.verifyPassword = function(inputPassword: string, userPassword: string):Promise<boolean> {
  /// We cannot use this.password because the default it's not selected
  return bcrypt.compare(inputPassword, userPassword);
};

userSchema.methods.checkIfPasswordIsChangedAfterJWTWasIssued = function(JwtIatTimestamp: number): boolean {
  if ((this as IUser).passwordChangedAt) {
    return ((this as IUser).passwordChangedAt.getTime() / 1000) > JwtIatTimestamp;
  }
  
  return false;
};

userSchema.methods.createPasswordResetToken = function(): string {
  const resetToken = crypto.randomBytes(32).toString('hex');

  const hash = crypto.createHash('sha256').update(resetToken).digest('hex');

  (this as IUser).passwordResetToken = hash;
  (this as IUser).passwordResetExpired = new Date(Date.now() + 10 * 60 * 1000);  

  console.log(
    '>Password Reset token:', resetToken,
    'hash:', hash,
    'expired:', this.passwordResetExpired
  );

  return resetToken;
}

// userSchema.post('save', function (doc, next) {
//   console.log('new doc created', doc);
//   next(); /// if we only have 1 pre middleware like this, we can omit next().
// });

///// Query Middleware
/// use regex to define find and findOne method
userSchema.pre(/^find/, function (next) {
  (this as QueryType<IUser>).find({
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
const User = model<IUser>('User', userSchema);

// module.exports = Tour;
export default User;
