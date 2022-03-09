"use strict";
const User = require("../models/user");
const VetAppointment = require("../models/vetAppointment");
const roles = require("../models/roles");
const daysOfWeek = require("../models/daysOfWeek");
class VetRepository {
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
}
module.exports = VetRepository;
