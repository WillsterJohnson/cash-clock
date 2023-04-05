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
     * Checks if two dates are the same, to the specified precision
     */
    equals(
      date1: Date,
      date2: Date,
      precision?: "year" | "month" | "day" | "hour" | "minute" | "second" | "millis",
    ): boolean;
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

    EPOCH: Date;
  }

  interface String {
    /**
     * Throws an error if the string cannot be parsed as a date.
     */
    toDate(): Date;
  }

  interface ObjectConstructor {
    /**
     * Returns true if the object is empty
     */
    isEmpty(obj: object): obj is Empty;
  }
}
/* DATE */
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
/* DATE CONSTRUCTOR */
Date.today = function () {
  return Date.currentTime.asDay();
};
Date.equals = function (
  date1: Date,
  date2: Date,
  precision: "year" | "month" | "day" | "hour" | "minute" | "second" | "millis" = "millis",
) {
  switch (precision) {
    case "year":
      return date1.getFullYear() === date2.getFullYear();
    case "month":
      return Date.equals(date1, date2, "year") && date1.getMonth() === date2.getMonth();
    case "day":
      return Date.equals(date1, date2, "month") && date1.getDate() === date2.getDate();
    case "hour":
      return Date.equals(date1, date2, "day") && date1.getHours() === date2.getHours();
    case "minute":
      return Date.equals(date1, date2, "hour") && date1.getMinutes() === date2.getMinutes();
    case "second":
      return Date.equals(date1, date2, "minute") && date1.getSeconds() === date2.getSeconds();
    case "millis":
      return (
        Date.equals(date1, date2, "second") && date1.getMilliseconds() === date2.getMilliseconds()
      );
  }
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
Date.EPOCH = new Date(0);
/* STRING */
String.prototype.toDate = function () {
  const date = new Date(`${this}`);
  if (isNaN(date.getTime())) throw new Error(`Invalid date: ${this}`);
  return date;
};
/* OBJECT */
Object.isEmpty = function (obj: object): obj is Empty {
  return Object.keys(obj).length === 0;
};
export type Empty = { [key: string]: never };
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
  start: TimeStamp;
  end: TimeStamp;
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
  Shift | Empty,
  Shift | Empty,
  Shift | Empty,
  Shift | Empty,
  Shift | Empty,
  Shift | Empty,
  Shift | Empty,
][];
export interface ShiftPattern<DateForm extends Date | string = Date> {
  pattern: PatternDays;
  startDates: DateForm[];
}
export interface Currency {
  symbol: "$" | "£" | "€" | "¥" | "₹";
  precision: number;
}
export interface CalendarData<DateForm extends Date | string = Date> {
  currency: Currency;
  hourlyPay: number;
  shiftPattern: ShiftPattern<DateForm>;
  oneOffs: DayData<DateForm>[];
  alreadyWorked: Record<number, Shift | Empty>;
}

class CalendarClass {
  constructor() {
    this.storedData = this.load();
    setInterval(() => this.save(), Date.minuteMillis);
  }

  private storedData: CalendarData;

  // LOADING
  private validate(
    data: Partial<CalendarData<string | Date>>,
  ): data is CalendarData<string | Date> {
    if (Object.isEmpty(data)) throw new Error("No data to validate");

    if (!data.currency) throw new Error("No currency");
    if (typeof data.currency !== "object") throw new Error("Invalid currency");
    if (!data.currency.symbol) throw new Error("No currency symbol");
    if (!["$", "£", "€", "¥", "₹"].includes(data.currency.symbol))
      throw new Error("Invalid currency symbol");
    if (!data.currency.precision) throw new Error("No currency precision");
    if (typeof data.currency.precision !== "number") throw new Error("Invalid currency precision");

    if (!data.hourlyPay) throw new Error("No hourly pay");
    if (typeof data.hourlyPay !== "number") throw new Error("Invalid hourly pay");

    if (!data.shiftPattern) throw new Error("No shift pattern");
    if (typeof data.shiftPattern !== "object") throw new Error("Invalid shift pattern");
    if (!data.shiftPattern.pattern) throw new Error("No shift pattern pattern");
    if (!Array.isArray(data.shiftPattern.pattern)) throw new Error("Invalid shift pattern pattern");
    if (!data.shiftPattern.startDates) throw new Error("No shift pattern start dates");
    if (!Array.isArray(data.shiftPattern.startDates))
      throw new Error("Invalid shift pattern start dates");

    if (!data.oneOffs) throw new Error("No one offs");
    if (!Array.isArray(data.oneOffs)) throw new Error("Invalid one offs");

    if (!data.alreadyWorked) throw new Error("No already worked");
    if (typeof data.alreadyWorked !== "object") throw new Error("Invalid already worked");

    return true;
  }

