"use strict";
const nodemailer = require("nodemailer");
const config = require("../config.json");
const VetRepository = require("../repositories/vet");
const getPageFromArr = require("../extensionMethods").getPageFromArr;
const moment = require("moment");
const {
  appointmentConfirmed,
  appointmentRejected,
} = require("../models/emailTemplates/appointmentConfirmation");
const transportMail = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.EMAIL_INFO.EMAIL,
    pass: config.EMAIL_INFO.PASSWORD,
  },
});
const fromSender = config.EMAIL_INFO.EMAIL_SENDER;
class VetService {
  #vetRepository = new VetRepository();
  /**
   * Create schedule
   * @param {String} vetId
   * @param {Object} scheduleVet
   * @returns {Boolean}
   */
  async createSchedule(vetId, scheduleVet) {
    let schedule = {};
    let step = scheduleVet["step"];
    Object.keys(scheduleVet)
      .filter((e) => e !== "typeAppointments" && e !== "step")
      .forEach((key) => {
        if (scheduleVet[key]["working"] === true) {
          let startHour = scheduleVet[key]["startHour"];
          let endHour = scheduleVet[key]["endHour"];
          let day = scheduleVet[key];
          if (startHour < endHour) {
            schedule[key] = [];
            if (day["pause"]) {
              let pauseStartHour = day["pause"]["startHour"];
              let pauseEndHour = day["pause"]["endHour"];
              if (
                pauseEndHour - pauseStartHour >= endHour - startHour ||
                pauseStartHour < startHour ||
                pauseEndHour > endHour
              ) {
                throw new Error();
              } else {
                let pauseEnded = false;
                while (startHour + step <= endHour) {
                  if (
                    startHour + step > pauseStartHour &&
                    pauseEnded === false
                  ) {
                    startHour = pauseEndHour;
                    pauseEnded = true;
                  }
                  schedule[key].push({
                    startHour: startHour,
                    endHour: startHour + step,
                  });
                  startHour += step;
                }
                if (schedule[key].length === 0) {
                  throw new Error();
                }
              }
            } else {
              while (startHour + step <= endHour) {
                schedule[key].push({
                  startHour: startHour,
                  endHour: startHour + step,
                });
                startHour += step;
              }
              if (schedule[key].length === 0) {
                throw new Error();
              }
            }
          } else {
            throw new Error();
          }
        }
      });
    if (Object.keys(schedule).length === 0) {
      throw new Error();
    }
    return await this.#vetRepository.createSchedule(vetId, {
      ...schedule,
      typeAppointments: scheduleVet.typeAppointments,
    });
  }
  /**
   * Create appointment
   * @param {String} userId
   * @param {String} appointment
   * @returns {Boolean}
   */
  async createAppointment(userId, appointment) {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + 1);
    let date1 = date.getTime();
    date.setDate(date.getDate() + 14);
    let date2 = date.getTime();
    appointment.date = moment(appointment.date, "DD-MM-YYYY").toDate();
    if (
      date1 <= appointment.date.getTime() &&
      date2 >= appointment.date.getTime()
    ) {
      return this.#vetRepository.createAppointment(userId, appointment);
    } else {
      return false;
    }
  }
  /**
   * Check vet and schedule
   * @param {String} vetId
   * @returns {Object}
   */
  async checkVetAndSchedule(vetId) {
    return await this.#vetRepository.checkVetAndSchedule(vetId);
  }
  /**
   * Get hours
   * @param {String} vetId
   * @param {String} date
   * @returns {Object|Boolean}
   */
  async getHours(vetId, date) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 1);
    let d1 = d.getTime();
    d.setDate(d.getDate() + 14);
    let d2 = d.getTime();
    date = moment(date, "DD-MM-YYYY").toDate();
    if (d1 <= date.getTime() && d2 >= date.getTime()) {
      return this.#vetRepository.getHours(vetId, date);
    } else {
      return false;
    }
  }
  /**
   * Get appointments
   * @param {String} vetId
   * @param {String} date
   * @returns {Object|Boolean}
   */
  async getAppointments(vetId, date) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    let d1 = d.getTime();
    d.setDate(d.getDate() + 14);
    let d2 = d.getTime();
    date = moment(date, "DD-MM-YYYY").toDate();
    if (d1 <= date.getTime() && d2 >= date.getTime()) {
      return this.#vetRepository.getAppointmentsByVet(vetId, date);
    } else {
      return false;
    }
  }
  /**
   * Get upcoming appointments
   * @param {String} userId
   * @param {Number} pageNum
   * @returns {Object|Boolean}
   */
  async getUpcomingAppointments(userId, pageNum) {
    const appointments = await this.#vetRepository.getAppointments({
      user: userId,
      date: { $gt: new Date().toISOString() },
    });
    if (appointments !== false) {
      return getPageFromArr(appointments, 10, pageNum, "appointments");
    } else {
      return false;
    }
  }
  /**
   *  Get past appointments
   * @param {String} userId
   * @param {Number} pageNum
   * @returns {Object|Boolean}
   */
  async getPastAppointments(userId, pageNum) {
    const appointments = await this.#vetRepository.getAppointments({
      user: userId,
      date: { $lte: new Date().toISOString() },
    });
    if (appointments !== false) {
      return getPageFromArr(appointments, 10, pageNum, "appointments");
    } else {
      return false;
    }
  }
  /**
   * Remove appointment
   * @param {String} userId
   * @param {String} appointmentId
   * @returns {Boolean}
   */
  async removeAppointment(userId, appointmentId) {
    return await this.#vetRepository.removeAppointment(userId, appointmentId);
  }
  /**
   * Remove appointment by vet
   * @param {String} vetId
   * @param {String} appointmentId
   * @returns {Boolean}
   */
  async removeAppointmentByVet(vetId, appointmentId) {
    const removed = await this.#vetRepository.removeAppointmentByVet(
      vetId,
      appointmentId
    );
    if (removed !== false) {
      transportMail.sendMail({
        from: fromSender,
        to: removed.user.email,
        subject: "Отменен час за ветеринарен лекар",
        html: appointmentRejected(
          removed.user.name.first,
          `${removed.vet.name.first} ${removed.vet.name.last}`,
          removed.startHour,
          removed.endHour,
          new Date(removed.date)
        ),
      });
      return true;
    } else {
      return false;
    }
  }
  /**
   * Confirm appointment
   * @param {String} vetId
   * @param {String} appointmentId
   * @returns {Boolean}
   */
  async confirmAppointment(vetId, appointmentId) {
    const confirmed = await this.#vetRepository.confirmAppointment(
      vetId,
      appointmentId
    );
    if (confirmed !== false) {
      transportMail.sendMail({
        from: fromSender,
        to: confirmed.user.email,
        subject: "Потвърден час за ветеринарен лекар",
        html: appointmentConfirmed(
          confirmed.user.name.first,
          `${confirmed.vet.name.first} ${confirmed.vet.name.last}`,
          confirmed.startHour,
          confirmed.endHour,
          new Date(confirmed.date)
        ),
      });
      return true;
    } else {
      return false;
    }
  }
}
module.exports = VetService;
