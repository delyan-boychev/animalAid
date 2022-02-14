"use strict";
const User = require("../models/user");
const City = require("../models/city");
const Thread = require("../models/thread");
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
  async getAllUsers(searchQuery, role, excludeId) {
    let query = {};
    if (searchQuery !== undefined) {
      if (role === roles.Vet) {
        query = {
          role: roles.Vet,
          $or: [
            { "name.first": { $regex: searchQuery, $options: "i" } },
            { "name.last": { $regex: searchQuery, $options: "i" } },
            { email: { $regex: searchQuery, $options: "i" } },
            { address: { $regex: searchQuery, $options: "i" } },
            { URN: { $regex: searchQuery, $options: "i" } },
          ],
        };
      } else {
        query = {
          _id: { $ne: excludeId },
          role: { $in: [roles.Admin, roles.Moderator, roles.User] },
          $or: [
            { "name.first": { $regex: searchQuery, $options: "i" } },
            { "name.last": { $regex: searchQuery, $options: "i" } },
            { email: { $regex: searchQuery, $options: "i" } },
          ],
        };
      }
      const cities = await City.find({
        $or: [
          { name: { $regex: searchQuery, $options: "i" } },
          { region: { $regex: searchQuery, $options: "i" } },
        ],
      });
      const cityIds = cities.map((city) => {
        return city._id;
      });
      query["$or"].push({ city: cityIds });
      return await User.find(query)
        .populate("city")
        .select("-password -__v -createdOn -verified")
        .lean()
        .exec();
    } else {
      if (role === roles.Vet) {
        query = {
          role: roles.Vet,
        };
      } else {
        query = {
          _id: { $ne: excludeId },
          role: { $in: [roles.Admin, roles.Moderator, roles.User] },
        };
      }
      return await User.find(query)
        .populate("city")
        .select("-password -__v -createdOn -verified")
        .lean()
        .exec();
    }
  }
  /**
   * Get vets for moderation verify
   * @returns {[]|Boolean}
   */
  async getVetsForModerationVerify() {
    const vets = await User.find({
      role: roles.Vet,
      moderationVerified: false,
    })
      .select("-password -__v -createdOn -verified")
      .lean()
      .exec();
    if (vets !== null) {
      return vets;
    } else {
      return false;
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
  /**
   * Delete thread
   * @param {String} threadId
   * @returns {Boolean}
   */
  async deleteThread(threadId) {
    try {
      await Thread.deleteOne({ _id: threadId }).exec();
      return true;
    } catch {
      return false;
    }
  }
  /**
   * Delete thread post
   * @param {String} threadId
   * @param {String} postId
   * @returns {Boolean}
   */
  async deleteThreadPost(threadId, postId) {
    try {
      let thread = await Thread.findById(threadId).exec();
      if (thread !== null) {
        if (thread.threadPosts.id(postId) !== null) {
          thread.threadPosts.id(postId).remove();
          let posts = thread.threadPosts.map((p) => {
            if (p.replyTo === postId) {
              p.replyTo = undefined;
            }
            return p;
          });
          thread.threadPosts = posts;
          await thread.save();
          return true;
        } else {
          return false;
        }
      }
    } catch {
      return false;
    }
  }
}
module.exports = AdminRepository;