  private load() {
    let parsed = JSON.parse(localStorage.getItem("calendar") || "{}") as CalendarData<string>;
    try {
      this.validate(parsed);
    } catch {
      parsed = {
        currency: { symbol: "£", precision: 2 },
        hourlyPay: 10,
        alreadyWorked: [],
        oneOffs: [],
        shiftPattern: {
          pattern: [[{}, {}, {}, {}, {}, {}, {}]],
          startDates: [Date.today().toString()],
        },
      };
    }
    this.withoutSaving(() => this.loadtimeUpdates(parsed));
    return parsed as unknown as CalendarData;
  }

  private loadtimeUpdates(calendarData: CalendarData<string>) {
    this.parseDates(calendarData);
    const parsed = calendarData as unknown as CalendarData;
    this.archiveWorkedDays(parsed);
    this.updateShiftPattern(parsed);
  }

  private parseDates(parsed: CalendarData<string>) {
    // @ts-expect-error - unsafe date conversion
    parsed.shiftPattern.startDates = parsed.shiftPattern.startDates.map((date) => date.toDate());
    parsed.oneOffs = parsed.oneOffs.map((day) => {
      // @ts-expect-error - unsafe date conversion
      day.date = day.date.toDate();
      return day;
    });
  }

  private updateShiftPattern(parsed: CalendarData) {
    const { pattern, startDates } = parsed.shiftPattern;
    const filtered = startDates.filter(
      (date) => Date.today().isAfter(date) || Date.equals(Date.today(), date, "day"),
    );
    const startDate = filtered[filtered.length - 1];
    parsed.shiftPattern = this.createShiftPatternDays(pattern, startDate);
  }

  private archiveWorkedDays(parsed: CalendarData) {
    const mostRecent = new Date(Math.max(...Object.keys(parsed.alreadyWorked).map(Number)));
    let lastDayChecked = mostRecent.asDay();
    while (Date.today().isAfter(lastDayChecked)) {
      const shift = this.getShiftForDay(lastDayChecked, parsed);
      parsed.alreadyWorked[lastDayChecked.getTime()] = shift;
      lastDayChecked = lastDayChecked.tomorrow();
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
    const startDates = [] as Date[];
    if (startDate.asDay().getTime() === Date.today().getTime())
      startDates.push(startDate.asDay().offsetDays(-7 * pattern.length));
    startDates.push(startDate.asDay());
    // create a year's worth of week Zero day zero dates
    while (startDates.length < 52 / pattern.length)
      startDates.push(startDates[startDates.length - 1].offsetDays(7 * pattern.length));
    return { pattern, startDates };
  }
  // PUBLIC API
  public getShiftForDay(day: Date, altCalendarData?: CalendarData): DayData | Shift | Empty {
    const alreadyWorked = (altCalendarData ?? this.storedData).alreadyWorked[day.asDay().getTime()];
    if (alreadyWorked) return alreadyWorked;
    const oneOff = (altCalendarData ?? this.storedData).oneOffs.find((cur) =>
      Date.equals(cur.date, day, "day"),
    );
    if (oneOff) return oneOff;
    const shiftPattern = (altCalendarData ?? this.storedData).shiftPattern;
    const { pattern, startDates } = shiftPattern;
    const weekZero = startDates
      .filter((sDay) => day.isAfter(sDay) || Date.equals(day, sDay, "day"))
      .reduce<Date>((max, cur) => (max.isAfter(cur) ? max : cur), Date.EPOCH);
    if (Date.equals(weekZero, Date.EPOCH)) return {};
    const dayOffset = (day.getTime() - weekZero.getTime()) / Date.dayMillis;
    return pattern[~~(dayOffset / 7)][~~(dayOffset % 7)];
  }

  public setShiftPattern(pattern: PatternDays, startDate: Date) {
    this.storedData.shiftPattern = this.createShiftPatternDays(pattern, startDate);
    this.save();
  }

  public appendOneOff(day: DayData) {
    this.storedData.oneOffs.push(day);
    this.save();
  }

  public earningsNow() {
    let todaysShift = this.getShiftForDay(Date.today());
    if (Object.isEmpty(todaysShift)) return new Error("No shift for today");

    const hourlyPay =
      "overridePay" in todaysShift && todaysShift.overridePay !== undefined
        ? todaysShift.overridePay[1] === OverrideType.hourlyPay
          ? todaysShift.overridePay[0]
          : todaysShift.overridePay[0] * this.storedData.hourlyPay
        : this.storedData.hourlyPay;

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
