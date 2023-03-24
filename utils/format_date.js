export const formatDate = (date, option) => {
  if (!date) {
    return "";
  }

  let currentDate = typeof date === "string" ? new Date(date) : date;

  if (option === "mm-yyyy") {
    return `${
      currentDate.getUTCMonth() + 1 < 10
        ? "0" + (currentDate.getUTCMonth() + 1)
        : currentDate.getUTCMonth() + 1
    }/${currentDate.getFullYear()}`;
  }

  return `${
    currentDate.getUTCDate() < 10
      ? "0" + currentDate.getUTCDate()
      : currentDate.getUTCDate()
  }/${
    currentDate.getUTCMonth() + 1 < 10
      ? "0" + (currentDate.getUTCMonth() + 1)
      : currentDate.getUTCMonth() + 1
  }/${currentDate.getFullYear()}`;
};
