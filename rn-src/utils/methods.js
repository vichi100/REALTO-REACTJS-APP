import { Linking } from "react-native";

export const makeCall = (mobile) => {
  const updatedMobile = mobile.startsWith("+91") ? mobile : `+91${mobile}`;
  const url = `tel://${updatedMobile}`;
  Linking.openURL(url).catch((err) => {
    console.error("Failed to make a call:", err);
  });
};

export const numDifferentiation = value => {
  var val = Math.abs(value);
  if (val >= 10000000) {
    val = parseFloat((val / 10000000).toFixed(2)) + " Cr";
  } else if (val >= 100000) {
    val = parseFloat((val / 100000).toFixed(2)) + " Lac";
  } else if (val >= 1000) {
    val = parseFloat((val / 1000).toFixed(2)) + " K";
  }
  return val;
};

export const dateFormat = date => {
  // // console.log(date.slice(0, 16));
  return date.slice(0, 16).trim();
};

export const addDays = (theDate, days) => {
    return new Date(theDate.getTime() + days*24*60*60*1000);
}

// Function to format the date
export const formatIsoDateToCustomString = (isoString) => {
  // 1. Create a Date object from the ISO string
  const date = new Date(isoString);

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    console.error("Invalid date string provided:", isoString);
    return "Invalid Date";
  }

  // 2. Get day of the week, month, day of the month, and year
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const dayOfWeek = days[date.getDay()];
  const month = months[date.getMonth()];
  const dayOfMonth = date.getDate();
  const year = date.getFullYear();

  // 3. Construct the desired string format
  return `${dayOfWeek} ${month} ${dayOfMonth} ${year}`;
};


export const camalize = (str) => {
  if (!str) return ""; // Handle null or undefined input
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};


export const formatClientNameForDisplay = (inputString) => {
  let formattedString = inputString; // Initialize with the original string

  // Ensure the input is a valid string before attempting operations
  if (typeof inputString === 'string' && inputString) { // Check for truthy and non-empty string
    const words = inputString.split(' '); // Split the string by spaces

    if (words.length > 2) {
      // If there are more than two words, insert a newline after the second word
      formattedString = words[0] + ' ' + words[1] + '\n' + words.slice(2).join(' ');
    }
  }

  return formattedString;
}

export const formatMobileNumber = (mobile) => {
  if (!mobile) return '';
  // Remove any existing +91 or 91 prefix, then add +91 cleanly
  return `+91 ${mobile.replace(/^(\+91|91)/, '').trim()}`;
};
