import { usersModel } from '../dao/models/users.model.js';

class UserService {
    async createUser(userData) {
        try {
            const newUser = await usersModel.create(userData);
            return newUser;
        } catch (error) {
            throw error;
        }
    }

    async deleteUser(userId) {
        try {
            const deletedUser = await usersModel.findByIdAndDelete(userId);
            return deletedUser;
        } catch (error) {
            throw error;
        }
    }

    async showUser(email) {
        try {
            const user = await usersModel.findOne({ email });
            return user;
        } catch (error) {
            throw error;
        }
    }


    async showAllUsers() {
        try {
            const allUsers = await usersModel.find();
            return allUsers;
        } catch (error) {
            throw error;
        }
    }

    async updateUser(userId, updatedUserData) {
        try {
            const updatedUser = await usersModel.findByIdAndUpdate(userId, updatedUserData, { new: true });
            return updatedUser;
        } catch (error) {
            throw error;
        }
    }

    async getUserById(userId) {
        try {
            let user = await usersModel.findById(userId).lean();
            if (user) {
                delete user.password;
            }
            return user;
        } catch (error) {
            throw error;
        }
    }
    async updateOne(filter, update) {
        try {
            const result = await usersModel.updateOne(filter, update);
            return result;
        } catch (error) {
            throw error;
        }
    }
}

export default UserService;
