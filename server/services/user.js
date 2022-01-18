"use strict";
const userRepository = require("../repositories/user");
const captchaRepository = require("../repositories/captcha");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");
const extensionMethods = require("../extensionMethods");
const encryptDecryptCaptcha = require("../captcha/encryptDecryptCaptcha");
const config = require("../config.json");
const nodemailer = require("nodemailer");
const verifyTemplates = require("../models/emailTemplates/verifyProfile");
const forgotPasswordTemplates = require("../models/emailTemplates/forgotPassword");
const roles = require("../models/roles");
const transportMail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bganimalaid@gmail.com",
    pass: "nyyjnqksvjgpkqnd",
  },
});
const Cryptr = require("cryptr");
const fromSender = "Animal Aid <bganimalaid@gmail.com>";
class UserService {
  #userRepository = new userRepository();
  #captchaRepository = new captchaRepository();
  /**
   * Register user
   * @param {{}} user User info
   * @returns {Boolean|String}
   */
  async registerUser(user) {
    const captcha = encryptDecryptCaptcha.decryptCaptcha(user.captchaCode);
    if (captcha === user.captcha) {
      const captchaExists = await this.#captchaRepository.captchaExists(
        user.captcha,
        user.captchaCode
      );
      if (!captchaExists) {
        await this.#captchaRepository.saveCaptcha(
          user.captcha,
          user.captchaCode
        );
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
          const cryptr = new Cryptr(config.ENCRYPTION_KEY);
          const key = cryptr.encrypt(user.email);
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
            .toFile(`${dir}/${imgFileName}`, function (err) {
              if (err) console.log(err);
            });
        }
        return isReg;
      } else {
        return "INVALID_CAPTCHA";
      }
    } else {
      return "INVALID_CAPTCHA";
    }
  }
  /**
   * Get vet profile
   * @param {String} id User id
   * @returns {{}}
   */
  async getVet(id) {
    return await this.#userRepository.getVet(id);
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
   * @param {{}} user User info
   * @returns {Boolean|String}
   */
  async registerVet(user) {
    const captcha = encryptDecryptCaptcha.decryptCaptcha(user.captchaCode);
    if (captcha === user.captcha) {
      const captchaExists = await this.#captchaRepository.captchaExists(
        user.captcha,
        user.captchaCode
      );
      if (!captchaExists) {
        await this.#captchaRepository.saveCaptcha(
          user.captcha,
          user.captchaCode
        );
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
          const cryptr = new Cryptr(config.ENCRYPTION_KEY);
          const key = cryptr.encrypt(user.email);
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
    const cryptr = new Cryptr(config.ENCRYPTION_KEY);
    try {
      const email = cryptr.decrypt(key);
      return await this.#userRepository.verify(email);
    } catch {
      return false;
    }
  }
  /**
   * Login user
   * @param {{}} user User info
   * @returns {Boolean|String}
   */
  async loginUser(user) {
    const captcha = encryptDecryptCaptcha.decryptCaptcha(user.captchaCode);
    if (captcha === user.captcha) {
      const captchaExists = await this.#captchaRepository.captchaExists(
        user.captcha,
        user.captchaCode
      );
      if (!captchaExists) {
        await this.#captchaRepository.saveCaptcha(
          user.captcha,
          user.captchaCode
        );
        const u = await this.#userRepository.loginUser(user);
        if (u !== false) {
          if (u.verified) {
            if (u.role === roles.Vet) {
              if (u.moderationVerified === false) {
                return "PROFILE_NOT_MODERATION_VERIFIED";
              }
            }
            const cryptr = new Cryptr(config.TOKEN_ENCRYPTION);
            const token = cryptr.encrypt(
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
    } else {
      return "INVALID_CAPTCHA";
    }
  }
  /**
   * Get user profile
   * @param {String} id User id
   * @returns {{}}
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
    const cryptr = new Cryptr(config.TOKEN_ENCRYPTION);
    try {
      const decoded = cryptr.decrypt(token).split(";");
      if (parseInt(decoded[1]) > parseInt(new Date().getTime() / 1000)) {
        return false;
      } else {
        const refreshToken = cryptr.encrypt(
          `${decoded[0]};${parseInt(new Date().getTime() / 1000) + 1800}`
        );
        return refreshToken;
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
  async edit(prop, value, id) {
    return await this.#userRepository.edit(prop, value, id);
  }
  /**
   * Validate forgot password token
   * @param {String} token Forgot password token
   * @returns {{}}
   */
  async validateForgotPasswordToken(token) {
    const cryptr = new Cryptr(config.ENCRYPTION_KEY);
    try {
      const decoded = JSON.parse(cryptr.decrypt(token));
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
    } catch {
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
        const cryptr = new Cryptr(config.ENCRYPTION_KEY);
        const token = cryptr.encrypt(
          JSON.stringify({
            email: email,
            exp: parseInt(new Date().getTime() / 1000) + 900,
          })
        );
        transportMail.sendMail({
          from: fromSender,
          to: email,
          subject: "Забравена парола в Animal Aid",
          html: forgotPasswordTemplates.forgotPasswordEmail(token),
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
      const cryptr = new Cryptr(config.ENCRYPTION_KEY);
      const key = cryptr.encrypt(newEmail);
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
   * Get vet profiles
   * @param {Number} pageNum Number of the page
   * @returns {[]}
   */
  async getVets(pageNum) {
    const vets = await this.#userRepository.getVets();
    const startIndex = pageNum * 10 - 10;
    const endIndex = pageNum * 10;
    const numPages = Math.ceil(vets.length / 10);
    if (
      pageNum < 1 ||
      (vets.length < endIndex && vets.length < startIndex) ||
      pageNum > numPages
    ) {
      return false;
    } else if (vets.length < endIndex && vets.length > startIndex) {
      return { vets: vets.slice(startIndex, vets.length), numPages };
    } else {
      return { vets: vets.slice(startIndex, endIndex), numPages };
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
   * @param {{}} img Data url img and crop
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
      fs.unlinkSync(`${dir}/${oldImgFileName}`);
      return true;
    } else {
      return false;
    }
  }
}
module.exports = UserService;
