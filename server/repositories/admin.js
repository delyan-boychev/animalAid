"use strict";
const bcrypt = require("bcrypt");
const User = require("../models/user");
const City = require("../models/city");
const roles = require("../models/roles");
const ChatRepository = require("./chat");
class AdminRepository {
  #chatRepository = new ChatRepository();
  /**
   * Moderation verify vet
   * @param {String} email Vet email
   * @returns {Boolean}
   */
  async moderationVerify(email) {
    const u = await User.findOne({ email: email }).exec();
    if (u != null) {
      if (u.role === roles.Vet) {
        if (!u.moderationVerified) {
          u.moderationVerified = true;
          try {
            await u.save();
            return true;
          } catch {
            return false;
          }
        } else {
          return false;
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  /**
   * Get all users
   * @param {String} searchQuery Search query
   * @returns {[]}
   */
  async getAllUsers(searchQuery) {
    if (searchQuery !== undefined) {
      if (searchQuery["$or"] !== undefined) {
        if (searchQuery["$or"][3]["city"] !== undefined) {
          const cities = await City.find({
            $or: [
              { name: { $regex: searchQuery["$or"][3]["city"]["$regex"] } },
              { region: { $regex: searchQuery["$or"][3]["city"]["$regex"] } },
            ],
          });
          const cityIds = cities.map((city) => {
            return city._id;
          });
          searchQuery["$or"][3]["city"] = cityIds;
        }
      }
      return await User.find(searchQuery)
        .populate("city")
        .select("-password -__v -createdOn -verified")
        .lean()
        .exec();
    } else {
      return await User.find()
        .populate("city")
        .select("-password -__v -createdOn -verified")
        .lean()
        .exec();
    }
  }
  /**
   * Change user role
   * @param {String} id User id
   * @param {String} newRole New role
   * @returns {Boolean}
   */
  async changeRole(id, newRole) {
    try {
      const u = await User.findById(id).exec();
      if (u !== null) {
        if (u.role === roles.Vet) {
          u.address = undefined;
          u.URN = undefined;
          u.typeAnimals = undefined;
          u.vetDescription = undefined;
          u.moderationVerified = undefined;
          await this.#chatRepository.deleteChat(id);
        }
        u.role = newRole;
        try {
          await u.save();
          return true;
        } catch {
          return false;
        }
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }
  /**
   * Get user profile
   * @param {String} id User id
   * @returns {}
   */
  async getProfile(id) {
    try {
      let user = await User.findById(id)
        .populate("city")
        .select(["-password"])
        .lean()
        .exec();
      if (user == null) {
        return false;
      } else {
        return user;
      }
    } catch {
      return false;
    }
  }
  /**
   * Edit property profile
   * @param {String} prop Name of the property for edit
   * @param {String} value New value of the property
   * @param {String} id User id
   * @returns {Boolean}
   */
  async editUser(prop, value, id) {
    const u = await User.findById(id).exec();
    if (u !== null) {
      switch (prop) {
        case "fName":
          u.name.first = value;
          break;
        case "lName":
          u.name.last = value;
          break;
        case "city":
          u.city = value;
          break;
        case "email":
          if (!(await User.exists({ email: value }))) {
            u.email = value;
          } else {
            return "EMAIL_EXISTS";
          }
          break;
        case "phoneNumber":
          u.phoneNumber = value;
          break;
        case "address":
          if (u.role === roles.Vet) {
            u.address = value;
          } else {
            return false;
          }
          break;
        case "vetDescription":
          if (u.role === roles.Vet) {
            u.vetDescription = value;
          } else {
            return false;
          }
          break;
        case "URN":
          if (u.role === roles.Vet) {
            if (!(await User.exists({ URN: value }))) {
              u.URN = value;
            } else {
              return "URN_EXISTS";
            }
          } else {
            return false;
          }
          break;
        case "typeAnimals":
          if (u.role === roles.Vet) {
            u.typeAnimals = value;
          } else {
            return false;
          }
          break;
        default:
          return false;
      }
      try {
        await u.save();
        return true;
      } catch {
        return false;
      }
    } else {
      return false;
    }
  }
  /**
   * Change profile photo
   * @param {String} id User id
   * @param {String} imgFileName File name image
   * @returns {String|Boolean}
   */
  async changeProfilePhoto(id, imgFileName) {
    const u = await User.findById(id).exec();
    if (u !== null) {
      const oldImgFileName = u.imgFileName;
      u.imgFileName = imgFileName;
      u.save();
      return oldImgFileName;
    } else {
      return false;
    }
  }
}
module.exports = AdminRepository;
