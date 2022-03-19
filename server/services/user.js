"use strict";
const userRepository = require("../repositories/user");
const captchaRepository = require("../repositories/captcha");
const path = require("path");
const fs = require("fs");
const simdjson = require("simdjson");
const encryptToken = require("../encryption/tokenEncryption").encryptToken;
const decryptToken = require("../encryption/tokenEncryption").decryptToken;
const encryptString = require("../encryption/stringEncryption").encryptString;
const decryptString = require("../encryption/stringEncryption").decryptString;
const sharp = require("sharp");
const extensionMethods = require("../extensionMethods");
const getPageFromArr = require("../extensionMethods").getPageFromArr;
const config = require("../config.json");
const nodemailer = require("nodemailer");
const verifyTemplates = require("../models/emailTemplates/verifyProfile");
const forgotPasswordEmail = require("../models/emailTemplates/forgotPassword");
const roles = require("../models/roles");
const transportMail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.EMAIL_INFO.EMAIL,
    pass: config.EMAIL_INFO.PASSWORD,
  },
});
const fromSender = config.EMAIL_INFO.EMAIL_SENDER;
class UserService {
  #userRepository = new userRepository();
  #captchaRepository = new captchaRepository();
  /**
   * Register user
   * @param {Object} user User info
   * @returns {Boolean|String}
   */
  async registerUser(user) {
    const validateCaptcha = await this.#captchaRepository.validateCaptcha(
      user.captcha,
      user.captchaCode
    );
    if (validateCaptcha) {
      let imgFileName = `${new Date().getTime()}${extensionMethods.randomString(
        8
      )}.webp`;
      let dir = `${path.dirname(require.main.filename)}/img`;
      while (fs.existsSync(`${dir}\\${imgFileName}`)) {
        imgFileName = `${new Date().getTime()}${extensionMethods.randomString(
          8
        )}.webp}`;
      }
      user.imgFileName = imgFileName;
      user.role = "User";
      const isReg = await this.#userRepository.register(user);
      if (isReg === true) {
        const key = encryptString(user.email);
        transportMail.sendMail({
          from: fromSender,
          to: user.email,
          subject: "Успешна регистрация в Animal Aid",
          html: verifyTemplates.verifyProfileUser(user.name.first, key),
        });
        let base64Data = user.imgDataURL.split("base64,")[1];
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }
        sharp(Buffer.from(base64Data, "base64"))
          .extract({
            top: user.imageCrop.y,
            left: user.imageCrop.x,
            width: user.imageCrop.width,
            height: user.imageCrop.height,
          })
          .webp()
          .toFile(`${dir}/${imgFileName}`);
      }
      return isReg;
    } else {
      return "INVALID_CAPTCHA";
    }
  }
  /**
   * Get vet profile
   * @param {String} id User id
   * @returns {Object}
   */
  async getVet(id) {
    return await this.#userRepository.getVet(id);
  }
  /**
   * Count users and vets
   */
  async countUsersAndVets() {
    return await this.#userRepository.countUsersAndVets();
  }
  /**
   * Get user role
   * @param {String} id User id
   * @returns {String}
   */
  async getRole(id) {
    return await this.#userRepository.getRole(id);
  }
  /**
   * Register vet
   * @param {Object} user User info
   * @returns {Boolean|String}
   */
  async registerVet(user) {
    const validateCaptcha = await this.#captchaRepository.validateCaptcha(
      user.captcha,
      user.captchaCode
    );
    if (validateCaptcha) {
      let imgFileName = `${new Date().getTime()}${extensionMethods.randomString(
        8
      )}.webp`;
      let dir = `${path.dirname(require.main.filename)}/img`;
      while (fs.existsSync(`${dir}\\${imgFileName}`)) {
        imgFileName = `${new Date().getTime()}${extensionMethods.randomString(
          8
        )}.webp`;
      }
      user.imgFileName = imgFileName;
      user.role = "Vet";
      const isReg = await this.#userRepository.register(user);
      if (isReg === true) {
        const key = encryptString(user.email);
        transportMail.sendMail({
          from: fromSender,
          to: user.email,
          subject: "Успешна регистрация в Animal Aid",
          html: verifyTemplates.verifyProfileVet(user.name.first, key),
        });
        let base64Data = user.imgDataURL.split("base64,")[1];
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir);
        }
        sharp(Buffer.from(base64Data, "base64"))
          .extract({
            top: user.imageCrop.y,
            left: user.imageCrop.x,
            width: user.imageCrop.width,
            height: user.imageCrop.height,
          })
          .webp()
          .toFile(`${dir}/${imgFileName}`, function (err) {
            if (err) console.log(err);
          });
      }
      return isReg;
    } else {
      return "INVALID_CAPTCHA";
    }
  }
  /**
   * Profile verification
   * @param {String} key Key for verification
   * @returns {Boolean}
   */
  async verifyProfile(key) {
    const email = decryptString(key);
    if (email !== "") {
      return await this.#userRepository.verify(email);
    } else {
      return false;
    }
  }
  /**
   * Login user
   * @param {Object} user User info
   * @returns {Boolean|String}
   */
  async loginUser(user) {
    const validateCaptcha = await this.#captchaRepository.validateCaptcha(
      user.captcha,
      user.captchaCode
    );
    if (validateCaptcha) {
      const u = await this.#userRepository.loginUser(user);
      if (u !== false) {
        if (u.verified) {
          if (u.role === roles.Vet) {
            if (u.moderationVerified === false) {
              return "PROFILE_NOT_MODERATION_VERIFIED";
            }
          }
          const token = encryptToken(
            `${u._id};${parseInt(new Date().getTime() / 1000) + 1800}`
          );
          return token;
        } else {
          return "PROFILE_NOT_VERIFIED";
        }
      } else {
        return false;
      }
    } else {
      return "INVALID_CAPTCHA";
    }
  }
  /**
   * Get user profile
   * @param {String} id User id
   * @returns {Object}
   */
  async getProfile(id) {
    return await this.#userRepository.getProfile(id);
  }
  /**
   *
   * @param {String} token
   * @returns {String|Boolean}
   */
  refreshToken(token) {
    const decoded = decryptToken(token).split(";");
    if (decoded[0] !== "") {
      if (parseInt(decoded[1]) > parseInt(new Date().getTime() / 1000)) {
        return "TOO_EARLY";
      } else {
        const refreshToken = encryptToken(
          `${decoded[0]};${parseInt(new Date().getTime() / 1000) + 1800}`
        );
        return refreshToken;
      }
    } else {
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
  async edit(prop, value, id) {
    return await this.#userRepository.edit(prop, value, id);
  }
  /**
   * Validate forgot password token
   * @param {String} token Forgot password token
   * @returns {Object}
   */
  async validateForgotPasswordToken(token) {
    let decoded = decryptString(token);
    if (decoded !== "") {
      decoded = simdjson.parse(decoded);
      if (decoded["exp"] != undefined && decoded["email"] != undefined) {
        if (decoded["exp"] < parseInt(new Date().getTime() / 1000)) {
          return { isValid: false, email: "" };
        } else {
          const res =
            await this.#userRepository.checkUserExistsAndLastForgotPassword(
              decoded["email"]
            );
          if (res === "TOO_EARLY") {
            return { isValid: false, email: "" };
          } else {
            return { isValid: res, email: decoded["email"] };
          }
        }
      } else {
        return { isValid: false, email: "" };
      }
    } else {
      return { isValid: false, email: "" };
    }
  }
  /**
   * Change forgot password
   * @param {String} token Forgot password token
   * @param {String} newPassword New password
   * @returns {Boolean}
   */
  async forgotPasswordChange(token, newPassword) {
    const isValid = await this.validateForgotPasswordToken(token);
    if (isValid["isValid"]) {
      const res = await this.#userRepository.changeForgotPassword(
        isValid["email"],
        newPassword
      );
      return res;
    } else {
      return false;
    }
  }
  /**
   * Request for forgot password
   * @param {String} email User email
   * @returns {Boolean}
   */
  async requestForgotPassword(email) {
    const userExists =
      await this.#userRepository.checkUserExistsAndLastRequestForgotPassword(
        email
      );
    if (userExists === true) {
      const isSet = await this.#userRepository.setLastRequestForgotPassword(
        email
      );
      if (isSet) {
        const token = encryptString(
          JSON.stringify({
            email: email,
            exp: parseInt(new Date().getTime() / 1000) + 900,
          })
        );
        transportMail.sendMail({
          from: fromSender,
          to: email,
          subject: "Забравена парола в Animal Aid",
          html: forgotPasswordEmail(token),
        });
        return true;
      } else {
        return false;
      }
    } else {
      return userExists;
    }
  }
  /**
   * Change user email
   * @param {String} newEmail New user email
   * @param {String} password User password
   * @param {String} id User id
   * @returns {Boolean|String}
   */
  async changeEmail(newEmail, password, id) {
    const changeEmailRes = await this.#userRepository.changeEmail(
      { id: id, password: password },
      newEmail
    );
    if (changeEmailRes === true) {
      const key = encryptString(newEmail);
      transportMail.sendMail({
        from: fromSender,
        to: newEmail,
        subject: "Смяна на имейл адрес в Animal Aid",
        html: verifyTemplates.verifyProfileChangeEmail(key),
      });
      return true;
    } else if (changeEmailRes === "EXISTS") {
      return "EXISTS";
    } else {
      return false;
    }
  }
  /**
   * Get vets around user
   * @param {Number} pageNum
   * @param {String} userId
   * @param {String} searchQuery
   * @returns {Object|Boolean}
   */
  async getVetsAroundUser(pageNum, userId, searchQuery) {
    const vets = await this.#userRepository.getVetsAroundUser(
      userId,
      searchQuery
    );
    if (vets !== false) {
      return getPageFromArr(vets, 10, pageNum, "vets");
    }
    {
      return false;
    }
  }
  /**
   * Get vet profiles
   * @param {Number} pageNum Number of the page
   * @returns {Object|Boolean}
   */
  async getVets(pageNum, searchQuery, createAppointments) {
    const vets = await this.#userRepository.getVets(
      searchQuery,
      createAppointments
    );
    if (vets !== false) {
      return getPageFromArr(vets, 10, pageNum, "vets");
    }
    {
      return false;
    }
  }
  /**
   * Change user password
   * @param {String} id User id
   * @param {String} oldPassword Old user password
   * @param {String} newPassword New user password
   * @returns {Boolean}
   */
  async changePassword(id, oldPassword, newPassword) {
    return await this.#userRepository.changePassword(
      id,
      oldPassword,
      newPassword
    );
  }
  /**
   * Change profile photo
   * @param {String} id User id
   * @param {Object} img Data url img and crop
   * @returns {Boolean}
   */
  async changeProfilePhoto(id, img) {
    let imgFileName = `${new Date().getTime()}${extensionMethods.randomString(
      8
    )}.webp`;
    let dir = `${path.dirname(require.main.filename)}/img`;
    while (fs.existsSync(`${dir}\\${imgFileName}`)) {
      imgFileName = `${new Date().getTime()}${extensionMethods.randomString(
        8
      )}.webp`;
    }
    const oldImgFileName = await this.#userRepository.changeProfilePhoto(
      id,
      imgFileName
    );
    if (oldImgFileName !== false) {
      let base64Data = img.imgDataURL.split("base64,")[1];
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      sharp(Buffer.from(base64Data, "base64"))
        .extract({
          top: img.imageCrop.y,
          left: img.imageCrop.x,
          width: img.imageCrop.width,
          height: img.imageCrop.height,
        })
        .webp()
        .toFile(`${dir}/${imgFileName}`, function (err) {
          if (err) console.log(err);
        });
      if (fs.existsSync(`${dir}/${oldImgFileName}`)) {
        fs.unlinkSync(`${dir}/${oldImgFileName}`);
      }
      return true;
    } else {
      return false;
    }
  }
}
module.exports = UserService;
