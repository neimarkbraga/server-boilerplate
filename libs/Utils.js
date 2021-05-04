class Utils {
  static getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  static pascalToKebab(str = '') {
    return str.split(/(?=[A-Z])/).join('-');
  }

  static textLeftPadding(value, length, padding = '0') {
    value = String(value);
    if(padding)
      while (value.length < length)
        value = padding + value;
    return value;
  }
}

module.exports = Utils;