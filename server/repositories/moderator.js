"use strict";
const User = require("../models/user");
const City = require("../models/city");
const Thread = require("../models/thread");
const FundraisingCampaign = require("../models/fundraisingCampaign");
const roles = require("../models/roles");
const ChatRepository = require("./chat");
class ModeratorRepository {
  #chatRepository = new ChatRepository();
  /**
   * Moderation verify vet
   * @param {String} email Vet email
   * @returns {Boolean}
   */
  async moderationVerifyVet(email) {
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
   * @returns {Object[]}
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
    return await User.find({
      role: roles.Vet,
      moderationVerified: false,
    })
      .populate("city")
      .select("-password -__v -createdOn -verified")
      .lean()
      .exec();
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
   * @returns {Object}
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
   * Deactivate profile
   * @param {String} id
   * @returns {Boolean}
   */
  async deactivateProfile(id) {
    try {
      const deactivated = await User.updateOne(
        { _id: id, active: true, role: { $ne: roles.Admin } },
        { active: false }
      ).exec();
      if (deactivated.modifiedCount > 0) {
        return true;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }
  /**
   * Activate profile
   * @param {String} id
   * @returns {Boolean}
   */
  async activateProfile(id) {
    try {
      const activated = await User.updateOne(
        { _id: id, active: false, role: { $ne: roles.Admin } },
        { active: true }
      ).exec();
      if (activated.modifiedCount > 0) {
        return true;
      } else {
        return false;
      }
    } catch {
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
      const d = await Thread.deleteOne({ _id: threadId }).exec();
      if (d.deletedCount > 0) {
        return true;
      } else {
        return false;
      }
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
  /**
   * Get campaign
   * @param {String} campaignId
   * @returns {Object}
   */
  async getCampaign(campaignId) {
    try {
      const campaign = FundraisingCampaign.findById(campaignId)
        .populate("user", "-password")
        .lean()
        .exec();
      if (campaign !== null) {
        return campaign;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }
  /**
   * Get all fundraising campaigns
   * @param {String} searchQuery
   * @returns {Object[]}
   */
  async getAllCampaigns(searchQuery) {
    let query = {};
    if (searchQuery !== undefined) {
      query = {
        $or: [
          { title: { $regex: searchQuery, $options: "i" } },
          { shortDescription: { $regex: searchQuery, $options: "i" } },
        ],
      };
    }
    return await FundraisingCampaign.find(query)
      .select("title shortDescription mainPhoto")
      .lean()
      .exec();
  }
  /**
   * Get fundraising campaigns for moderation verify
   * @returns {Object[]}
   */
  async getCampaignsForModerationVerify() {
    return await FundraisingCampaign.find({
      moderationVerified: false,
      rejectedComment: { $eq: "" },
    }).select("title shortDescription mainPhoto value");
  }
  /**
   * Moderation verify fundraising campaign
   * @param {String} campaignId
   * @returns {Boolean|Object}
   */
  async moderationVerifyFundraisingCampaign(
    campaignId,
    verified,
    rejectedComment
  ) {
    try {
      const campaign = await FundraisingCampaign.findById(campaignId)
        .populate("user", "name email")
        .exec();
      if (campaign !== null) {
        if (campaign.moderationVerified === false) {
          if (verified === false) {
            campaign.rejectedComment = rejectedComment;
          } else {
            campaign.expireAt = parseInt(new Date().getTime() / 1000) + 2629743;
          }
          campaign.moderationVerified = verified;
          await campaign.save();
          return campaign.toObject();
        } else {
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
   * Complete fundraising campaign
   * @param {String} campaignId
   * @returns {Boolean}
   */
  async completeFundraisingCampaign(campaignId) {
    try {
      const campaign = await FundraisingCampaign.findById(campaignId).exec();
      if (campaign !== null) {
        if (campaign.completed === false) {
          campaign.rejectedComment = "";
          campaign.expireAt = parseInt(new Date().getTime() / 1000);
          campaign.completed = true;
          await campaign.save();
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }
}
module.exports = ModeratorRepository;
