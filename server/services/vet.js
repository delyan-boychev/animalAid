"use strict";
const VetRepository = require("../repositories/vet");
const moment = require("moment");
class VetService {
  #vetRepository = new VetRepository();
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
}
module.exports = VetService;
