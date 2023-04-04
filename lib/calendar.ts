// STDLIB OVERRIDES
declare global {
  interface Date {
    /**
     * Returns the date at 00:00:00.000
     */
    asDay(): Date;
    /**
     * Returns the date of the following day at 00:00:00.000
     */
    tomorrow(): Date;
    /**
     * Returns the date of the previous day at 00:00:00.000
     */
    yesterday(): Date;
    /**
     * Returns the date offset by the given number of days at 00:00:00.000
     * @param days - The number of days to offset the date by
     */
    offsetDays(days: number): Date;
    /**
     * Returns true if this date is after the provided date
     * @param date - The provided date
     */
    isAfter(date: Date): boolean;
  }

  interface Number {
    toString(): `${number}`;
  }
  interface DateConstructor {
    /**
     * Returns today's date at 00:00:00.000
     */
    today(): Date;
    /**
     * Returns the current time
     */
    currentTime: Date;

    dayHours: 24;
    dayMinutes: 1_440;
    daySeconds: 86_400_000;
    dayMillis: 86_400_000;

    hourMinutes: 60;
    hourSeconds: 3_600;
    hourMillis: 3_600_000;

    minuteSeconds: 60;
    minuteMillis: 60_000;

    secondMillis: 1_000;
  }
  interface String {
    /**
     * Throws an error if the string cannot be parsed as a date.
     */
    toDate(): Date;
  }
}
Date.prototype.asDay = function () {
  return new Date(this.getFullYear(), this.getMonth(), this.getDate());
};
Date.prototype.offsetDays = function (days: number) {
  return new Date(this.asDay().getTime() + days * Date.daySeconds);
};
Date.prototype.tomorrow = function () {
  return this.offsetDays(1);
};
Date.prototype.yesterday = function () {
  return this.offsetDays(-1);
};
Date.prototype.isAfter = function (date: Date) {
  return this.getTime() > date.getTime();
};
Date.today = function () {
  return Date.currentTime.asDay();
};
Object.defineProperty(Date, "currentTime", {
  get: () => {
    // @ts-expect-error - hidden property
    if (Date.setTime) return Date.setTime;
    return new Date();
  },
  set: (value: Date | `${number}:${number}${"" | `:${number}`}`) => {
    if (typeof value === "string") {
      const [hours, minutes, rawSeconds] = value.split(":").map((n) => parseInt(n));
      if (isNaN(hours) || isNaN(minutes)) return new Error(`Invalid time: ${value}`);
      const seconds = isNaN(rawSeconds) ? 0 : rawSeconds;
      // @ts-expect-error - hidden property
      Date.setTime = new Date(
        Date.today().getTime() +
          hours * Date.hourMillis +
          minutes * Date.minuteMillis +
          seconds * Date.secondMillis,
      );
    }
    // @ts-expect-error - hidden property
    else Date.setTime = value;
  },
});
// @ts-expect-error - hidden property
Date.interval = null;
// @ts-expect-error - hidden property
Date.superSpeed = function (from?: `${number}:${number}`) {
  // @ts-expect-error - hidden property
  if (Date.interval) clearInterval(Date.interval);
  if (!from) return;
  // @ts-expect-error - hidden property
  Date.currentTime = from;
  // @ts-expect-error - hidden property
  Date.interval = setInterval(() => {
    const now = Date.currentTime;
    const hours = now.getHours();
    const minutes = now.getMinutes();
    let setMins;
    let setHrs;
    if (minutes === 59) {
      setMins = 0;
      setHrs = hours + 1;
    } else {
      setMins = minutes + 1;
      setHrs = hours;
    }
    // @ts-expect-error - hidden property
    Date.currentTime = `${setHrs.toString().padStart(2, "0")}:${setMins
      .toString()
      .padStart(2, "0")}`;
  }, 1000);
};
// @ts-expect-error - hidden property
Date.normalSpeed = function (from?: `${number}:${number}`) {
  // @ts-expect-error - hidden property
  if (Date.interval) clearInterval(Date.interval);
  if (!from) return;
  // @ts-expect-error - hidden property
  Date.currentTime = from;
  // @ts-expect-error - hidden property
  Date.interval = setInterval(() => {
    const now = Date.currentTime;
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    let setSecs;
    let setMins;
    let setHrs;
    if (seconds === 59) {
      setSecs = 0;
      if (minutes === 59) {
        setMins = 0;
        setHrs = hours + 1;
      } else {
        setMins = minutes + 1;
        setHrs = hours;
      }
    } else {
      setSecs = seconds + 1;
      setMins = minutes;
      setHrs = hours;
    }
    // @ts-expect-error - hidden property
    Date.currentTime = `${setHrs.toString().padStart(2, "0")}:${setMins
      .toString()
      .padStart(2, "0")}:${setSecs.toString().padStart(2, "0")}`;
  }, 1000);
};
Date.dayHours = 24;
Date.dayMinutes = 1_440;
Date.daySeconds = 86_400_000;
Date.dayMillis = 86_400_000;
Date.hourMinutes = 60;
Date.hourSeconds = 3_600;
Date.hourMillis = 3_600_000;
Date.minuteSeconds = 60;
Date.minuteMillis = 60_000;
Date.secondMillis = 1_000;
String.prototype.toDate = function () {
  const date = new Date(`${this}`);
  if (isNaN(date.getTime())) throw new Error(`Invalid date: ${this}`);
  return date;
};

