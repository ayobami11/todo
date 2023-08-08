import { Model, Schema, model, models } from 'mongoose';
import jwt from 'jsonwebtoken';

interface IUser {
    email: string,
    name: string,
    password: string,
    account_type: 'credentials' | 'google',
    access_token?: string
}

interface IUserMethods {
    generateAccessToken(): void
}

type UserModel = Model<IUser, {}, IUserMethods>;

const schema = new Schema<IUser, UserModel, IUserMethods>({
    email: {
        type: String,
        required: [true, 'Email is required'],
        maxlength: [30, 'Email cannot exceed 30 characters, got {VALUE}'],
        lowercase: true,
        unique: true
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        maxlength: [30, 'Name cannot exceed 30 characters, got {VALUE}'],
    },
    password: {
        type: String,
        // password is required only for 'credentials' accounts
        required: [function (): boolean { return this.account_type === 'credentials' }, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long, got {VALUE}']
        // don't set a maxlength for password because it is going to be salted
    },
    account_type: {
        type: String,
        enum: ['credentials', 'google'],
        required: [true, 'Account type is required'],
    },
    access_token: {
        type: String
    }
}, { timestamps: true });


schema.method('generateAccessToken', function generateAccessToken() {

    const accessToken = jwt.sign({
        id: this._id,
        name: this.name
    }, process.env.NEXTAUTH_SECRET as string,
        {
            expiresIn: '30 days',
        });

    this.access_token = accessToken;
});

const User = models.User || model<IUser, UserModel>('User', schema);

export default User;