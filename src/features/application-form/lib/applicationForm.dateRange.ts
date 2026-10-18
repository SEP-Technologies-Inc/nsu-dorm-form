export type DateRange = {
  start: string;
  end: string;
};

const inputDatePattern = /^(\d{4})-(\d{2})-(\d{2})$/;

function parseInputDate(value: string) {
  const match = inputDatePattern.exec(value);

  if (!match) {
    return null;
  }

  const [, yearText, monthText, dayText] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

function formatInputDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function getAcademicPeriodId(value: string): string | null {
  const date = parseInputDate(value);

  if (!date) {
    return null;
  }

  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;

  if (month === 1) {
    return `semester-1-${year - 1}`;
  }

  if (month >= 2 && month <= 6) {
    return `semester-2-${year}`;
  }

  if (month >= 7 && month <= 8) {
    return `summer-${year}`;
  }

  return `semester-1-${year}`;
}

export function isDateRangeWithinAcademicPeriod(start: string, end: string): boolean {
  const startPeriod = getAcademicPeriodId(start);
  const endPeriod = getAcademicPeriodId(end);

  return startPeriod !== null && startPeriod === endPeriod;
}

export function splitDateRange(start: string, end: string): DateRange[] {
  const currentDate = parseInputDate(start);
  const finalDate = parseInputDate(end);
  const ranges: DateRange[] = [];

  if (!currentDate || !finalDate || currentDate > finalDate) {
    return ranges;
  }

  while (currentDate <= finalDate) {
    const periodStart = new Date(currentDate);
    const periodEnd = new Date(currentDate);

    periodEnd.setUTCDate(periodEnd.getUTCDate() + 6);

    if (periodEnd > finalDate) {
      periodEnd.setTime(finalDate.getTime());
    }

    ranges.push({
      start: formatInputDate(periodStart),
      end: formatInputDate(periodEnd),
    });

    currentDate.setUTCDate(currentDate.getUTCDate() + 7);
  }

  return ranges;
}
