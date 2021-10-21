const userRepository = require("../repositories/user");
const path = require("path");
const fs = require("fs");
const extenstionMethods = require("../extensionMethods");
const config = require("../config.json");
const nodemailer = require("nodemailer");
const verifyTemplates = require("../models/emailTemplates/verifyProfile");
const forgotPasswordTemplates = require("../models/emailTemplates/forgotPassword");
const transportMail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "bganimalaid@gmail.com",
    pass: "kcyatskxnwbxtfhx",
  },
});
const Cryptr = require("cryptr");
const fromSender = "Animal Aid <bganimalaid@gmail.com>";
class UserService {
  #userRepository = new userRepository();
  async registerUser(user) {
    let regexImageUrl = /data:(?<mime>[\w/\-\.]+);(?<encoding>\w+),(?<data>.*)/;
    const match = regexImageUrl.exec(user.imgDataURL);
    const imgFileName = `${new Date().getTime()}${extenstionMethods.randomString(
      8
    )}.${match.groups["mime"].replace("image/", "")}`;
    user.imgFileName = imgFileName;
    user.role = "User";
    const isReg = await this.#userRepository.register(user);
    if (isReg) {
      const cryptr = new Cryptr(config.ENCRYPTION_KEY);
      const key = cryptr.encrypt(user.email);
      transportMail.sendMail({
        from: fromSender,
        to: user.email,
        subject: "Успешна регистрация в Animal Aid",
        html: verifyTemplates.verifyProfileUser(user.name.first, key),
      });
      let base64Data = user.imgDataURL.replace(
        `data:${match.groups["mime"]};base64,`,
        ""
      );
      let dir = `${path.dirname(
        require.main.filename || process.mainModule.filename
      )}\\img`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      fs.writeFileSync(`${dir}\\${imgFileName}`, base64Data, "base64");
    }
    return isReg;
  }
  async getRole(id) {
    return await this.#userRepository.getRole(id);
  }
  async registerVet(user) {
    let regexImageUrl = /data:(?<mime>[\w/\-\.]+);(?<encoding>\w+),(?<data>.*)/;
    const match = regexImageUrl.exec(user.imgDataURL);
    const imgFileName = `${new Date().getTime()}${extenstionMethods.randomString(
      8
    )}.${match.groups["mime"].replace("image/", "")}`;
    user.imgFileName = imgFileName;
    user.role = "Vet";
    const isReg = await this.#userRepository.register(user);
    if (isReg) {
      const cryptr = new Cryptr(config.ENCRYPTION_KEY);
      const key = cryptr.encrypt(user.email);
      transportMail.sendMail({
        from: fromSender,
        to: user.email,
        subject: "Успешна регистрация в Animal Aid",
        html: verifyTemplates.verifyProfileVet(user.name.first, key),
      });
      let base64Data = user.imgDataURL.replace(
        `data:${match.groups["mime"]};base64,`,
        ""
      );
      let dir = `${path.dirname(
        require.main.filename || process.mainModule.filename
      )}\\img`;
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      fs.writeFileSync(`${dir}\\${imgFileName}`, base64Data, "base64");
    }
    return isReg;
  }
  async verifyProfile(key) {
    const cryptr = new Cryptr(config.ENCRYPTION_KEY);
    try {
      const email = cryptr.decrypt(key);
      return await this.#userRepository.verify(email);
    } catch {
      return false;
    }
  }
  async loginUser(user) {
    const u = await this.#userRepository.loginUser(user);
    if (u !== false) {
      if (u.verified) {
        const cryptr = new Cryptr(config.TOKEN_ENCRYPTION);
        const token = cryptr.encrypt(
          JSON.stringify({
            user: { id: u._id },
            exp: parseInt(new Date().getTime() / 1000) + 1800,
          })
        );
        return token;
      } else {
        return "PROFILE_NOT_VERIFIED";
      }
    } else {
      return false;
    }
  }
  async getProfile(id) {
    return await this.#userRepository.getProfile(id);
  }
  refreshToken(token) {
    const cryptr = new Cryptr(config.TOKEN_ENCRYPTION);
    try {
      const decoded = JSON.parse(cryptr.decrypt(token));
      if (decoded["exp"] > parseInt(new Date().getTime() / 1000)) {
        return false;
      } else {
        const refreshToken = cryptr.encrypt(
          JSON.stringify({
            user: decoded["user"],
            exp: parseInt(new Date().getTime() / 1000) + 1800,
          })
        );
        return refreshToken;
      }
    } catch {
      return false;
    }
  }
  async edit(prop, value, id) {
    return await this.#userRepository.edit(prop, value, id);
  }
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
        subject: "Смяна на имейл в Animal Aid",
        html: verifyTemplates.verifyProfileChangeEmail(key),
      });
      return true;
    } else if (changeEmailRes === "EXISTS") {
      return "EXISTS";
    } else {
      return false;
    }
  }
  async changePassword(id, oldPassword, newPassword) {
    return await this.#userRepository.changePassword(
      id,
      oldPassword,
      newPassword
    );
  }
}
module.exports = UserService;
