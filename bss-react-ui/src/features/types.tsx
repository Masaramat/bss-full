export const formatCurrency = (amount: number) => {
    // Assuming amount is a numeric value
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return formatter.format(amount);
  };
  
  export const capitalizeFirstLetter = (input: string): string => {
    if (typeof input !== 'string') {
      throw new TypeError('Input should be a string');
    }
  
    if (input.trim().length === 0) {
      return input; // Return empty string if input is empty or whitespace
    }
    
    return input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();
  };
  
  export const formatDate = (dateString: string): string => {
    if (!dateString) {
      return "";
    }
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: '2-digit',
    }).format(date);
  };


// export const APP_URL = 'http://localhost:8080/api/v1';
export const APP_URL = 'http://141.98.152.84:8080/api/v1';


export type MonthyReport = {
    month: number;
    amount: number;
  }

  export const maskAccountNumber = (accountNo: string) => {
    if (accountNo.length <= 4) {
      return accountNo;
    }
  
    const firstTwo = accountNo.slice(0, 2);
    const lastTwo = accountNo.slice(-2);
    const middleLength = accountNo.length - 4;
    const maskedMiddle = '*'.repeat(middleLength);
  
    return firstTwo + maskedMiddle + lastTwo;
  }


export const numberToNairaWords = (amount: number): string => {
  if (amount === 0) return "Zero Naira";

  const belowTwenty = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const thousands = ["", "Thousand", "Million", "Billion", "Trillion"];

  function helper(num: number): string {
    if (num === 0) return "";
    if (num < 20) return belowTwenty[num];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + belowTwenty[num % 10] : "");
    return belowTwenty[Math.floor(num / 100)] + " Hundred" + (num % 100 !== 0 ? " and " + helper(num % 100) : "");
  }

  let naira = Math.floor(amount);
  let kobo = Math.round((amount - naira) * 100);

  let nairaWords = "";
  let i = 0;

  while (naira > 0) {
    if (naira % 1000 !== 0) {
      let prefix = helper(naira % 1000) + (thousands[i] ? " " + thousands[i] : "");
      nairaWords = prefix + (nairaWords ? ", " : "") + nairaWords;
    }
    naira = Math.floor(naira / 1000);
    i++;
  }

  let result = nairaWords + " Naira";

  if (kobo > 0) {
    let koboWords = helper(kobo);
    result += " , " + koboWords + " Kobo";
  }

  return result + " Only";
}