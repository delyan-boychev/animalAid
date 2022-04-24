"use strict";
const User = require("../models/user");
const VetAppointment = require("../models/vetAppointment");
const roles = require("../models/roles");
const daysOfWeek = require("../models/daysOfWeek");
class VetRepository {
  /**
   * Create schedule
   * @param {String} vetId
   * @param {Object} scheduleVet
   * @returns {Boolean}
   */
  async createSchedule(vetId, scheduleVet) {
    try {
      const vet = await User.findOne({ _id: vetId, role: roles.Vet });
      if (vet !== null) {
        if (vet.scheduleVet === undefined) {
          vet.scheduleVet = scheduleVet;
          await vet.save();
          return true;
        }
        {
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
   * Create appointment
   * @param {String} userId
   * @param {Object} appointment
   * @returns {Boolean}
   */
  async createAppointment(userId, appointment) {
    try {
      const vet = await User.findOne({
        _id: appointment.vetId,
        role: roles.Vet,
      });
      if (vet !== null) {
        if (vet.scheduleVet !== undefined) {
          let scheduleDay =
            vet.scheduleVet[daysOfWeek[appointment.date.getDay()]];
          let hourExists =
            scheduleDay.id(appointment.hour) !== null ? true : false;
          let valid =
            hourExists === true &&
            vet.scheduleVet.typeAppointments.includes(
              appointment.typeAppointment
            ) &&
            vet.typeAnimals.includes(appointment.typeAnimal);
          if (valid === true) {
            if (
              (await VetAppointment.countDocuments({
                hour: appointment.hour,
                date: appointment.date,
                vet: vet._id,
              })) === 0
            ) {
              const a = new VetAppointment();
              a.user = userId;
              a.vet = vet._id;
              a.hour = appointment.hour;
              a.typeAnimal = appointment.typeAnimal;
              a.typeAppointment = appointment.typeAppointment;
              a.otherInfo = appointment.otherInfo;
              a.date = appointment.date;
              a.save();
              return true;
            } else {
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
    } catch {
      return false;
    }
  }
  /**
   * Get hours
   * @param {String} vetId
   * @param {Date} date
   * @returns {Object}
   */
  async getHours(vetId, date) {
    try {
      const vet = await User.findOne({ _id: vetId, role: roles.Vet })
        .lean()
        .exec();
      if (vet !== null) {
        if (vet.scheduleVet !== undefined) {
          let day = daysOfWeek[date.getDay()];
          if (vet.scheduleVet[day].length > 0) {
            const appointments = await VetAppointment.find({
              vet: vetId,
              date,
            })
              .lean()
              .exec();
            return {
              hours: vet.scheduleVet[day].map((hour) => {
                let index = appointments.findIndex(
                  (a) => a.hour === hour._id.toString()
                );
                if (index === -1) {
                  hour["free"] = true;
                } else {
                  hour["free"] = false;
                  appointments.splice(index, 1);
                }
                return hour;
              }),
              vetInfo: {
                name: `${vet.name.first} ${vet.name.last}`,
                typeAnimals: vet.typeAnimals,
                typeAppointments: vet.scheduleVet.typeAppointments,
              },
              workingDays: Object.keys(vet.scheduleVet)
                .filter((e) => e !== "typeAppointments" && e !== "_id")
                .filter((e) => vet.scheduleVet[e].length > 0),
            };
          } else {
            return {
              hours: [],
              vetInfo: {
                name: `${vet.name.first} ${vet.name.last}`,
                typeAnimals: vet.typeAnimals,
                typeAppointments: vet.scheduleVet.typeAppointments,
              },
              workingDays: Object.keys(vet.scheduleVet)
                .filter((e) => e !== "typeAppointments" && e !== "_id")
                .filter((e) => vet.scheduleVet[e].length > 0),
            };
          }
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
   * Get appointments by vet id
   * @param {String} vetId
   * @param {Date} date
   * @returns {Object}
   */
  async getAppointmentsByVet(vetId, date) {
    try {
      const vet = await User.findOne({
        _id: vetId,
        moderationVerified: true,
        role: roles.Vet,
      }).exec();
      if (vet !== null) {
        if (vet.scheduleVet !== undefined) {
          let day = daysOfWeek[date.getDay()];
          if (vet.scheduleVet[day].length > 0) {
            const appointments = await VetAppointment.find({
              vet: vetId,
              date,
            })
              .populate("user", "name email phoneNumber")
              .lean()
              .exec();
            return {
              hours: vet.scheduleVet[day].map((hour) => {
                let appointment = appointments.find(
                  (a) => a.hour === hour._id.toString()
                );
                if (appointment !== undefined) {
                  delete appointment.vet;
                  delete appointment.hour;
                  return {
                    startHour: hour.startHour,
                    endHour: hour.endHour,
                    appointment,
                  };
                } else {
                  return { startHour: hour.startHour, endHour: hour.endHour };
                }
              }),
            };
          } else {
            return { hours: [] };
          }
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
   * Check vet and schedule
   * @param {String} vetId
   * @returns {Object}
   */
  async checkVetAndSchedule(vetId) {
    try {
      const vet = await User.findOne({
        _id: vetId,
        moderationVerified: true,
        role: roles.Vet,
      });
      if (vet !== null) {
        return { vetExists: true, schedule: vet.scheduleVet !== undefined };
      } else {
        return { vetExists: false, schedule: false };
      }
    } catch {
      return { vetExists: false, schedule: false };
    }
  }
  /**
   * Get appointments
   * @param {String} query
   * @returns {Object[]}
   */
  async getAppointments(query) {
    try {
      const appointments = await VetAppointment.find(query)
        .populate("vet", "name email imgFileName scheduleVet")
        .exec();
      const appointments2 = [];
      appointments.forEach((appointment) => {
        let day = daysOfWeek[new Date(appointment.date).getDay()];
        let app = appointment.toObject();
        app.hour = appointment.vet.scheduleVet[day].id(app.hour);
        appointments2.push(app);
      });
      return appointments2;
    } catch {
      return false;
    }
  }
  /**
   * Remove appointment
   * @param {String} userId
   * @param {String} appointmentId
   * @returns {Boolean|Object}
   */
  async removeAppointment(userId, appointmentId) {
    try {
      const d = await VetAppointment.deleteOne({
        _id: appointmentId,
        user: userId,
        date: { $gt: new Date().toISOString() },
      }).exec();
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
   * Remove appointment by vet
   * @param {String} vetId
   * @param {String} appointmentId
   * @returns {Boolean|Object}
   */
  async removeAppointmentByVet(vetId, appointmentId) {
    const appointment = await VetAppointment.findOne({
      _id: appointmentId,
      vet: vetId,
      date: { $gt: new Date().toISOString() },
    })
      .populate("vet", "name scheduleVet")
      .populate("user", "name email")
      .exec();
    if (appointment !== null) {
      let oldAppointment = appointment.toObject();
      delete oldAppointment.hour;
      let day = daysOfWeek[new Date(appointment.date).getDay()];
      let hour = appointment.vet.scheduleVet[day].find(
        (h) => h._id.toString() === appointment.hour
      );
      oldAppointment.startHour = hour.startHour;
      oldAppointment.endHour = hour.endHour;
      await VetAppointment.deleteOne({
        _id: appointmentId,
        vet: vetId,
        date: { $gt: new Date().toISOString() },
      }).exec();

      return oldAppointment;
    } else {
      return false;
    }
  }
  /**
   * Confirm appointment
   * @param {String} vetId
   * @param {String} appointmentId
   * @returns {Boolean|Object}
   */
  async confirmAppointment(vetId, appointmentId) {
    try {
      const appointment = await VetAppointment.findOne({
        _id: appointmentId,
        vet: vetId,
        date: { $gt: new Date().toISOString() },
      })
        .populate("vet", "name scheduleVet")
        .populate("user", "name email")
        .exec();
      if (appointment !== null) {
        let oldAppointment = appointment.toObject();
        delete oldAppointment.hour;
        let day = daysOfWeek[new Date(appointment.date).getDay()];
        let hour = appointment.vet.scheduleVet[day].find(
          (h) => h._id.toString() === appointment.hour
        );
        oldAppointment.startHour = hour.startHour;
        oldAppointment.endHour = hour.endHour;
        if (appointment.confirmed === false) {
          appointment.confirmed = true;
          await appointment.save();
          return oldAppointment;
        } else {
          return false;
        }
      }
    } catch {
      return false;
    }
  }
  /**
   * Review appointment
   * @param {String} userId
   * @param {String} appointmentId
   * @param {Number} rating
   * @param {String} review
   * @returns {Boolean}
   */
  async reviewAppointment(userId, appointmentId, rating, review) {
    try {
      const appointment = await VetAppointment.findOne({
        _id: appointmentId,
        user: userId,
        date: { $lte: new Date().toISOString() },
      })
        .populate("vet", "name scheduleVet")
        .populate("user", "name email")
        .exec();
      if (appointment !== null) {
        if (appointment.review === undefined) {
          appointment.review = { rating, review };
          await appointment.save();
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
module.exports = VetRepository;