// CALENDAR DATA
const HOURS = [
  "00",
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12",
  "13",
  "14",
  "15",
  "16",
  "17",
  "18",
  "19",
  "20",
  "21",
  "22",
  "23",
  "24",
] as const;
export type Hour = (typeof HOURS)[number];
const MINUTES = ["00", "05", "10", "15", "20", "25", "30", "35", "40", "45", "50", "55"] as const;
export type Minute = (typeof MINUTES)[number];
export type TimeStamp = `${Hour}:${Minute}`;
export interface Break {
  reason: string;
  start: TimeStamp;
  end: TimeStamp;
}
export interface Shift {
  start: TimeStamp | null;
  end: TimeStamp | null;
  scheduledUnpaid: Break[];
}
export const enum OverrideType {
  hourlyPay = 0,
  overtimeRate = 1,
}
export interface DayData<DateForm extends Date | string = Date> extends Shift {
  date: DateForm;
  overridePay?: [number, OverrideType];
}
export type PatternDays = [
  Shift | null,
  Shift | null,
  Shift | null,
  Shift | null,
  Shift | null,
  Shift | null,
  Shift | null,
][];
export interface ShiftPattern<DateForm extends Date | string = Date> {
  pattern: PatternDays;
  oneOffs: DayData<DateForm>[];
  startDates: DateForm[];
}
export interface Currency {
  symbol: "$" | "£" | "€" | "¥" | "₹";
  precision: number;
}
export interface CalendarData<DateForm extends Date | string = Date> {
  currency: Currency;
  hourlyPay: number;
  days: DayData<DateForm>[] | ShiftPattern<DateForm>;
  alreadyWorked: Record<number, Shift>;
}

class CalendarClass {
  constructor() {
    this.storedData = this.load();
    setInterval(() => this.save(), Date.minuteMillis);
  }

  private storedData: CalendarData;

  // LOADING
  private load() {
    const parsed = JSON.parse(localStorage.getItem("calendar") || "{}") as CalendarData<string>;
    if (!Object.keys(parsed).length)
      return {
        currency: { symbol: "£", precision: 2 },
        hourlyPay: NaN,
        days: [],
        alreadyWorked: [],
      } as CalendarData;
    this.withoutSaving(() => this.loadtimeUpdates(parsed));
    return parsed as unknown as CalendarData;
  }

  private loadtimeUpdates(calendarData: CalendarData<string>) {
    this.parseDates(calendarData);
    const parsed = calendarData as unknown as CalendarData;
    this.updateShiftPattern(parsed);
    this.archiveWorkedDays(parsed);
  }

  private parseDates(parsed: CalendarData<string>) {
    // @ts-expect-error - expect day.date to not be a Date; we are converting
    if (Array.isArray(parsed.days)) parsed.days.forEach((day) => (day.date = day.date.toDate()));
    // @ts-expect-error - expect day.startDates to not be a Date; we are converting
    else parsed.days.startDates = parsed.days.startDates.map((date) => date.toDate());
  }

  private updateShiftPattern(parsed: CalendarData) {
    if (Array.isArray(parsed.days)) return;
    const { pattern, startDates } = parsed.days;
    const filtered = startDates.filter((date) => Date.today().isAfter(date));
    const startDate = filtered[filtered.length - 1];
    parsed.days = this.createShiftPatternDays(pattern, startDate);
  }

  private archiveWorkedDays(parsed: CalendarData) {
    if (Array.isArray(parsed.days)) {
      const unworked = parsed.days.filter((day) => {
        const worked = Date.today().isAfter(day.date.asDay());
        if (worked) parsed.alreadyWorked[day.date.getTime()] = day;
        return !worked;
      });
      parsed.days = unworked;
    } else {
      const mostRecent = new Date(Math.max(...Object.keys(parsed.alreadyWorked).map(Number)));
      let lastDayChecked = mostRecent.asDay();
      while (Date.today().isAfter(lastDayChecked)) {
        const dayInfo = this.getShiftForDay(lastDayChecked, parsed.days);
        const oneOff = parsed.days.oneOffs.find((day) => day.date.asDay() === lastDayChecked);

        const key = lastDayChecked.getTime();

        if (oneOff) parsed.alreadyWorked[key] = oneOff;
        else if (dayInfo && !(dayInfo instanceof Error)) parsed.alreadyWorked[key] = dayInfo;
        else parsed.alreadyWorked[key] = { start: null, end: null, scheduledUnpaid: [] };
      }
    }
  }

  // SAVING
  private performSave = true;

  private save() {
    if (this.performSave) {
      localStorage.setItem("calendar", JSON.stringify(this.storedData));
      this.storedData = this.load();
    }
  }

