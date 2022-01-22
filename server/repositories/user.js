"use strict";
const bcrypt = require("bcrypt");
const User = require("../models/user");
const roles = require("../models/roles");
class UserRepository {
  async register(user) {
    if (await User.exists({ email: user.email })) {
      return "EMAIL_EXISTS";
    } else {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(user.password, salt);
      user.password = hash;
      user.role = roles[user.role];
      if (user.role === roles.Vet) {
        const exists = await User.exists({ URN: user.URN });
        if (exists) {
          return "URN_EXISTS";
        }
        user.moderationVerified = false;
      }
      user.verified = false;
      let u = new User(user);
      try {
        await u.save();
        return true;
      } catch {
        return false;
      }
    }
  }
  async checkUserExists(userId) {
    try {
      return await User.exists({ _id: userId });
    } catch {
      return false;
    }
  }
  async checkUserExistsAndLastRequestForgotPassword(email) {
    let user = await User.findOne({ email: email }).exec();
    if (user != null) {
      if (user.lastRequestForgotPassword) {
        if (
          user.lastRequestForgotPassword + 86400 <
          parseInt(new Date().getTime() / 1000)
        ) {
          return true;
        } else {
          return "TOO_EARLY";
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
  async getVet(id) {
    try {
      const user = await User.findOne({
        _id: id,
        role: roles.Vet,
        moderationVerified: true,
      })
        .populate("city")
        .lean();
      if (user !== null) {
        user.password = undefined;
        return user;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }
  async checkUserExistsAndLastForgotPassword(email) {
    let user = await User.findOne({ email: email }).exec();
    if (user != null) {
      if (user.lastForgotPassword) {
        if (
          user.lastForgotPassword + 86400 <
          parseInt(new Date().getTime() / 1000)
        ) {
          return true;
        } else {
          return "TOO_EARLY";
        }
      } else {
        return true;
      }
    } else {
      return false;
    }
  }
  async setLastRequestForgotPassword(email) {
    let u = await User.findOne({ email: email }).exec();
    if (u !== null) {
      u.lastRequestForgotPassword = parseInt(new Date().getTime() / 1000);
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
  async getProfile(id) {
    try {
      let user = await User.findById(id).populate("city").lean().exec();
      if (user == null) {
        return false;
      } else {
        user.password = undefined;
        return user;
      }
    } catch {
      return false;
    }
  }
  async loginUser(user) {
    const u = await User.findOne({ email: user.email }).exec();
    if (u !== null) {
      const checkPass = bcrypt.compareSync(user.password, u.password);
      if (checkPass) {
        u.password = undefined;
        return u;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  async verify(email) {
    const u = await User.findOne({ email: email }).exec();
    if (u != null) {
      if (!u.verified) {
        u.verified = true;
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
  }
  async getVets() {
    const vets = await User.find({ role: roles.Vet, moderationVerified: true })
      .populate("city")
      .select(["-password"])
      .lean()
      .exec();
    return vets;
  }
  async changeEmail(user, newEmail) {
    const u = await User.findById(user.id).exec();
    if (u !== null) {
      const checkPass = bcrypt.compareSync(user.password, u.password);
      if (checkPass) {
        const u2 = await User.findOne({ email: newEmail }).exec();
        if (u2 === null) {
          u.email = newEmail;
          u.verified = false;
          try {
            await u.save();
            return true;
          } catch {
            return false;
          }
        } else {
          return "EXISTS";
        }
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  async changeForgotPassword(email, newPassword) {
    const u = await User.findOne({ email: email }).exec();
    if (u !== null) {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(newPassword, salt);
      u.password = hash;
      u.lastForgotPassword = parseInt(new Date().getTime() / 1000);
      u.lastRequestForgotPassword = u.lastForgotPassword;
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
  async changePassword(id, oldPassword, newPassword) {
    const u = await User.findById(id).exec();
    if (u !== null) {
      const checkPass = bcrypt.compareSync(oldPassword, u.password);
      if (checkPass) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(newPassword, salt);
        u.password = hash;
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
  }
  async getRole(id) {
    try {
      const u = await User.findById(id).exec();
      if (u !== null) {
        return u.role;
      } else {
        return false;
      }
    } catch {
      return false;
    }
  }
  async edit(prop, value, id) {
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
module.exports = UserRepository;