  private withoutSaving<T>(fn: () => T) {
    this.performSave = false;
    const result = fn();
    this.performSave = true;
    return result;
  }

  // PRIVATE API
  private createShiftPatternDays(pattern: PatternDays, startDate: Date) {
    const startDates = [startDate.asDay().offsetDays(-7 * pattern.length), startDate.asDay()];
    // create a year's worth of week Zero day zero dates
    while (startDates.length < 52 / pattern.length)
      startDates.push(startDates[startDates.length - 1].offsetDays(7 * pattern.length));
    return { pattern, startDates, oneOffs: [] };
  }
  // PUBLIC API
  public getShiftForDay(day: Date, useShiftPattern?: ShiftPattern) {
    const shiftPattern = useShiftPattern ?? this.storedData.days;
    if (Array.isArray(shiftPattern)) {
      return shiftPattern.find((cur) => cur.date.asDay() === day) ?? null;
    }
    const { pattern, startDates } = shiftPattern;
    const weekZero = startDates
      .filter((sDay) => day.isAfter(sDay) || day.asDay().getTime() === sDay.asDay().getTime())
      .reduce<Date>((max, cur) => (max.isAfter(cur) ? max : cur), new Date(0, 0, 1));
    const dayOffset = (day.getTime() - weekZero.getTime()) / Date.dayMillis;
    return pattern[~~(dayOffset / 7)]?.[~~(dayOffset % 7)];
  }

  public setShiftPattern(pattern: PatternDays, startDate: Date) {
    this.storedData.days = this.createShiftPatternDays(pattern, startDate);
    this.save();
  }

  public appendDay(day: DayData) {
    if (!Array.isArray(this.storedData.days))
      return {
        confirm: () => {
          this.storedData.days = [];
          this.appendDay(day);
        },
      };

    this.storedData.days.push(day);
    this.save();
  }

  public appendOneOff(oneOff: DayData) {
    if (Array.isArray(this.storedData.days)) throw new Error("Cannot add one-off to non-pattern");
    this.storedData.days.oneOffs.push(oneOff);
  }

  public earningsNow() {
    const { hourlyPay } = this.storedData;
    if (isNaN(hourlyPay)) return new Error("No hourly pay set");

    let todaysShift = this.getShiftForDay(Date.today())!;
    if (!todaysShift || todaysShift instanceof Error)
      return new Error("No shift for today", { cause: todaysShift });

    const { start, end, scheduledUnpaid } = todaysShift;
    if (!start || !end) return new Error("No shift times for today");

    const startTime = new Date(0, 0, 1, +start.split(":")[0], +start.split(":")[1]);
    const endTime = new Date(0, 0, 1, +end.split(":")[0], +end.split(":")[1]);
    const breakTimes = scheduledUnpaid.map((unpaid) => {
      return {
        start: new Date(0, 0, 1, +unpaid.start.split(":")[0], +unpaid.start.split(":")[1]),
        end: new Date(0, 0, 1, +unpaid.end.split(":")[0], +unpaid.end.split(":")[1]),
      };
    });
    const nowTime = new Date(
      0,
      0,
      1,
      Date.currentTime.getHours(),
      Date.currentTime.getMinutes(),
      Date.currentTime.getSeconds(),
    );

    // shift not yet started
    if (startTime.isAfter(nowTime)) return 0;

    // shift completed
    if (nowTime.isAfter(endTime)) {
      const gross =
        (hourlyPay * Math.abs(endTime.getTime() - startTime.getTime())) / Date.hourMillis;
      const unpaid = breakTimes.reduce<number>((acc, cur) => {
        const durationHours = Math.abs(cur.end.getTime() - cur.start.getTime()) / Date.hourMillis;
        return acc + durationHours;
      }, 0);
      const deductions = hourlyPay * unpaid;
      const actual = gross - deductions;
      return actual;
    }

    // shift in progress
    const gross = (hourlyPay * Math.abs(nowTime.getTime() - startTime.getTime())) / Date.hourMillis;
    const unpaid = breakTimes.reduce<number>((acc, cur) => {
      // break not yet started -> no change
      if (cur.start.isAfter(nowTime)) return acc;
      // break ended -> full deduction
      if (nowTime.isAfter(cur.end))
        return acc + Math.abs(cur.end.getTime() - cur.start.getTime()) / Date.hourMillis;
      // break in progress -> partial deduction
      return acc + Math.abs(nowTime.getTime() - cur.start.getTime()) / Date.hourMillis;
    }, 0);
    const deductions = hourlyPay * unpaid;
    const actual = gross - deductions;
    return actual;
  }

  public set hourlyPay(pay: number) {
    this.storedData.hourlyPay = pay;
    this.save();
  }
  public get hourlyPay() {
    return this.storedData.hourlyPay;
  }

  public get currency() {
    return this.storedData.currency.symbol;
  }
  public get currencyPrecision() {
    return this.storedData.currency.precision;
  }

  public set fullCurrency(currency: Currency) {
    this.storedData.currency = currency;
    this.save();
  }
}

export const Calendar = new CalendarClass();
